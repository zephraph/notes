## Framing the context

[Andrew](https://twitter.com/hipstersmoothie) and I run a podcast called [devtools.fm](https://devtools.fm). To record our episodes we use this service called [riverside.fm](https://riverside.fm). Riverside is a browser based recording setup that can record audio as well as video. The particular reason we use this service is because it records hi-def versions of your video and audio inputs locally by buffering those to indexeddb. The stream other participants see is more lossy and may even drop video in parts (if there's a slow connection). That's totally fine though, given the background recording. Cleverly, as you have extra bandwidth the service will upload the hi-def version behind the scenes. If something happens and it can't it can still fully upload after you're recording or via a special `/upload` link. Typically this works great but for the last episode something went wrong for me and the majority of my recording didn't upload. 3.8 gigs of it. When I tried uploading after the episode it'd crash the tab due to being out of memory.

I'm nothing if not a sucker for rabbit holes, so I started investigating.
## The memory mystery

I technically didn't know they buffered video/audio in indexeddb at this point, but I _did_ know they buffered content on the client. A/V is pretty large and my understanding is that localStorage would be a no-go for that use-case. Easy enough to check!

In chrome if you open devtools and go to the `Applications` tab there's a `Storage` menu item in the left hand bar. Clicking that will give you an insight as to how much storage is being used via that domain (and _where_ it's being stored). I was greeted with this

