A tool for managing obsidian plugins

## Adding an install command

The goal here is to be able to run `obsidian-plugin install <plugin-name>` or `obsidian-plugin install <repo-owner>/<plugin-repo>` and have that install in a vault of the user's choosing. 

I use [oclif](https://oclif.io/) as the framework for `obslidian-plugin-cli` and it comes with a [generate command](https://oclif.io/docs/generator_commands#oclif-command-name).  