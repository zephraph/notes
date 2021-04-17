## lerna / auto / github actions deploy error
This has been a _frustrating_ issue. 

Learnings:
- lerna 3.22.1 seems borked
- `@auto-it/npm/dist/set-npm-token.js` needs
	- updated logic on where it reads/writes .npmrc tokens
- Need to replace the `yarn` reference in auto

Got it fixed!
- Turns out automation tokens on NPM don't work 
