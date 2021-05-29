---
alias: procedure library, Typescript control flow library
---

As I was working on the [[Pre-publish plugin]], I was struck again (not for the first time) how procedural logic can be messy in a hurry. That's particularly true when you've got a lot of error handling and async flows. It's distracting enough that it pulled me out of the flow and into thinking about this problem. 

## Outlining the idea

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

## The basic implementation

Getting back to this, I've made a bit of progress. I've implemented two basic "verbs" so far.

```js
await procedure('install', context)
  .validate('plugin', isValidPlugin)
  .load(configFromFs)
  .exec()
```

This is the minimal control flow that I can represent right now. Essentially `procedure` is a factory function that constructs a new `Procedure` class. That class has a notion of `context` which is the data store for the process and `operations` which are the steps to be run. When you call `validate` or `load` it creates an `Operation` object with a `type` property that match its name. All the operations are buffered up and once `exec` is called the `operations` are looped over and called in order. In essence, a procedure is lazy.

### The anatomy of a match operation

I've mentioned the `match` operation above, but I'd like to discuss it in a bit more detail. `match` is fundamentally the mechanism for branching logic in procedure. Given that, it's both the most verbose and most complex operation.

A match operation has a few key concepts
- An array of _statements_ which make up its core logic
- A statement is made up of one or more _conditions_ and an _action_
	- For an action to run, all conditions must be true. If they're not, it moves to the next statement (assuming one exists)
- Lastly there's (optionally) a _fallback_ that can be invoked if no statement was executed
	- If there's no fallback and no statement executed then the `match` operation throws an error

## Adding error handling

In somewhat of an interesting distraction / turn of events I decided to add some nicer error handling. I wanted to add a codeframe similar to what jest has when it errors. 

![[jest-code-frame.png]]

Turns out it's easy enough to do that with [@babel/codeframe](https://babeljs.io/docs/en/babel-code-frame). Ultimately this isn't likely the error messaging you'd want to bubble up to the end user, but while developing it's helpful. This pairs really well with [[StackTracey]] which I'm using to correctly position the stack frame to be at the usage callsite and get data out for the codeframe error. 

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

An error messaging might look like this

```
      10 |
      11 | export default procedure<Context>("promptForVault")
    > 12 |   .load(vaultsFromPath)
         |    ^ Error: Can't find obsidian settings directory, won't be able to read vaults
      13 |   .validate("vaults", notEmpty)
      14 |   .match([
      15 |     [manyVaults, promptsEnabled, selectVault],
    
    Code: unknown-error
```

If you've followed my sparse trail to this point you might notice something weird. The error message is pointing to the `load` function above but I've said that these procedures are executed _lazily_. Why does that matter? Well, normally if you're executing something lazily that means you'd buffer up the commands somewhere and run them in a loop later (which I do). If you're running them later though, you won't have reference to the original function that buffered them... like `load`. So how do I get a stack trace pointing there?

It's actually fairly easy. Here's the whole implementation of load:

```ts
  load(loadFn: (context: C) => Partial<C> | Promise<Partial<C>>) {
    this.operations.push({
      type: "load",
      run: loadFn,
      context: this.context,
      stackSource: new StackTracey().slice(1),
    });
    return this;
  }
```

There's a bit going on here, but notice that `stackSource` property. Essentially I'm creating a new stack track _at the time of buffering the operation_. I slice off the top frame (because that would essentially reference the same line that the stack trace is created) and that'll give the actual reference to where `load` is called. 

## Providing the context later

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

## Better error handling

*2021-05-19*

Okay, so it's been a little while since I've been back to this. I actually _have_ been working on it, but just haven't been making updates like I should. Sorry about that.

I'm actually simultaneously working on [[obsidian-plugin-cli#Adding an install command]] and while testing it I'm getting an interesting error to print out. 

```
./bin/run install test                                                           
    ProcedureError: Unhandled Internal Exception

      12 | export default procedure<Context>("install")
      13 |   .validate("plugin", isPluginValid)
    > 14 |   .match(
         |    ^ ProcedureError: Unhandled Internal Exception
    
      10 |
      11 | export default procedure<Context>("promptForVault")
    > 12 |   .load(vaultsFromPath)
         |    ^ Error: Can't find obsidian settings directory, won't be able to read vaults
      13 |   .validate("vaults", notEmpty)
      14 |   .match([
      15 |     [manyVaults, promptsEnabled, selectVault],
    
    Code: unknown-error
      15 |     [
      16 |       [noVaultProvided, promptForVault],
      17 |       [isValidVaultProvided, formatVault],

    Code: unknown-error
```

This is interesting because it's a doubly nested error. The `promptForVault` procedure is erroring and triggering an error in the `install` procedure. My goal is to make that clearer. 

There are likely two parts to this

1. Generally improving the error positioning of `match` statements
2. Creating a special error for when nested procedures fail

### Improving match error handling

*2021-05-21*

This is actually a relatively hard problem. Let's assume we have a match statement like below

```
procedure("test").match([
  [ifThisIsTrue, doThis],
  [otherwiseIfThisIsTrue, doThisOtherThing]
])
```

