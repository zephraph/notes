---
id: 01FVT7W5DA661GTA5D120R51GW
---
[[Obsidian]]'s [publish](https://obsidian.md/publish) is a feature that allows you to publish parts of your obsidian vault to the web. These notes are published that way! 

## Adding custom analytics to publish pages

I use [Plausible.io](https://plausible.io) as an analytics service. I wanted to get that onto my notes page, but it's pretty limited in what you can customize. You can't specify a head tag to be added, but you can [publish custom js](https://help.obsidian.md/Licenses+%26+add-on+services/Obsidian+Publish#Custom+JS) (assuming you're using a custom domain).

To do this:
- Create a `publish.js` file at the root of your vault
- Add the below script tag to the publish file
- Publish the `publish.js`

```
(function (d, script) {
  script = d.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.defer = true;
  script.dataset.domain = "just-be.dev";
  script.src = "https://plausible.io/js/plausible.js";
  d.getElementsByTagName("head")[0].appendChild(script);
})(document);
```
