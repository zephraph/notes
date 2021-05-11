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

There is another small difference in my approach though. Instead of using `@ts-ignore` I'm going to use `@ts-expecte`