---
id: 01FVT7W5DH6FZMKHNF5J3P459R
---
## Background

After putting a lot of work into [[obsidian-plugin-cli]] I kind of realized that having a CLI tool is useful beyond just managing plugins. One of the things I've recently decided that I want to add is the ability to rename files (while keeping their references) outside of [[obsidian]]. To do that, I'll need to broaden the scope.

I took a step back and looked at the architecture of what's in [[obsidian-plugin-cli]] so far. I've been using [[oclif]] which provides a nice typing interface out of the box, but I'm not completely happy with it. The type correctness is nice, but I'm finding that I miss just using [[commander.js]]. So with that, I've decided to expand the scope a bit, switch frameworks, and add some new commands! (It's a hobby project, I can totally do that 😉)

## Plan

I'm going to use [[commander.js|commander]]'s [stand alone subcommands](https://github.com/tj/commander.js/#stand-alone-executable-subcommands) feature to build out the commands. Essentially this means I'll have a tiny stand alone app for every subcommand. It actually makes the structure really nice.

For example, this is the entire current contents of the main file:

```ts
#!/usr/bin/env -S node -r esbuild-register

import { program } from "commander";
import pkg from "../../package.json";

program.version(pkg.version);

program.command("plugin", "Manage or develop an obsidian plugin");

program.action(() => {
  program.help();
});

program.parse(process.argv);

```

Notice the [[shebang]] at the top that references [[esbuild-register]]