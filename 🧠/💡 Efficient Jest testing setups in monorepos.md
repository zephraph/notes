---
id: 01GJHFEW438RN6RK0KDKC2278B
---
When setting up jest in a monorepo (especially using lerna and ts-jest) the fact that dependencies are hoisted means that base ts-jest example setups will fail. They depend on `preprocess.js` being located in the `node_modules` directory in that folder.

Jest supports the ability to [specify multiple projects](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig) which allows doing things like [configuring `ts-jest` at the monorepo root](https://github.com/kulshekhar/ts-jest/issues/699#issuecomment-458457614). This is similar to [[💡Using TypeScript project references to speed up monorepo compliation]].

