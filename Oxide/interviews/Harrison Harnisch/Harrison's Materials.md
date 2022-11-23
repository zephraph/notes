---
id: 01FX3T3FCM9GS50X0FKSK4CZ2F
---
# Hey Oxide! I'm Harrison 👋

I'll get into the samples for each section but I wanted to take a moment to introduce myself. I've been building things with and from computers in some form since I was 8 and in the industry for ~13 years. I've worked on everything from embedded systems that are hardened for space to help take pictures of black holes to big distributed systems on the web that scale to billions of requests per day. I'm a generalist engineer who gravitates to solving big problems that bridge gaps across domains. I hope you'll consider me for a role at Oxide!

# Work samples

## [Proprietary] Twilio Console Migration

When I first started at Twilio I spent time working within Twilio's tooling and infrastructure feeling hindered by it. Deploying code was slow, tedious and dangerous. I worked with leadership to quantify how this was costing developers, the company and our customers -- starting with showing how slow the Twilio Console loaded in various parts of the world, how engineering teams were shipping numerous changes once per week in batches and showing the high percentage of outages reported were coming from customers (i.e. not our monitoring). I advocated for spending my time to build a POC and spec out how we could solve this problem and was given the +1 from the data that was presented. For the next couple weeks I built a POC that would serve as the starting point for the project and be a central point of discussion. After showing the approach to be viable I spent the next couple weeks writing the blueprint that would layout the next 2 years of work. This would involve shifting the way that over 30 teams consisting of 300+ engineers would build frontend code. Myself and 1 other engineer built out CI/CD pipelines, tooling, libraries and all of the foundational components for teams to start building in the new frontend infrastructure. This took a few months because of a few of the unique design criteria of the project; teams needed to be able to ship value and migrate incrementally, 30+ teams working independently for years create bespoke solutions and have many edge cases, we migrate the customers THEN the code. From here we expanded the team from 2 to 8 engineers and I took on the role of tech lead. Much of the work during this time was working out how the get the 30+ teams with extreme edge case apps to run in the new platform and complete the migration of all of our customers. This took several months and the team grew a bit more. This brings us to today where the team is now split into 4 teams with different focus areas: product, tooling and infrastructure, globalization and testing. I'm currently the Senior tech lead and I work very closely with the 4 tech leads of each team consisting of 16 engineers. While every page isn't migrated (work in progress), time to first byte has been reduced from seconds to 10s of milliseconds globally, teams are shipping smaller chunks multiple times a day and frontend customer reported incidents have been drastically reduced.

Here's a blog post with more details on the implementation: https://www.twilio.com/blog/bridging-legacy-and-future-platforms

Twilio Console: https://console.twilio.com

- [Proprietary] I scaled the Vercel Edge Network (CDN) to handle billions of requests a day