Referring back to the [[#Adding error handling]] section, I create a stack trace when calling `match` that'll point to its call site. It _specifically_ references `match` with it's line and column number. What I don't have (and won't know) is exactly what child is being called and what line that it's on.

This is where things are going to get a bit... weird. We know which line match is on, we know how many children are passed to match, and we know the name of each child. 

*I'm going to place the assumption out there that only functions w/ names are supported (i.e. no anonymous functions) and perhaps that can be validated with its own error handling.*

[[StackTracey]] gives us access to the source file. We know the line `match` is on. We could naively start at `match` and search for a string match to the name of the child we're looking for. That'd be simple _but_ it's possible a single child could be used multiple times in different locations. Instead of that, I'm going to write a _light_ parser. I want to capture everything inside `match( ... )`. I want to know what line each element is on and which child it belongs to.

*2021-05-28*

#### Breaking down match error creation

Given that I'm using [[StackTracey]] I'm provided a mechanism to get the source file as an array of lines. It also provides me the line number and column of where the stack trace was issued. As I noted at the end of [[#Adding error handling]], I'm creating a stack trace when `match` is called and popping the top most frame (where the error creation happens) so that the stack trace actually points to `match`. So in this case I'd have an error pointing to match. Let me show you what this looks like

```ts
      12 | export default procedure<Context>("install")
      13 |   .validate("plugin", isPluginValid)
    > 14 |   .match(
         |    ^ ProcedureError: Unhandled Internal Exception
      15 |     [
      16 |       [noVaultProvided, promptForVault],
      17 |       [isValidVaultProvided, formatVault],
```

Here's the stackframe error message that's resulting from `promptForVault` having an internal failure. Even though we're showing generally that something in the `match` statement failed, it's hard to see _what_ failed. Given that `match` (and all other procedural steps) are _async_, we really only have reference to that initial stack frame. We can't easily manually create a stackframe for the match statements like `noValueProvided` or `promptForVault` so we somehow have to figure that out at runtime given the source.

There are a few things that make this process easier. 
1. We know what actually failed. Even as this is the error message could be improved to reference `promptForVault`
2. We have access to the raw source from [[StackTracey]]
3. We know the structure of the match operation and which statement the failure occurred in
4. We know the line number and column number of the `match` call

Given all of these facts, we can built up a solution to better position the error message.

Let's think at a high level for a second about the function that would be responsible for generating this error. Let's say we have a function `createMatchError` which by default only takes the `StackTracey` trace.

```ts
function createMatchError(trace: StackTracey) {...} 
```

This will give us `#2` and `#4` from above, but it doesn't provide other critical information we need as listed in `#1` and `#2`. We'll need to modify the function to pass that information in

```ts
function createMatchError(trace: StackTracey, statement: number, statementIndex: number)
```

In this definition `statement` is the position of the statement the error is contained in and `statementIndex` is the index of the thing that's erroring from within the statement. With that we can start fleshing out the error creating definition. 

```ts
function createMatchError(trace: StackTracey, statement: number, statementIndex: number) {
	// Gets the location and metadata of the error from StackTracey
	const details = trace.withSource(trace.items[0]);
	
	let column = details.column;
	let line = details.line;
}
```

If we stopped here this would be enough to pass to a library like [babel's code-frame](https://www.npmjs.com/package/@babel/code-frame) in order to render the first error shown above. Helpful, but we'd like to have more.

To improve the error message future we need to parse the source code of the match operation in such a way that it returns a data structure that we can use `statement` and `statementIdnex` on in order to find the `line` and `column` of the actual thing that failed.

#### Parsing the match operation

*2021-05-28*

To contain the scope and complexity of this problem, I'm going to apply some constraints. 

1. The parsing starts on the line that contains `.match(` (or at least that we're given that line number)
2. The syntax is valid. There would be a runtime error at the call site if it wasn't, so that's a safe assumption.
3. All functions passed to  `match` are [[JavaScript named functions|named]]. This assumption can be made safer by a runtime validation when calling `match`.
4. The contents of the match statements are all references to functions (or other procedures) but not themselves function declarations. Essentially I'm betting that it'll contain simple words instead of complex function bodies. This assumption is technically and I'm not sure there's a way to validate it at runtime. More likely this would be a better target for a lint rule. The worst case scenario here is that we have to bail out of the better error messaging and fallback to a generic reference. 

First, let's talk about data structures. That's usually the right place to start in many technical design discussions. If a condition inside of a match statement fails, what information do we need about that condition? In my mind we need three things:

1. The name of the condition
2. The line of the source in which the condition appears
3. The character count where the condition starts

Given all of those elements we can map our error message to the correct place. The second challenge here is creating a data structure that we can use to map the logical pairing of which match statement contains the error and which condition in the statement error occurred. This is the information we'll have at runtime given that we'll be looping through all the statements and their conditions to execute each. It makes sense to me to do pretty much a 1-to-1 mapping to the actual match definition. 

Consider this match operation

```ts
.match([
  [ifSomething, doSomething]
], fallback)
```

*2021-05-29*

In my mind we'd want a complete data structure like

```ts
const match = {
  statements: [
  	[{ name: "ifSomething", line: 1, char: 3}, { name: "doSomething", ...}]
  ],
  fallback: {
 	name: "fallback",
	line: 2,
	char: 3
  }
}
```

This example has both the shape of the overall match operation and detailed positional information about each element in the operation. 

- [ ] Add link to parser implementation once it's pushed.

## Reflecting on the project

*2021-05-28*

### The insecurities of its inception

This has taken a long and winding road. I've mentioned to a few people that I'm not actually sure if this library is a good idea. My worry here is I'm trying to code my way out of writing bad code. Procedure is a scaffolding to constrain a complex portion of code to a particular shape in order to make it easier to read and understand. It's arguable that the same code could be written without the complexity cost of procedure. 

### Considering the benefits

There are, in my mind, a few things that makes procedure worth while. 

#### 1. Constraints and readability

Procedure provides a finite set of operations each of which communicates a certain type of interaction. I've been thinking a lot recently about code as communication and this library is in a way an extension of that idea. Constraining the vocabulary means that the intent is clearer at a glance. Constraints _are_ a tradeoff that by their nature limit what can and can't be done. Hopefully I've chosen good constraints. 

Further, by encouraging that function references be used within the procedure definition it makes the overall definition more terse and legible. One of the biggest aims was to be able to fit a long, complex piece of logic on the screen in a small but legible form. You won't get all the underlying details of how it's doing what it's doing, but hopefully you know _what_ it's doing. It's a narrative framework to convey understanding of a complex task.

#### 2. Uniform handling of sync and async functionality

I really love async/await as a language mechanic, but it comes with tradeoffs. An async function is somewhat of a contaminant. If you use an async function in another function you'll likely need to make that async. Also, generally, error handling can be quite verbose. I'm a big fan of [[await-to-js]] as a tool to make the error handling story more concise, but it's no panacea. 

I conceptually map a procedure to something like a recipe. It's a set of (usually) sequential steps. Sometimes you have to wait, like in the case of water boiling. Sometimes you can act immediately. The overall approach doesn't change much though and I wanted that feeling to carry over into procedure. I don't care if a validation is sync or async. All I care about is that it runs when it's supposed to. That in turn should mean that a function can be swapped between sync and async at no refactor cost all the call site.

I still need to think about parallel steps (because that's of course a thing). Also this approach does mean that a procedure is always async (because any single step _could_ be async). Perhaps in the future I'll add a sync only version... or perhaps not.

#### 3. Reusability empowered by lazy execution

Lazy execution wasn't actually a thing I planned in the beginning. Instead of a chaining api I had an array based api that I expressed in the beginning of these notes. I abandoned that approach for a chaining api because that api is just easier to type with [[TypeScript]]. Given that steps can be async I couldn't chain together calls how I wanted _and_ execute them as they're called. Instead I built up this mechanism of queuing work to be invoked by an `exec` function later. This actually worked out surprisingly well. The benefit of this approach (beyond letting me do async stuff and keep the chaining api) is that now procedures could be defined, passed around, and called later. 

As an aside, I'm building this primarily for my own use to simplify CLI logic. I'd initially been inspired by [[Shawn (swyx)]]'s talk on [adaptive, intent-based cli state machines](https://www.youtube.com/watch?v=ZueoIYnHiaI) but I found when playing with [[xstate]] that that approach ultimately was incredibly verbose and complex. [[Finite state machine|Finite state machines]] are awesome, but there's some mental complexity layered on the expression of the state machine that increases the burden of understanding the core of what you're trying to accomplish. The conciseness of procedure was specifically designed to avoid that.

A feature I'm considering adding is the ability to place a marker in a procedure that can be conditionally returned to later. This, in a way, affords a control flow 

Lastly, the other big benefit of lazy execution is that it means a procedure can be embedded in another procedure. I've already got an example of that working and it's pretty exciting. My hope is to make procedures complete first class members to all chained api methods. 

#### 4. Expressive errors and error handling

Special error handling spawned as an incidental aspect of this library. Given that procedures are lazily executed, the default behavior of an error is to point to the call site of the internals not to where the work was actually queued up. While technically correct, it isn't incredibly helpful to the user because they don't know _where_ in their written code the error spawns from. To solve that I began this complex exploration in capturing early stack traces when queuing work and doing analysis on it to point to a spot that's more informative to the author. As I've mentioned in other places, I'm really thinking about procedure as a framework for communication as much as anything else. Clarity of communication when things go wrong is _especially_ important. Too often error messages are obscure or misleading. Given the structured internal execution of procedure I can really do a lot to help change that story.

The other aspect on this topic is something I mentioned in [[#2 Uniform handling of sync and async functionality|section 2]]. Handling async errors can be pretty annoying/verbose. One of my hopes for this library is that an async error is as clean and simple to handle as a sync error. Beyond that, there should be a standard framework for how to handle errors. If and error should've been handled that wasn't, that should be clearly communicated too. This aspect of the framework is still under development, but I'm pretty excited about it.