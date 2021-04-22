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