When I joined Vercel I inherited the Vercel CDN in a state of trouble. There were no tests for the system, the Edge proxies were a constant source of alerts throwing errors and the only engineer at the company who had worked on the project was leaving in a few days after I joined. When digging into the functionality of the system very few things worked according the the documentation that Vercel had published to customers. I started by spending as much time with the Engineer before they left to get as much context as possible and gained a general sense for how the system was structured -- the current scale was relatively small at hundreds of thousands of requests per day. I first started to focus on testing to build upon my understanding of the project and get a clearer picture about what was working or broken. I used the customer facing documentation as the state of truth for how things *should* work and fixed the code one by one until the tests passed. This addressed most of the random errors that triggered alerts and was able to focus on the next phase of the project, making the edge proxies scale to bursty traffic. This required getting very familiar with the [OpenResty request lifecycle programming model](https://openresty-reference.readthedocs.io/en/latest/Directives/) and caching the crap out everything that made requests to downstreams and DBs. Without getting into too much detail the OpenResty programming model is very strict about when you can access shared memory in separate worker processes that handle requests. Much of the work was fine tuning when caches in shared memory were read/written and then load testing the system. Local caching is working well at this point and handling the bursts without triggering alerts. The next phase of the project was to build out a team to have a proper pager rotation and work on new features. I worked with leadership to define 2 roles to join the Vercel Edge team and create a product roadmap for the team to implement. After we found 2 great hires I operated as a hybrid tech lead, product manager and individual contributor. From week to week I was working on technical architecture, prioritizing work and implementing new features for our customers. My last project at Vercel was building out the multi-tiered caching solution that would cache responses in multiple layers, from a local in-process cache all the way out to a global cache that would persist for days. This brought the cache hit rate up to around 95% for all requests and allowed the company to scale to over a billion requests per day (and beyond).

- NASA GEMS

I'm pulling this project from back in my academic days since it highlights the "Software Engineers with an Understanding Of Hardware" worldview I share. I worked on the student portion of a NASA mission called GEMS: [Gravitation and Extreme Magnetism Small Explorer](https://en.wikipedia.org/wiki/Gravity_and_Extreme_Magnetism_Small_Explorer). The purpose of this mission was to create a satellite capable of taking images of black holes using X-Rays. I was tasked with building out the embedded system that would collect data to calibrate the imaging portion of the project. I also wrote most of the software and interfaces to run experiments around the lab so the physicists could collect and process data. I spent 2 years working on an embedded system that could withstand the harsh conditions of space and collect data from a X-Ray detector. To make this happen I learned circuit board design, FPGA design with Verilog, high speed A->D conversion and analog circuitry to interface with the X-Ray detector. Unfortunately the GEMS project never made it to completion (cancelled in 2012) but I learned a ton about hardware in this project and there's plenty of carry over between disciplines.


# Writing samples

- I co-authored a book on migrating frontend applications: https://www.oreilly.com/library/view/atomic-migration-strategy/9781491999950/

- Some more detail on the new Twilio Console Migration architecture: https://www.twilio.com/blog/bridging-legacy-and-future-platforms

- Building a link counting service: https://blog.harrison.dev/2016/12/01/building-the-buffer-links-service.html

# Analysis samples

- [Proprietary] Debugging Vercel Edge Caching

This is a deeper dive on the "Work Samples" section around the Vercel Edge caching issue. For a CDN to process a high volume of requests it is imperative to cache as cacheable (ex. GET, 200, no cache defeat headers turned on) requests much as possible for as long as possible. This frees up the worker processes to focus on new work rather than recompute work that has already been done to service a request. The customer facing documentation called out that, in a given region, once a cacheable request is made it is persisted in all proxies in the region. If there were 4 proxy nodes you'd often (but not always) see tests have the following pattern: MISS, MISS, HIT, MISS, HIT, MISS, HIT, HIT, HIT, HIT where you'd observe a MISS for each node until all nodes had the request in their local cache. My first hunch was that per-worker and per-node caching was working correctly and that the syncing mechanism between nodes was broken. The odd thing was that when I tried to reproduce locally in an isolated environment I couldn't reproduce the issue. I tried putting the test environment under some load and could make it happen intermittently, under heavy load it happened consistently. With these clues and consistent reproduction I was able to pinpoint the source of the issue: the workers were clobbering shared memory that contained a queue used to batch sync requests between nodes! After I fixed this issue, I tested in the isolated environment and then deployed to production. Success, caching works consistently!

As an aside after going through this exercise it became pretty clear that proxies broadcasting to all other proxies in the region was not going to scale. I ended up replacing this strategy with a more tradition Redis instance shared between proxies.

# Presentation samples

- Twilio Console: A Large Scale Migration to Jamstack

Talk: https://www.youtube.com/watch?v=k9i0PD_IFlU
Slides: https://blog.harrison.dev/2021/10/05/twilio-console-jamstack-migration.html#1

- Getting The Most Out Of Kubernetes

Talk: https://www.youtube.com/watch?v=NuLFomXGUj4
Slides: https://blog.harrison.dev/2018/12/11/getting-the-most-out-of-kubernetes.html#1

- Atomic Design As A Migration Strategy

Talk: https://www.youtube.com/watch?v=xy1keUwELKs
Slides: https://bufferapp.github.io/buffer-talks/2017/06/09/migrating-with-atomic-design.html#1

# Questionnaire

### What work have you found most technically challenging in your career and why?


### What work have you done that you were particularly proud of and why?

My work on the Twilio Console migration project. The scope and scale of the project has required me to think on the timeline of years and has positively impacted hundreds of engineers. It has pushed me to grow my technical skills as well as my soft skills. It's certainly not easy to convince 100s of people to move in the same direction, but its incredible to see it when it happens.

### When have you been happiest in your professional career and why?

The earlier phases of the Twilio Console project were pure joy! After identifying the direction for the team, the goals were very clear and allowed for intense focus with long periods of deep work. While there were plenty of unknowns at this stage this is where the interesting problems were solved.

### When have you been unhappiest in your professional career and why?

I won't mention this company directly but I was working at a place that conflicted with my deep core values as a person, in this case verbal abuse and white supremacy was being upheld in the highest levels of the company. When I joined I didn't observe the behavior right away, but over time the patterns amplified. On a particular day an event happen that crossed a moral line for me and I could no longer continue to work at the company and resigned.

### For one of Oxide's values, describe an example of how it was reflected in a particular body of your work.

**Resilience**

During the Twilio Console Migration project there were SO many times that this project could have failed. There were challenges from nearly every angle on this project ranging from adversarial security teams, to OG Twilions not happy about deprecating outdated systems to the structure of the company itself. We pushed through it all and made sure we validated and communicated work at every step of the way to make sure we were building the right thing.

### For one of Oxide's values, describe an example of how it was violated in your organization or work.

**Teamwork**

Collaborating within a given team at Twilio is usually excellent, however collaborating *across teams* takes is a very difficult task. Much of this has been a side effect of the organization structure, which is organized around independently running "business units" that are responsible for their own budgets. It's extremely difficult to work on cross cutting initiatives that span across teams since they each have their own conflicting priorities.

### For a pair of Oxide's values, describe a time in which the two values came into tension for you or your work, and how you resolved it.

**Urgency + Resilience**

When I first started working on the Twilio Console migration project the goal was to move quickly with *urgency* to build the POC. It would not have made sense to build something with *resilience* at this stage. However the POC still needed to prove that a resilient, production ready architecture *could* be built since Twilio customers would not accept an unreliable product. This meant that the select parts of the POC needed to be taken deeper than others. One example meant a complete end-to-end solution for loading the legacy Twilio Console within the new Twilio Console to prove that iframes could be loaded reliably. This made it take a little longer than a typical POC but it also demonstrated that *resilience* was possible to achieve in the production implementation.

### Why do you want to work for Oxide?

When I first read Jessie's blog post [Born In a Garage](https://blog.jessfraz.com/post/born-in-a-garage/) the line "... they long ago decided they could build their own hardware and software to fulfill their needs better than commodity vendors. We are working to bring that same infrastructure privilege to everyone else!" stuck out to me. Something special happens when you build a team that's able to cross that gap between Hardware and Software. You see it in companies like Apple that think about products from UI details like the radius of button edges all the way down to the silicon. In my personal career I've found my self drawn to roles where I can help bridge gaps, between the internet and telecom systems, between backends and frontends, between hardware and software -- its having the courage to take the leap across boundaries to find those unsolved problems and something I see in Oxide.