---
id: 01FVT7W5DVHEPEFBRF8EXG3KDA
---
# Splootcode
A project by [[Katie Bell]]

#site: https://splootcode.io/
#github: https://github.com/katharosada/splootcode

## Tasks

- Change `||` to be `or` #code-analysis
	- `||` is a binary operator in [binary_operator.ts](https://github.com/katharosada/splootcode/blob/22ae881031c51fe1a50a341edadb5dc8fe37c959/src/language/types/binary_operator.ts#L37)
	- It has a `display` property, currently set to `||`
		- So far as I can tell, the `display` field is never used, but it likely _should_ be
		- Options from the operators get passed into a `SuggestedNode` constructor
		- `display` _may_ be used w/ `Fuse.js`. Check the `insert_box.tsx` file, `filterSuggestions`. That's actually the only place in the project I see `display` being referenced, so it's likely only for that
