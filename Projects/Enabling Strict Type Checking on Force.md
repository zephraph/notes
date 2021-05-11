_May 10th, 2021_

Before I started at [[Artsy]] I put in a PR to their graphql service [[Metaphysics]]. It ended up going nowhere, but it felt like a good introduction.

I'd like to actually do something on my way out.

## The problem

Recently we'd had a few production issues where the accessing of `null` fields from [[Metaphysics]] caused some pages to break. We use [[TypeScript]] to help write safer code, but our [[Force|website]] doesn't use [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) given we didn't want to deal with the initial friction when adopting [[TypeScript]]. 

Converting to strict type checking isn't actually that easy to do. If we just flip on the flag there's over 3k failures... which means a big bang migration and potentially introducing bugs. Not ideal.

## Prior Art

My co-worker [[David Sheldrick]] pioneered a [really compelling approach](https://github.com/artsy/eigen/pull/3210) of converting a code base to `strict` mode.

Essentially you enable the flag and write a script to add `\\ @ts-ignore STRICT_MIGRATION` comment over every failing line. `@ts-ignore` will tell [[TypeScript]] to ignore whatever is failing. After that, it's easy enough to write some tooling to check for `STRICT_MIGRATION` and ensure it's going down over time.

It's not a perfect solution, but this is generally a pretty hard problem. Believe me when I say it's a lot cleaner than a lot of the alternatives.

## Iterating

I essentially want to do the same thing. I'm just going to do it in a slightly different way. First off, I'm going to incorporate this tool called [[betterer]]. It'll take care of ensuring that the migration happens over time. It actually has a [typescript plugin](https://phenomnomnominal.github.io/betterer/docs/built-in-tests#betterertypescript) that can be used to do exactly what we want to do here. Unfortunately that would require that type checking be ran twice... but it's pretty slow already. Not really feasible. What I'd like to do instead is use the [regex plugin](https://phenomnomnominal.github.io/betterer/docs/built-in-tests#bettererregexp) to test for a comment pattern similar to the previously mentioned step.

There is another small difference in my approach though. Instead of using `@ts-ignore` I'm going to use `@ts-expect-error`. It's similar in that [[TypeScript]] will ignore the errors it encounters, but if there is no error then you'll get an error saying that the statement is unused. That means if someone comes along and accidentally fixes an error, they'll be told to remove the unused `@ts-expect-error`. 

## Adding the ignores

It's been a long week and I'm pretty tired. I don't feel like being fancy. [[betterer|Betterer]] has a mechanism for handling [[TypeScript]] strict checks as mentioned. It generates out this huge jest like snapshot file with the file and the errors where they occurred. It looks something like this

```ts
exports[`strictNullCheck migration`] = {
  value: `{
    "src/desktop/apps/authentication/__tests__/helpers.jest.ts:2639092610": [
      [128, 15, 16, "Object is possibly \'undefined\'.", "4221209777"],
      [189, 15, 16, "Object is possibly \'undefined\'.", "4221209777"],
      [245, 15, 16, "Object is possibly \'undefined\'.", "4221209777"]
    ]
  }`
};	
```

It'll give the file, line numbers, error, etc. Perfect for what I want to do. I literally just want to put a comment above each of those line numbers.

To generate this output file, I first have to setup the betterer test.

```ts
// .betterer.ts
import { typescript } from "@betterer/typescript"

export default {
  "strictNullCheck migration": typescript("./tsconfig.json", {
    strictNullChecks: true,
  }),
}
```

Once I run `yarn betterer` it'll (eventually) generate a `betterer.results` file with the contents like the example above. The result is basically a weird common.js module with a big stringified JSON blob. Easy enough to handle.

```js
// Load the results file
const results = require("../.betterer.results")["strictNullCheck migration"]
const fs = require("fs")
const path = require("path")

// Parse the results
const files = JSON.parse(results.value)

for (let [label, warnings] of Object.entries(files)) {
  let offset = 0
  
  // Load our target file to be edited
  const [file] = label.split(":")
  const filePath = path.join(process.cwd(), file)
  const content = fs.readFileSync(filePath, "utf-8").split("\n")
  
  for (let warning of warnings) {
    const lineNum = warning[0]
	
	// Insert our comment above the line
    content.splice(
      lineNum + offset++,
      0,
      "// @ts-expect-error STRICT_NULL_CHECK"
    )
  }
  
  // Write the final output
  fs.writeFileSync(filePath, content.join("\n"))
}
```

Before running the script we'll need to enable `strictNullChecks` in our base `tsconfig`.

## Running the script

So after running the script it ran correctly on the first time and everything is perfect. I can retire now.

No, that didn't happen. I got 1061 errors.

This is the part of the story where I'm supposed to say something smart like how I figured out exactly what I could do to make things better. 

That also isn't happening.

What is happening is that I'm going through these errors and fixing them mostly by hand, heh.

Sometimes I get two comments appearing right on top of each other. Why? Because my fatigued brain probably did something weird with the splice or something. It's diminishing returns now to try to figure that out, so I just delete the extra lines and move on with my life.

The other error I saw a lot of is comments added into the middle of JSX in a way that's invalid. Mostly I just handle this with muscle memory. <kbd>⌘</kbd>+<kbd>/</kbd> toggles the line as a comment in vscode which wraps the `@ts-expect-error` statements in the weird JSX error syntax. 

Okay... yeah, let me just... fix this...

##
(some time later)
