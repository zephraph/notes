- **Rating:** 7/10
    - Got exercise, was mostly productive. 
    - Really tired though
- Went for a run with [[Devon Blandin]]
- Knowledge share with [[Purchase Team]]
    - [[Sarah Weir]] went over the artist page, its history, and her PR to reshape it
    - [[Ashkan]] went over the diffusion [incident](https://artsy.slack.com/archives/CT01PBRMM) and the [upsert PR](https://github.com/artsy/diffusion/pull/176) used to solve it
        - Biggest thing from this is that there's no `update_all` method in [[postgres]], but there __is__ an `upsert_all` which they're using to batch the database operations
    - I went over the updates to exchange around fraud review
- To re-apply a rails migration, use `rails db:migrate:redo VERSION=<version_number>` [[TIL]]
- Discovered an interesting 2d game engine called [[hex-engine]] by [[Lily Scott]]
    - [ ] Checkout out [[hex-engine]]
- Talked to [[Sepand Ansari]] about moving `commerceMyOrders` under the `me` root field in the schema. This follows the [schema design playbook](https://github.com/artsy/README/blob/master/playbooks/graphql-schema-design.md#root-fields) that [[Eloy]] put together which was referrenced in a [similar PR](https://github.com/artsy/metaphysics/pull/1663) that [[Sepand Ansari]] worked on previously. 
- Found an [[elixir]] library called [periodic](https://github.com/sasa1977/parent/blob/0.7.0/lib/periodic.ex#L1)
- There's an [incident report](https://docs.google.com/document/d/142rMHowLSqBmXeQyKY35BXiWg87Dv3HtS5qnjE_TA-E/edit) on the spam issue that happened [[January 27th, 2020]]
    - Essentially a user created multiple accounts and made hundreds of inquiries with links to fake artsy user signups. 
    - We're limiting inquiries per day to 20
- To create a new order on [[Artsy/Exchange]]:
    - ```Order.create!(
  state: 'pending',  
  currency_code: 'USD',		  
  payment_method: 'credit card', 
  seller_id: 'gagosian-gallery', 
  buyer_id: '5b06f4908b3b811368d2fe08')```
- [[Admin Notes]] conversation with [[Wendy Wilberg]]
- Got [[PURCHASE-1604]] merged (finally!)
- Found an [article from slack](https://api.slack.com/best-practices/blueprints/account-binding) on account binding to another service which will help improve our fraud workflow
- Did [another PR](https://github.com/artsy/exchange/pull/565) to rename the fraud field in [[Artsy/Exchange]] from `considered_fraudulent` to `flagged_as_fraud`
- Learned about the concept of [[FUSE]]
    - "**Filesystem in Userspace** (**FUSE**) is a [software interface](https://en.wikipedia.org/wiki/Software_interface) for [Unix](https://en.wikipedia.org/wiki/Unix) and [Unix-like](https://en.wikipedia.org/wiki/Unix-like) computer [operating systems](https://en.wikipedia.org/wiki/Operating_system) that lets non-privileged users create their own [file systems](https://en.wikipedia.org/wiki/File_system) without editing [kernel](https://en.wikipedia.org/wiki/Kernel_(computing)) code. This is achieved by running file system code in [user space](https://en.wikipedia.org/wiki/User_space) while the FUSE module provides only a "bridge" to the actual kernel interfaces."
