NPM: https://www.npmjs.com/package/monkey-around
GitHub: https://github.com/pjeby/monkey-around

A library by [[pjeby]] that helps apply monkey-patches in a safer way. 

```ts
import { around } from 'monkey-around'
const removeMonkeyPatch = around(someObjectToPatch, {
	methodToPatch: (originalMethod) =>
		
})
```

