## Motivation

I'm using [Obsidian Publish](https://obsidian.md/publish) to publish these notes. Part of my notes are private and part are public. I want the ability to add a plugin that hooks into [[Obsidian]]'s publish plugin to override its behavior. It should only publish the public aspect of my notes, not the private ones (which are denoted by a special delimiter in my files).

## Exploration

Okay, so the publish plugin is built in to [[Obsidian]], which means anything that I do to it is undocumented and unsupported. I'll essentially be [[monkey-patching]] it. 

Let's poke around at its insides a bit... 

### Digging through the console

From my work with [obsidian-tools](https://www.github.com/zephraph/obsidian-tools), I already know there's an `app` object exposed in the window object that represents the app instance (this is also documented in their [api documentation](https://github.com/obsidianmd/obsidian-api)). 

`app.plugins` has all of the community plugins, but it doesn't actually have any of the built-in plugins. When I was in the process of writing `app.plu` a suggested boxed popped up w/ either `.plugins` or `.internalPlugins`. Now that's good tooling!

`app.internalPlugins.plugins.publish` is the ticket.

Digging into the publish plugin definition, there's not a whole lot that jumps out to me that says "hey, I handle uploading!". Also, this just looks like the definition/configuration. There's an `instance` key there that looks more interesting. 

![[obsidian-publish-plugin-console.png]]

After checking `.instance` I still didn't see anything that quite jumped out at me... but remember, this is an instance! JavaScript uses prototypal inheritance so that's a clue to also check `__proto__`.

`app.internalPlugins.plugins.publish.instance.__proto__` is _exactly_ what I was looking for. Lot's of goodies here. `apiUploadFile` sounds like its exactly what I want. Next step is to dig into the source and see what it does. 

If you expand the function definition it'll give you some metadata like `[[FunctionLocation]]` which is handy because that tells you what file it's in. Theoretically it's supposed to link to the file, but mine says it's on line one and opens `app.js` in sources, but it's not super useful otherwise (though that might just be me not really understanding how to use it).

### Finding our function

I opened up the console with <kbd>⌘</kbd>+<kbd>⎇</kbd>+<kbd>i</kbd> and headed over to the sources tab to see what I could discover.

When I look in the side panel of the sources tab (you might have to expand the navigator, which'll be the button in the top right, under the element selection icon) this is what I see:

![[obsidian-sources-navigator.png]]

I started poking around in all these files. `app.js` is fairly obvious as it's top level, but I was trying to see if there were any sourcemaps published. Doesn't look like it, so digging into `app.js` it is. Note that even though this is a giant minified file, there should be a pretty print or format option somewhere in the dev tools. 

Searching for `apiUploadFile` in `app.js` only yields two instances: the definition and where it's called. It's called in a `startUpload` function that looks like it's attached to the publish modal in some way, but that's further verification that this is the function I want.

Here's the `apiUploadFile` function in all its mangled glory:

```
e.prototype.apiUploadFile = function(e) {
	return a(this, void 0, Promise, (function() {
		var t, n, i;
		return l(this, (function(r) {
			switch (r.label) {
			case 0:
				if (e.stat.size > 52428800)
					throw new eD("TOOLARGE","Failed to upload file over limit of 50mb.");
				return [4, this.getHash(e)];
			case 1:
				return t = r.sent(),
				[4, this.vault.readBinary(e)];
			case 2:
				return n = r.sent(),
				i = {
					"obs-token": this.app.account.token,
					"obs-id": this.siteId,
					"obs-path": encodeURIComponent(e.path),
					"obs-hash": t
				},
				[2, this.apiRequest({
					method: "POST",
					url: this.getHost() + "/api/upload",
					headers: i,
					data: n
				})]
			}
		}
		))
	}
	))
}
```

All kinds of fun things happening here. I'm going to ignore most of this given that the last part (`case 2`) seems like what I want. It's calling `apiRequest` with a `POST` and some data. That said, I don't really know what the other two cases are doing. The best way that I know how to handle this is to set a breakpoint and walk through the code while it's trying to do its thing. 

### Break out the breakpoints

I put a breakpoint on line 64877 (which likely means nothing to you). It's mapped over to that `return a(this, void 0, Proimse...` as seen in the code snippet above. It's the very next line under the `apiUploadFile` definition.

I'll start by just... uploading some files. I did that, by uploading the current draft of this file actually. Unfortunately, it didn't break. I thought I might've had breakpoints disabled, but that doesn't seem to be the case.... maybe I put the breakpoint in the wrong place. Adding a new one:

![[obisdian-pre-publish-api-upload-breakpoint.png]]

That's done, let's publish the file again... Great, the breakpoint worked that time. I'd try to show it all, but that'd be a pain. Here's how things are working as I understand it:

This is tangentially related to some generator code and it actually sequentially steps through all or most of the switch cases via repeated calls. The function flows like a mini-workflow task or something.

1. Check the size, if less than 50MB get the file hash
2. If the hash has changed, read the file from the filesystem and store it in a buffer
3. Make a post request with the buffer contents

That's really all there is to it. Seems like the last part _was_ all I really needed to concern myself with.

### What to monkey-patch

Okay, so `apiUploadFile` ultimately just calls `apiRequest` with a buffer. I don't really want to mess with the logic of `apiUploadFile` so what I'll do is create a new wrapper function around `apiRequest` that'll do something different when `/api/upload` is included in the URL, otherwise it'll fall back to its default behavior. 

The _something different_ is the whole meat and potatoes of this plugin. Ideally we'll iterate over the buffer (as efficiently as possible) and truncate it if/once we hit the terminal mark. Depending on how the buffer is formatted, that could be a trick because the terminal mark could be split up over different buffer chunks. 

I guess first thing's first though. Time to set up the plugin.

### Setting up the plugin

I build [a tool](https://github.com/zephraph/obsidian-tools/tree/main/packages/create-obsidian-plugin) for setting up new plugins already, so I'll just use that to bootstrap the plugin.

```
yarn create obsidian-plugin publish-hooks
```

That'll automatically set up a new hooks repo and prompt for some other information to help build it out. 

https://github.com/zephraph/obsidian-publish-hooks-plugin

---

I got a little sidetracked on this and started working on the [[Typescript control flow library]] to make some of the logic for this (and other) tools easier.

---

Getting back to this, I've made a bit of progress. Essentially I'm creating a meta-plugin here, that other plugins can interact with. So there are a few base things I need to do.

1. When the publish plugin has loaded, [[monkey-patching|monkey-patch]] the `apiRequest` function to be able to intercept/alter uploads and `apiUploadFile` to be able to hook into before/after the file is published
2. When either of the above methods are called emit an event that other plugins can hook into hook into. I'll detail that more below.
3. When this plugin is unloaded remove the monkey-patches and clean everything up.

### Emitting events for other plugins to consume

This was a little bit of a tricky thing to figure out. Normally in this case I'd naturally reach for node's [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) which essentially seems to ascribe to the API obsidian is using. That said, I imagine mobile won't have node APIs available and I don't _know_ that the API is the same, so it's best to do what's recommended here. This is generally when I turn to the community and start looking around for other plugins that do a similar thing. Luckily I found a hint in [[pjeby]]'s [hotkey-helper](https://github.com/pjeby/hotkey-helper/blob/2182a677c1689e5796b81b1c27e9e1ea9cec64e8/src/plugin.js#L133).

It seems we ultimately just leverage `this.app.workspace`'s event emitter to trigger events. So if I want to emit a pre-publish event, it'd look something like

```ts
this.app.workspace.trigger('publish-hooks:pre-publish', pluginMetaData)
```
 
 From a consuming app, hooking into the event from a different plugin would just be following the [Obsidian-api docs on registering events](https://github.com/obsidianmd/obsidian-api#registering-events).
 
 Just to play the example out
 
 ```ts
 this.registerEvent(this.app.workspace.on('publish-hooks:pre-publish', doSomething))
 ```
 
That's really all there is to it. 

### Monkey-patching safely

It goes without saying that [[monkey-patching]] is a potentially dangerous operation. _Especially_ if you don't clean up after yourself. If a user disables the publish-hooks plugin, we don't want their publishing to start failing!

Funnily enough, [[pjeby]] comes to the rescue again here. As I was looking at the source for [hotkey-helper](https://github.com/pjeby/hotkey-helper) I noticed it called this `around` function that it was... well, wrapping around built-in objects.

It'd look something like this:

```
this.register(around(app.commands, {addCommand: refresher}));
```

`this.register` is documented in obsidian's api, it just essentially calls a function you give it when your plugin unloads. So this `around` function is taking a built-in obsidian object, adding some stuff to it, and returning a function to be cleaned up on load... which sounds perfect. 

Turns out this is all apart of [[monkey-around]], another library by [[pjeby]] for doing semi-safe monkey-patching.

For us it'll look something like...

```ts
this.register(around(publishPlugin, {
	apiRequest: (baseApiRequest) =>
		async function publishHooksPatchedApiRequest(...args) {
			// do other stuff
			return baseApiRequest.apply(this, args);
		}
}))
```

Yeah, that's basically it. 