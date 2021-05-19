A tool for managing obsidian plugins

## Adding an install command

The goal here is to be able to run `obsidian-plugin install <plugin-name>` or `obsidian-plugin install <repo-owner>/<plugin-repo>` and have that install in a vault of the user's choosing. 

### Writing the boilerplate

I use [oclif](https://oclif.io/) as the framework for `obslidian-plugin-cli` which makes adding new commands pretty simple. Each command is a file in the [commands directory](https://github.com/zephraph/obsidian-tools/tree/main/packages/obsidian-plugin-cli/src/commands) that exports a class that extends oclif's `Command` class. 

Here's the basic boilerplate of a command

```
import Command from "@oclif/command";

export default class Install extends Command {
  run(): PromiseLike<any> {
    throw new Error("Method not implemented.");
  }
}
```

### Adding a description

First thing I'll do is add a description. You do that by defining a `static` property named `description` in the class. Makes sense, right?

I'll note that I use a tool called [`dedent`](https://www.npmjs.com/package/dedent) which automatically normalizes the spacing for multi-line [template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) so I don't have to worry about writing them a special way for it to not come out wonky. `endent` and `ts-dedent` are alternatives that do a similar thing. 

The description is important because not only is it a best practice, this command also has some overloaded usage which could use explaining. Part of me feels like that's a smell and I should be more explicit, but I'm making a tradeoff here for usability. 

### Adding args

Args (short for arguments) are the required input that comes at the end of a cli command. Not all commands have args, but the ones that do usually are primarily acting on that arg (or args). For example `mkdir foo/bar` takes a path for it's arg and is really build around taking an action on the arg. 

It's simple to add, just another `static` property in the class.

```
  static args = [{ name: "plugin" }];
```

### Adding flags

Flags have long and short forms, can be of different types, have their own description, etc. They're a lot more advanced than the above so you can read more about flags [here](https://oclif.io/docs/flags#docsNav).

I think the only flag I'll add is `--vault` to represent which vault to install the plugin in. If the flag isn't provided, I'll just prompt the user to fill it in. 

### Building the body of the command

All the magic happens inside of `run`. First we need to get our `args` and `flags` to be able to do something with them.

```
const { args, flags } = this.parse(Install);
const { plugin } = args;
const { vault } = flags;
```

---

_2021-05-19_

Picking back up on this now that I'm at [[Recurse]]. I'd actually been working on it a bit during the last few weeks of work and I didn't really do a good job of logging my progress.

I've finished out the command body, but there's not actually much there. Here's what the `full` run function looks like right now

```ts
  async run() {
    const { args, flags } = this.parse(Install);
    const { plugin } = args;
    const { vault } = flags;

    const context = {
      plugin,
      vaultPath: vault as string,
      vaults: [] as any,
      noPrompts: false,
    };

    const [err, results] = await to(install.exec(context));
    if (err) {
      this.error(err);
    } else {
      console.log(results);
    }
  }
```

I'd mentioned the first part (getting args, flags, etc) previously so I won't talk about that. There's a `context` variable here that encapsulates all the state or configuration that I expect this command to use. The last bit you'll see is this `install.exec` call. `install` is a [[procedure]] that encapsulates the logic of the command. You can read more about it on the page linked above, but [[procedure]] is a library I wrote to make complex, procedural logic a little easier to follow. 

Here's what I have so far

```ts
export default procedure<Context>("install")
  .validate("plugin", isPluginValid)
  .match(
    [
      [noVaultProvided, promptForVault],
      [isValidVaultProvided, formatVault],
    ],
    invalidVaultProvided
  )
  .do((context) => console.log(context));
```

This might look a little weird at first, but there's a lot of logic contained here in a way that's hopefully easy-ish to read.

The procedure is named `install`. That's just useful for debug / error messaging. It `validate`s the `plugin` key from `context` (the state that'll be passed) by using the `isPluginValid` function. That function will return `true` or `false` if it's valid or not. If it's _not_ valid, it'll error and not continue. There are ways to add