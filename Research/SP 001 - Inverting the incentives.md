---
id: 01GFVN2B9X74XA9YJW155YHY2V
alias: SP 001
---
In [[SP 000 - We deserve a better smartphone|SP 000]] I mentioned how I believe the economic incentive model for our current generation of smartphones actually _encourages_ distraction by economically incentivizing user engagement. To truly build a better smartphone the incentive model should fundamentally be altered. 

## Considering the incentive drivers

In my mind there are three major, intertwined concepts driving the outcomes of our current generation of smartphones.

1. Apps are the primary means of introducing functionality (and thus monetization). They're often proprietary, walled gardens of data and functionality. A user has little insight into how their data is being used, limited control over what features of the app are exposed, and generally experience a lack of overall portability across the system.
2. Apps are discovered and distributed through centralized [[App Store|app stores]]. These stores have control over what is permissible, what is published, and what is promoted. They're a significant revenue driver for platforms which leads to increasing plays to capture revenue from 3rd party developers. 
3. Attention is the currency of the digital economy and smartphone's ever presence and rudimentary controls means companies have an open field to compete for user's attention. 

## Combating incentives

To get more (or less) out of our phones, we have to address these invert these incentives to give more power back to the end user. 

### Unbundling Apps

>[!note]
> I highly recommend reading [[Alexander Obenauer|Alexander]]'s notes on [Universal Data Portability](https://alexanderobenauer.com/labnotes/002/), [Atomized apps](https://alexanderobenauer.com/labnotes/007), and [Services](https://alexanderobenauer.com/labnotes/018/).

Apps are at the core of current monetization strategies for both platforms and 3rd party developers. They pull users in different directions and create fragmented experiences. 

I propose that we fundamentally remove the notion of apps. Instead, let's unbundle the idea of an app into smaller, composable parts.

- **services** - Units of functionality that interact with the device or external APIs.
- **widgets** - A composable utility whose responsibility is to interact with services and draw to the screen. These should be end user editable.
- **views** - A collection of widgets organized in a layout that can be shared between users
- **bundles** - A collection of services, widgets, and views that can be delivered to a user which can simulate an app-like environment

### Decentralized Software Distribution

App stores give platforms a lot of power to limit what can be distributed and by whom. While on the face of it this can sometimes be a good thing (e.g. limiting the spread of malware) it is also a mechanism of gatekeeping and value extraction. 

Thankfully we have a great model of decentralized software distribution to build off of. The web. 

There's some interesting parallels here with Deno's decision not to use a centralized package registry but to instead power package sharing directly via URLs. 

