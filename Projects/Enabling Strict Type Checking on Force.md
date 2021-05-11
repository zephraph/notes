_May 10th, 2021_

Before I started at [[Artsy]] I put in a PR to their graphql service [[Metaphysics]]. It ended up going nowhere, but it felt like a good introduction.

I'd like to actually do something on my way out.

Recently we'd had a few production issues where the accessing of `null` fields from [[Metaphysics]] caused some pages to break. We use [[TypeScript]] to help write safer code, but our [[Force|website]] doesn't use [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) given we didn't want to deal with the initial friction when adopting [[TypeScript]]. Converting to strict type checking 

My co-worker [[David Sheldrick]] pioneered a [really compelling approach](https://github.com/artsy/eigen/pull/3210) of convering 