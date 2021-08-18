This is a working list (in no particular order) of features of web frameworks or meta-frameworks that I find particularly compelling. 

## Next.js -- Incremental Static Regeneration

Docs: https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration

[[💡 Static site generation|Static site generation]] classically suffers from ever lengthening build times the more pages that are being generated. Imagine having a recipe site with 50k recipes. If those pages don't change often and you'd like them to be statically generated you'll pay the cost of that generation at build time. It needlessly lengthen deploys. To solve for this, [[Next.js]] implements [[incremental static regeneration]]. Essentially, it skips generation at build time. Instead, there's a fallback page that prepared. The very first time a page is visited, it'll show the fallback until the generation finishes in the background. Every subsequent visit will get the previously generated page. The cool thing is, you can specify a revalidation period. After the period elapses the next request that hits will get the previously built version but kickoff a background regeneration task that'll update the cache. 

Arguably you could get a similar effect just using CDN caching with the right caching policy, but this is still an interesting approach. 

## Blitz.js -- Import server functions on the client

docs: https://blitzjs.com/docs/why-blitz#2-data-layer
code:
-  [blitz-rpc-client](https://github.com/blitz-js/blitz/blob/f6354d2dd5928f34c331377c1fe9b406b3940429/nextjs/packages/next/build/babel/plugins/blitz-rpc-client.ts) 
- [blitz-rpc-server-transform](https://github.com/blitz-js/blitz/blob/f6354d2dd5928f34c331377c1fe9b406b3940429/nextjs/packages/next/build/babel/plugins/blitz-rpc-server-transform.ts)

Blitz allows client code to _directly_ import server code. At build time there's a babel plugin that replaces both the server definition and the client call with an [[💡 Remote Procedure Call|RPC]] interface. 

I like this generally because it reduces a lot of the boilerplate from making server calls and you get a fully typed API for practically free. 

It's not without it's own trade-offs, of course. The implicit nature of the API call site might confuse folks who aren't familiar with that functionality. Also, you'd have the same limitations as any [[💡 Remote Procedure Call|RPC]] interface, the primary being that all arguments _must_ be serializable_*_. Lastly, it probably goes without saying, while this would be great for building a backend-for-the-frontend, it wouldn't make for a very nice sharable api. 

\* Note: The blitz.js authors created a library called [superjson](https://github.com/blitz-js/superjson) to serialize a wider array of types than `.toJSON` would achieve. 

## Remix -- Leverage form API for data uploads

docs: https://docs.remix.run/v0.17/tutorial/6-actions/

[[Remix]] leverages good ol' html forms. In a remix route you can export an `action` function that'll be the primary handler for html forms contained within the route. If you don't want to do client based JS data submissions, that's all you need! If you would like something a little more dynamic (and to avoid a form's page refresh) then you can use their `Form` component which has the same api as the normal html form but with the added benefit that you can use a `usePendingFormSubmit` hook to do logic on loading states. I love the simplicity of this and the potential for true progressive enhancement. 

As a side note I also love how Remix implements [[💡 Command Query Responsibility Segregation]] kind of naturally with its `action`/`loader` division

## Astro -- Explicit component hydration

docs: [component hydration](https://docs.astro.build/core-concepts/component-hydration#hydrate-interactive-components)

[[Astro]] is unique. It's probably the framework that I'm most excited about currently that I feel is one of the best responses to how we can effectively build sites, not apps. 

By default, [[Astro]] includes (effectively) no client side JavaScript. All components are server side rendered by default. If you want it to be interactive on the client you must tell [[Astro]] (at the callsite of the component) how you want it [[💡 Hydration (web)|hydrated]]. The current choices are once the page has loaded, when the main thread is idle, when the component is visible, or when the page is at a certain breakpoint. 

It looks something like this

```
---
import { Map } from './Map'
---
<section>
  <Map:visible/>
</section>
```

In this case, the `Map` component will only be hydrated when it becomes visible in the browser. 