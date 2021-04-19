## Motivation

I'm using [Obsidian Publish](https://obsidian.md/publish) to publish these notes. Part of my notes are private and part are public. I want the ability to add a plugin that hooks into [[Obsidian]]'s publish plugin to override its behavior. It should only publish the public aspect of my notes, not the private ones (which are denoted by a special delimiter in my files).

## Exploration

Okay, so the publish plugin is built in to Obsidian, which means anything that I do to it is undocumented and unsupported. I'll essentially be [[monkey-patching]] it. 