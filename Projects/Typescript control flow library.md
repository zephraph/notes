As I was working on the [[Pre-publish plugin]], I was struck again (not for the first time) how procedural logic can be messy in a hurry. That's particularly true when you've got a lot of error handling and async flows. It's distracting enough that it pulled me out of the flow and into thinking about this problem. 

I started scratching out what a "better" approach might be.

```
procedure('install', context, [
  validate('plugin', isValidPlugin).or(pluginNotProvidedError),
  validate('vault', isValidVault).or(selectVault),
  act(formatVault),
  match([
    [pluginFoundInRegistry, installFromRegistry],
    [pluginFoundOnGithub, installFromGithub],
    pluginNotFoundError
  ])
])
```

Let's break this down. So we have this top level function called `procedure` which encapsulates the steps I want to take to finish this install.