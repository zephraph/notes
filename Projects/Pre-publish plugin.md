## Motivation

I'm using [Obsidian Publish](https://obsidian.md/publish) to publish these notes. Part of my notes are private and part are public. I want the ability to add a plugin that hooks into [[Obsidian]]'s publish plugin to override its behavior. It should only publish the public aspect of my notes, not the private ones (which are denoted by a special delimiter in my files).

## Exploration

Okay, so the publish plugin is built in to [[Obsidian]], which means anything that I do to it is undocumented and unsupported. I'll essentially be [[monkey-patching]] it. 

Let's poke around at its insides a bit... 

### Digging through the console

From my work with [obsidian-tools](https://www.github.com/zephraph/obsidian-tools), I already know there's an `app` object exposed in the window object that represents the app instance (this is also documented in their [api documentation](https://github.com/obsidianmd/obsidian-api)). 

`app.plugins` has all of the community plugins, but it doesn't actually have any of the built-in plugins. When I was in the process of writing `app.plu` a suggested boxed popped up w/ either `.plugins` or `.internalPlugins`. Thanks firefox!

`app.internalPlugins.plugins.publish` is the ticket.

Digging into the publish plugin definition, there's not a whole lot that jumps out to me that says "hey, I handle uploading!". Also, this just looks like the definition/configuration. There's an `instance` key there that looks more interesting. 

![[obsidian-publish-plugin-console.png]]

After checking `.instance` I still didn't see anything that quite jumped out at me... but remember, this is an instance! JavaScript uses prototypal inheritance so that's a clue to also check `__proto__`.

`app.internalPlugins.plugins.publish.instance.__proto__` is _exactly_ what I was looking for. Lot's of goodies here. `apiUploadFile` sounds like its exactly what I want. Next step is to dig into the source and see what it does. 

If you expand the function definition it'll give you some metadata like `[[FunctionLocation]]` which is handy because that tells you what file it's in. Theoretically it's supposed to link to the file, but mine says it's on line 

### Searching for a needle

I opened up the console with <kbd>⌘</kbd>+<kbd>⎇</kbd>+<kbd>i</kbd> and headed over to the sources tab to see what I could discover. (I guess it's worth noting that I'm in firefox).

When I look in the side panel of the sources tab (you might have to expand the navigator, which'll be the button in the top right, under the element selection icon) this is what I see:

![[obsidian-sources-navigator.png]]

I started poking around in all these files, generally looking for anything related to the publish plugin. If the [[Obsidian]] team publishes source-maps, it (should) have an individual file listed out here. 

Unfortunately didn't find anything. Their `app.js` file is a whopping 31.8k lines after being pretty printed though, so that was my next place to search. I just searched for `publish`. There's ~120ish results, but that's not too bad. Found what I was looking for (the plugin definition) in the 64.5k line range. 


