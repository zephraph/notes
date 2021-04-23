As I was working on the [[Pre-publish plugin]], I was struck again (not for the first time) how procedural logic can be messy in a hurry. That's particularly true when you've got a lot of error handling and async flows. It's distracting enough that it pulled me out of the flow and into thinking about this problem. 

I started scratching out what a "better" approach might be.

```
procedure('install', context, [
  validate('plugin', isValidPlugin).or(pluginNotProvidedError),
  validate('vault', isValidVault).or(selectVault),
  match([
    [pluginFoundInRegistry, installFromRegistry],
    [pluginFoundOnGithub, installFromGithub],
    pluginNotFoundError
  ])
])
```

Let's break this down. So we have this top level function called `procedure` which encapsulates the steps I want to take to finish this install. It takes a `string` that represents its name, a `context` object which is just data to pass into the procedure and an array of steps to execute. I've only got two different step types sketched out here, a `validate` and `match` step. Validate essentially accesses a specific key on `context` (like `'plugin'`) and passes its value over to a given function... like `isValidPlugin`. So one may assume that if `validate` successfully completes then the procedure moves to the next step... and one would be correct in that assumption. In this case, `validate` has the optional ability to trigger an `or` call. If `validate` fails, a function passed to `or` can do something. Notice that in the first `validate` function, what it does... is invokes an error. This is an opportunity to format the error in a way that's meaningful to the user. What happens _after_ that though?

Internally you might think about about what a procedure is doing like this pseudo code:

```
procedure {
	for each step in steps {
		call step with context
		stop procedure if step errors
	}
}
```

So essentially, if a step that'll bubble up to the procedure level to handle. 

---

This is just a rough idea, but I was trying to massage it to work in typescript. The challenge that I'm having is that I want to pass the context to procedure and have it inferred the rest of the way down the chain.