A tool for managing obsidian plugins

## Adding an install command

The goal here is to be able to run `obsidian-plugin install <plugin-name>` or `obsidian-plugin install <repo-owner>/<plugin-repo>` and have that install in a vault of the user's choosing. 

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

