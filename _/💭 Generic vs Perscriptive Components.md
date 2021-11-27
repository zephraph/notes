I've spent a lot of time this week thinking about aspects of a tabs component. 

## Considering the HTML

```html
<div role="tabs">
	<div role="tablist">
		<a>Tab 1</a>
		<a>Tab 2</a>
	</div>
	<div role="tabpanels">
		<div>Some content goes here</div>
		<div>Other content goes here</div>
	</div>
</div>
```

The [[DOM]] representation of any UI is mostly simplistic. It's a tree structure where visuals are usually described top to bottom, left to right. When you consider the UI structure of the tabs you'll notice that the tabs themselves are not intrinsically linked to the tab panel it represents. It'd be fairly easy to accidentally re-arrange your tabs to have it pointing at the wrong panel given their positionality requirements. 