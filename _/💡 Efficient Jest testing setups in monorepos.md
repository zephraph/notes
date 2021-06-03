When setting up jest in a monorepo (especially using lerna and ts-jest) the fact that dependencies are hoisted means that base ts-jest example setups will fail. They depend on `preprocess.js` being located in the `node_modules` directory in that folder.

Jest supports 

## References
- https://github.com/kulshekhar/ts-jest/issues/699