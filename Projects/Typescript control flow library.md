---
alias: procedure library
---
As I was working on the [[Pre-publish plugin]], I was struck again (not for the first time) how procedural logic can be messy in a hurry. That's particularly true when you've got a lot of error handling and async flows. It's distracting enough that it pulled me out of the flow and into thinking about this problem. 

I started scratching out what a "better" approach might be.

```js
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

I tried to articulate my problem in this [ts playground](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABANwIYBsYBNVQKYA8AwongB75hYDOiASnhHAE5YHVTMxgDmANInABrMHADuYAHySAFGkw58AMTAAuRDKZh8FdUQCUiALyTEAIzhx0eVGH3rbATwCwAKFCRYCFBmy5CJOSUNPSMLGwcXLwCwqIS0jJgqAC2eOpCeI5wwIhEAvJ+ymoa8iBpuQDaGVk5RAC6hibmlta29ohObh7Q8EgFigGkFHhUtAxMrOyc3PyCYCLiUrJJqQDyzErgPQjpmdm5iAA+GpoIOlB6jaYWVjZ2+b4DKgD86nIYZXpVe7UNxtctO72JyIADebkQkMQzDwUBAzD6j38KkQADJUYgoI4AA54fYrPDrTaeXrGIxGRAAIkiM0piAhUMZzw0WnOl3+PgUyLAp20QQqBKJWy8YAaDMZkLerKC7Kago2wt6vPO+jcAF83G4APRa3K2RAASUQ2NQ1FoUAAFnhEDwRnguBBMXBMVbEN0RZicdbqHBUhbxM83FjcYgAGpIorEUwU4N4nL9fwAbiDXsQAGV8Nio8YwxG8Coo5rXKbHJA3YrvNjmHAIHgsPDBkERiFxuEplFZrFFgkCeoadFENLdLkBBw8NjqOoM+OoxU-uDXIzgCwZNYoIhqLDENwN5nqIYF+LEBrXCe3FoOIOzkEcwvGdj0CAeNx1AByV98I9oEDoC6Id-qkW2oAFTARCwGGogYi2OulrWgm+DliSCC0GYeDoOITrmNaqBmNYWG4fhUDOtwwD2lefIUOYpp1og2Q5PsYgWrgr60CaZq0dwxHGswtb1jCAB04Fam4VY1nWDYyK+3AcBg6AfhR5wCBUDIIXgUkPk+3AKTA1DhgoAAKj7Pvcql5lJ36-jpemPOGP5QKqrhiq4XQVkgun6dgRlaTymkmX20y8AeR4wnCCLGsZO7MpwZSIOowAYJugEue4bnbjZCh2b+7z2QFHbBYuUKhfCiL2Yg0XMLF8WJXg6pAA).

I suspect that there's a way to make it work but when I start fighting my tools it makes me second guess myself. So now I'm re-imagining it again and maybe it'll turn out to look something more like this

```js
procedure('install', context)
  .validate('plugin', isValidPlugin)
  .orError(invalidPluginError)
  .validate('vault', isValidVault)
  .or(promptForVault)
  .match([
    [pluginFoundInRegistry, downloadFromRegistry],
    [pluginFoundOnGitHub, downloadFromGithub],
    pluginNotFoundError
  ])
  .exec()
```

This has its own complexities... one of the things I really want to handle with this is managing sync/async calls without the user having to thing too much about them. Problem is, as soon as a function returns a promise, it can't return an object to chain things on. I could make the whole thing a promise chain, but that implies that more things are promises than really are and creates a lot of visual clutter. 

The biggest different here is that every call on the chain will actually just be queuing up work. The work itself won't happen until `exec` is called. 

---

Getting back to this, I've made a bit of progress. I've implemented two basic "verbs" so far.

```js
await procedure('install', context)
  .validate('plugin', isValidPlugin)
  .load(configFromFs)
  .exec()
```

This is the minimal control flow that I can represent right now. Essentially `procedure` is a factory function that constructs a new `Procedure` class. That class has a notion of `context` which is the data store for the process and `operations` which are the steps to be run. When you call `validate` or `load` it creates an `Operation` object with a `type` property that match its name. All the operations are buffered up and once `exec` is called the `operations` are looped over and called in order. In essence, a procedure is lazy.

---

In somewhat of an interesting distraction / turn of events I decided to add some nicer error handling. I wanted to add a codeframe similar to what jest has when it errors. 

![[jest-code-frame.png]]

Turns out it's easy enough to do that with [@babel/codeframe](https://babeljs.io/docs/en/babel-code-frame). Ultimately this isn't likely the error messaging you'd want to bubble up to the end user, but while developing it's helpful. This pairs really well with [stacktracey](https://www.npmjs.com/package/stacktracey) which I'm using to correctly position the stack frame to be at the usage callsite and get data out for the codeframe error. 

I'm not sure any of that'll make sense outside of my head, but here's my error module for a better reference.

```typescript
import { codeFrameColumns } from "@babel/code-frame";
import StackTracey from "stacktracey";

export const createError = (trace: StackTracey, message: string) => {
  const stack = trace.withSource(trace.items[0])
  const lines = stack.sourceFile?.text
  return codeFrameColumns(lines!, {
    start: {
      line: stack.line!,
      column: stack.column
    },
  }, {
    message,
    highlightCode: process.env.NODE_ENV === "test" ? false : true
  }) 
}
```

---

I've largely got most of the surface area of the API implemented at this point. As I've started using it, I've made a few changes to the API.

Previously calling a procedure would be done like `procedure('procName', context)` where `context` is the object the procedure steps operate on. Somewhat similar to arguments in a function. The thing is, procedures can technically be executed multiple times. Ideally this could happen with different context values. In order to get there, I decided to overload the `procedure` function to accept a context or not. 

```typescript
export function procedure<C extends Record<string, unknown>>(name: string, context: C): ProcedureWithEagerContext<C>
export function procedure<C extends Record<string, unknown>>(name: string): ProcedureWithLazyContext<C>
export function procedure<C extends Record<string, unknown>>(
  name: string,
  context?: C
) {
  return context ? new ProcedureWithEagerContext(name, context) : new ProcedureWithLazyContext(name, {} as C);
};
```

In this implementation, if `procedure` is provided a context it returns the instance of a `ProcedureWithEagerContext`. The only different between that and `ProcedureWithLazyContext` is that the former sets the context on initialization and the latter requires `context` to be passed to its `exec` function.

So now I can do something like

```ts
export default procedure<Context>('myProc')
	.valid('prop', exists)
	.exec({ prop: true })
```