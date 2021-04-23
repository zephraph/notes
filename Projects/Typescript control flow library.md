As I was working on the [[Pre-publish plugin]], I was struck again (not for the first time) how procedural logic can be messy in a hurry. That's particularly true when you've got a lot of error handling and async flows. It's distracting enough that it pulled me out of the flow and into thinking about this problem. 

I started scratching out

```
procedure('install', context, [
  validate('plugin', isValidPlugin).or(pluginNotProvidedError),
  validate('vault', isValidVault).or(selectVault),
  act(formatVault),
  match([
    [pluginFoundInRegistry, downloadFromRegistry],
    [pluginFoundOnGithub, downloadFromGithub],
    pluginNotFoundError
  ])
])
```