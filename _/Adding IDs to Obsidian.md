---
id: 01GJHMEEB49GPD2SHQRS6J7A5M
---

I'm working towards using [[Obsidian]] as the tool to back my personal site. One of my goals in this endeavor is to ensure that my links are stable. That's pretty hard to do if the URL is based on a file path that can (and will) change. I'm always re-organizing, renaming, and moving stuff around so I need a better record of store. 

[[Obsidian]] supports [[frontmatter]] which means it's easy enough to add an ID as metadata on every page. Doing this manually would be a bit annoying though. There's a few problems to work through here

1. Add a method dynamically for generating IDs
2. Injecting IDs into new pages
3. Populating all my old notes with IDs

## ID generation

I learned about [[ULIDs]] recently which is an ID format that's shorter than UUIDs and also encodes a notion of time into the ID generation so that the actual IDs themselves are lexically sortable. That's an incredibly useful

## [[Templater]] and automatic ID creation

A popular solution in the [[Obsidian]] community for templating is SilentVoid's [[Templater]]. It allows you to create templates with JS snippets that can be used to generate data when creating a new note. Perfect for solving the first problem.

```
---
id: <% tp.user.ulid() %>
---
```

```js
const files = app.vault.getFiles()
```

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

