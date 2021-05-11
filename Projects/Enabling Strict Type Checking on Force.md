_May 10th, 2021_

Before I started at [[Artsy]] I put in a PR to their graphql service [[Metaphysics]]. It ended up going nowhere, but it felt like a good introduction.

I'd like to actually do something on my way out.

Recently we'd had a few production issues where the accessing of `null` fields from [[Metaphysics]] caused some pages to break. We use [[TypeScript]] to help write safer code, but our [[Force|website]] doesn't use [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) given we didn't want to deal with the initial friction when adopting [[TypeScript]]. 

Converting to strict type checking isn't actually that easy to do. If we just flip on the flag there's over 3k failures... which means a big bang migration and potentially introducing bugs. Not ideal.

My co-worker [[David Sheldrick]] pioneered a [really compelling approach](https://github.com/artsy/eigen/pull/3210) of converting a code base to `strict` mode.

Essentially you enable the flag and write a script to add `\\ @ts-ignore STRICT_MIGRATION` comment over every failing line. `@ts-ignore` will tell [[TypeScript]] to ignore whatever is failing. After that, it's easy enough to write some tooling to check for `STRICT_MIGRATION` and ensure it's going down over time.

It's not a perfect solution, but this is generally a pretty hard problem. Believe me when I say it's a lot cleaner than a lot of the alternatives.

