---
id: 01GJHMEEB49GPD2SHQRS6J7A5M
tags: blog
---

I'm working towards using [[Obsidian]] as the tool to back my personal site. One of my goals in this endeavor is to ensure that my links are stable. That's pretty hard to do if the URL is based on a file path that can (and will) change. I'm always re-organizing, renaming, and moving stuff around so I need a better record of store. 

[[Obsidian]] supports [[frontmatter]] which means it's easy enough to add an ID as metadata on every page. Doing this manually would be a bit annoying though. There's a few problems to work through here

1. Add a method dynamically for generating IDs
2. Injecting IDs into new pages
3. Populating all my old notes with IDs

## ID generation

I learned about [[ULID|ULIDs]] recently which is an ID format that's shorter than UUIDs and also encodes a notion of time into the ID generation so that the actual IDs themselves are lexically sortable. That's an incredibly useful if you're wanting a chronological listing of posts only using their IDs.

There's a monotonic version of the ULID generation algorithm which essentially means that if multiple IDs are generated for the same span of time, they'll be separated by a counter. Here's an example from [their site](https://github.com/ulid/javascript#monotonic-ulids):

```js
import { monotonicFactory } from 'ulid'

const ulid = monotonicFactory()

// Strict ordering for the same timestamp, by incrementing the least-significant random bit by 1
ulid(150000) // 000XAL6S41ACTAV9WEVGEMMVR8
ulid(150000) // 000XAL6S41ACTAV9WEVGEMMVR9
ulid(150000) // 000XAL6S41ACTAV9WEVGEMMVRA
```

My ideal usage here is to be able to call `ulid()` with no args in the typical case of creating a new note. That should just generate the ULID off of the current timestamp. When populating ids for old notes though I'd like to go through and grab their created date in milliseconds and pass that through to the `ulid` function.

## [[Templater]] and automatic ID creation

A popular solution in the [[Obsidian]] community for templating is SilentVoid's [[Templater]]. It enables templates to have JS snippets that can be used to generate data when creating a new note. Perfect for generating IDs when I'm creating new files. 

First up I added a template like below into my `Templates` directory where [[Templater]] points to. 

```
---
id: <% tp.user.ulid() %>
---
```

Next I dropped a modified version of the [ulid library](https://github.com/ulid/javascript/blob/master/lib/index.ts) into in a `Scripts` directory that I pointed [[Templater]] to. See [the docs](https://silentvoid13.github.io/Templater/user-functions/script-user-functions.html) for more info on how that all works. 

```js
//... 
const metadata = new Proxy(
  {},
  {
    get: (_, prop) => {
      return globalThis.__ulid__?.[prop];
    },
    set: (_, prop, value) => {
      globalThis.__ulid__ ??= {};
      globalThis.__ulid__[prop] = value;
    },
  }
);

module.exports = (function monotonicFactory(currPrng) {
  if (!currPrng) {
    currPrng = detectPrng();
  }
  metadata.lastTime ??= 0;
  return function ulid(seedTime) {
    if (isNaN(seedTime)) {
      seedTime = Date.now();
    }
    if (seedTime <= metadata.lastTime) {
      const incrementedRandom = (metadata.lastRandom = incrementBase32(
        metadata.lastRandom
      ));
      return encodeTime(metadata.lastTime, TIME_LEN) + incrementedRandom;
    }
    metadata.lastTime = seedTime;
    const newRandom = (metadata.lastRandom = encodeRandom(
      RANDOM_LEN,
      currPrng
    ));
    return encodeTime(seedTime, TIME_LEN) + newRandom;
  };
})();
```

Now anytime I invoke [[Templater]] to create a new note: voila! An ID appears. 

## Adding IDs to all my old notes

There's probably a much, much better way to do what I'm about to describe. This isn't something I wanted to spend a whole lot of time on though. 

I commented out the 

If you open up the dev tools in obsidian (<kbd>cmd</kbd>+<kbd>⌥</kbd>+<kbd>i</kbd> on OSX) you can run JS in the console to exercise different APIs on the app. That includes reaching in and controlling plugins. 

First thing is I just need a list of all the files in my vault. That's easy enough.

```js
const files = app.vault.getFiles()
```

Next up I need a function to write an ID to the current file. The best way that I know to do that is to access the workspace's currently active view via `app.workspace.activeLeaf.view`. From that object you have access to `editor` and other properties like `lastFrontmatter` which help you figure out if the page has `frontmatter` without parsing it yourself. 

```js
const writeId = (id) => {
    const { editor, lastFrontmatter } = app.workspace.activeLeaf.view
    if (lastFrontmatter) {
        if (lastFrontmatter.includes('"id"')) {
            editor.setLine(1, `id: ${id}`)
        } else {
            editor.setCursor(1, 0)
            editor.insertText(`id: ${id}\n`)
        }
    } else {
        editor.setCursor(0, 0)
        editor.insertText(`---\nid: ${id}\n---\n`)
    }
}
```

Now that we can write to t

```js
const processFile = async (file) => {
    if (file.extension !== "md") return;
    await app.workspace.activeLeaf.openFile(file)
    const ctime = app.workspace.activeLeaf.view.file?.stat.ctime
    if (ctime) {
        const id = tp.user.ulid(ctime)
        writeId(id)
    }
    await app.workspace.activeLeaf.detach()
}
```

```js
const processFiles = async (files) => {
    for (const file of files) {
        await processFile(file)
    }
}
```

