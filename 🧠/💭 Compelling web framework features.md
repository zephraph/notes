This is a working list (in no particular order) of features of web frameworks or meta-frameworks that I find particularly compelling. 

## Next.js -- Incremental Static Regeneration

Docs: https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration

[[static site generation|Static site generation]] classically suffers from ever lengthening build times the more pages that are being generated. Imagine having a recipe site with 50k recipes. If those pages don't change often and you'd like them to be statically generated you'll pay the cost of that generation at build time. It needlessly lengthen deploys. To solve for this, [[Next.js]] implements [[incremental static regeneration]]. Essentially, it skips generation at build time. Instead, there's a fallback page that prepared. The very first time a page is visited, it'll show the fallback until the generation finishes in the background. Every subsequent visit will get the previously generated page. The cool thing is, you can specify a revalidation period. After the period elapses the next request that hits will get the previously built version but kickoff a background regeneration task that'll update the cache. 

Arguably you could get a similar effect just using CDN caching with the right caching policy, but this is still an interesting approach. 

## Blitz.js -- Import server functions on the client

docs: https://blitzjs.com/docs/why-blitz#2-data-layer
code:
-  [blitz-rpc-client](https://github.com/blitz-js/blitz/blob/f6354d2dd5928f34c331377c1fe9b406b3940429/nextjs/packages/next/build/babel/plugins/blitz-rpc-client.ts) 
- [blitz-rpc-server-transform](https://github.com/blitz-js/blitz/blob/f6354d2dd5928f34c331377c1fe9b406b3940429/nextjs/packages/next/build/babel/plugins/blitz-rpc-server-transform.ts)

Blitz allows client code to _directly_ import server code. At build time there's a babel plugin that replaces both the server definition and the client call with an [[Remote Procedure Call|RPC]] interface. 

I like this generally because it reduces a lot of the boilerplate from making server calls and you get a fully typed API for practically free. 

It's not without it's own trade-offs, of course. The implicit nature of the API call site might confuse folks who aren't familiar with that functionality. Also, you'd have the same limitations as any [[Remote Procedure Call|RPC]] interface, the primary being that all arguments _must_ be serializable. Lastly, it probably goes without saying, while this would be great for building a backend-for-the-frontend, it wouldn't make for a very nice sharable api. 