![Screenshot of application tab in devtools showing 3.8 GB of IndexedDB storage being used](https://file.notion.so/f/s/e0167731-7633-486d-aba5-b0444f8b9576/Untitled.png?id=7f6c4548-8db8-41ed-b25e-bea29ad5022a&table=block&spaceId=e1babdbb-82ab-43b9-a7f8-3f553e93274e&expirationTimestamp=1692727200000&signature=shUZ0HJZgRh240xWc0xOFuOLHENspmG6hPUJfYKKBXM&downloadName=Untitled.png)

Clearly a lot of something was being stored in IndexedDB. It's cropped a bit above, but the domain for each database is listed out beside it so it was fairly simple to figure out which corresponded to my recording. There were four tables stored inside the db: audio, metadata, processed, and video. In Chrome's devtools you can click on a table to get a preview of what's contained inside each. audio and video were empty and metadata only had one entry. Turns out the processed table contained all the data I was concerned with.

![A preview of the processed table created by riverside during recording](https://file.notion.so/f/s/0285907d-90fc-42c7-a4a5-71416aa2ddc6/Untitled.png?id=4485a510-281a-4c92-ab39-900b1c1cd321&table=block&spaceId=e1babdbb-82ab-43b9-a7f8-3f553e93274e&expirationTimestamp=1692727200000&signature=pdG78leoUWhBzk1tdS_a93LDsRBE-CAgya1zTTFc2jE&downloadName=Untitled.png)

Turns out the table was filled with a bunch of 4 MB+ [ArrayBuffers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Looks like a bunch of encoded A/V data to me.

So when trying to upload it's probably reading too many of the ArrayBuffers into memory and subsequently running out of memory and crashing the tab. We told Riverside's support as much and they started looking into it. Unfortunately, I was also about to head out of state and wouldn't have access to my desktop where all this data was stored. That meant pairing with one of their engineers to figure out what's up likely wouldn't happen. I thought surely there would be an easy way to export all this data and send it to them, right? Surely...

## Dexie to the rescue

It would have been aweful convient if I could've just clicked a download button from the devtools to grab the database. So far as I'm aware though, that isn't possible. Also, IndexedDB's API is _not_ user friendly. Thankfully there are a lot of interface libraries out there and a lot of blog posts on how to use said libraries.

I found a [Medium article](https://dfahlander.medium.com/export-indexeddb-from-a-web-app-using-devtools-62c55a8996a1) by David Fahlander that gave a relatively simple way to export an indexeddb database. David is the creator of [dexie.js](https://dexie.org/), a simplified wrapper around indexeddb. I modified it a little bit and here's what I ended up with

```javascript
// This script is adapted from david fahlander's post: https://dfahlander.medium.com/export-indexeddb-from-a-web-app-using-devtools-62c55a8996a1
// You should be able to drop this in the console on a riverside.fm page once you're logged in. 

// Find the indexdb table name that you want to import by 2. Include dexie-export-import into the page.
const dbName = 'export-db'

// Small helper to load scripts. I would've used ESM, but needed import mapping
const loadScript = src => 
  new Promise(resolve => { 
    let script = document.createElement('script')
    script.src = src;
    script.onload = resolve;
    document.body.appendChild(script);
  })

await loadScript('https://unpkg.com/dexie');
await loadScript('https://unpkg.com/dexie-export-import');

let db = new Dexie(dbName);
const { verno, tables } await db.open();
db.close();

// I'll be honest, I don't know what this is doing. If you don't do it
// it'll error though. If you know, let me know, I'd like to fully understand.
db = new Dexie(dbName);
db.version(verno).stores(tables.reduce((p,c) => {
  p[c.name] = c.schema.primKey.keyPath || "";
  return p;
}, {}));

const blob = await db.export({
  numRowsPerChunk: 2 // This is important because riverside's rows can be 4mb and dexie's default is 2k rows which will absolutely crash the browser
});

document.body.innerHTML = `
  <a href=’${URL.createObjectURL(blob)}’>Right-click to download database export</a>
`
```

The heavy lifting is really performed by `dexie-export-import`, a utility used with `dexie` to do exactly what I needed to do... export and import. The most important change I made to this script from the blog post was the `numRowsPerChunk` addition to export options.

Remeber above where I showed the processed rows as being 4MB+? Well, by default `dexie` specifies _2000_ rows per chunk. Dexie actually performs streaming so the chunks are what will be held in memory at any one time. That means it'd basically try to load the whole 3GB+ into a chunk in one go. Want to guess what that did? OOM. As an aside, a neat trick you can do in chrome is call `console.memory` to see how much js heap space is available on the current page. Anyway, setting the rows per chunk to 2 was a conservative move that had the total memory usage hovering around 600MB average as it streamed the export and garbage collected.

After I ran the above script in the console I had a nice 5 GB+ json file with all the data in it that I happily shared with support. Missing accomplished... but not really.

## Going the last mile

As any maintainer knows, sometimes when user's try to help they just make your life a little more difficult. I'd sent support a link to a 5 GB json file in a potentially weird format and asked if they'd please ingest it. Probably not the most empathetic thing for me to do. Really we wanted to get the upload fixed as soon as possible so editing was unblocked. I figured due to that I should provide a way for them to easily get it imported into a state they'd be familiar with in prod. There are more examples in dexie's docs on how to do that and I again adapted one to do what I needed.

```javascript
// paste into console on any riverside.fm page
// drag file into box to upload

const dbName = 'import-db'

const loadScript = src => 
  new Promise(resolve => { 
    let script = document.createElement('script')
    script.src = src;
    script.onload = resolve;
    document.body.appendChild(script);
  })

await loadScript('https://unpkg.com/dexie');
await loadScript('https://unpkg.com/dexie-export-import');

let db = new Dexie('dbName');

// Here we create an area the file can be dropped to upload

const dropZone = document.createElement('div');
dropZone.setAttribute('style', `
  width: 600px;
  height: 20px;
  border: 2px dotted #bbb;
  border-radius: 10px;
  padding: 35px;
  color: #bbb;
  text-align: center;
`)
dropZone.textContent = "Drop your dexie recording here"

dropZone.ondragover = event => {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
};

// This is the magic sauce for uploading when the file is dropped in the box
dropZone.ondrop = async event => {
  event.stopPropagation();
  event.preventDefault();
  
  const recording = event.dataTransfer.files[0];
  if (!recording) throw new Error('Must drop recording');
  await db.delete();
  db = await Dexie.import(recording);
  console.log("Import finished");
}

// Didn't want to deal with making sure the dropzone wasn't covered so I just
// replace the whole page contents with the drop zone
document.body.replaceWith(dropZone)
```

After I ran the above script on another computer the riverside database was again available inside of indexeddb with the same tables and the same size. Mission accomplished.
## All's well that ends well

Thankfully sharing these scripts the riverside team was able to get the recording injested. Huge props to the team for being willing to spend the time working through this pretty weird case.

This was a fun rabbithole. I'd definitely recommend using dexie for any indexeddb related tasks, it's pretty solid.