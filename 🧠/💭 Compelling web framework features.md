This is a working list (in no particular order) of features of web frameworks or meta-frameworks that I find particularly compelling. 

## Next.js -- Incremental Static Regeneration

Docs: https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration

[[static site generation|Static site generation]] classically suffers from ever lengthening build times the more pages that are being generated. Imagine having a recipe site with 50k recipes. If those pages don't change often and you'd like them to be statically generated you'll pay the cost of that generation at build time. It needlessly lengthen deploys. To solve for this, [[Next.js]] implements [[incremental static regeneration]]. Essentially, it skips generation at build time. Instead, there's a fallback page that prepared. The very first time a page is visited, it'll show the fallback until the generation finishes in the background. Every subsequent visit will get the previously generated page. The cool thing is, you can specify a revalidation period. After the period elapses the next request that hits will get the previously built version but kickoff a background regeneration task that'll update the cache. 

I love this feature. Arguably you could get a similar effect just using CDN caching with the right caching policy. 