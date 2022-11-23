---
id: 01FVT7W5DY413BZT5FY421WSYY
---
This is my first public weekly retrospective. I've been inspired by some of my friends and colleges like [Jon Allured](https://www.jonallured.com/). I'm going to try to keep this light and as [Ash says](https://twitter.com/ashfurrow/status/1383120035145732098?s=20), I'm going to write this for me. (Also, happy birthday Ash!)

## Looking back

### Therapy

I'll start this post as I start my weeks... with a bit of therapy. I think the most I've talked about this publicly is in last weeks episode of [Artsy's podcast](https://twitter.com/ArtsyOpenSource/status/1380630098555076626?s=20), but I struggled a lot with burnout over last year and into the beginning of this year. I ended up taking some time off of work to reset. With that time came some dedicated therapy that's beginning to help me change how I think in a positive way. 

In Monday's session, we talked about performance anxiety. That's a thing. Before I started therapy I didn't realize how much anxiety has shaped my life. The beauty (and pain) of therapy is that it brings realizations, but not solutions. 

### Work

I've been working on [Artsy](https://www.artsy.net/)'s grow team these last few weeks. When I joined the team I started thinking about our sitemaps, how they were generated, the many errors we generally struggle with there, and how to simplify that system. I'd done some work an introduced a tech plan on what it'd look like and started some internal API refactoring to make it easier to implement. The API refactors kind of stalled at the end of the last week and I came into this week not feeling a whole lot of motivation to push on them. One of Artsy's core values is the idea of _impact over perfection_ though, so next week I'm going to roll with my previous momentum and get it done.

In the mean time, I've been helping the team fix bugs and helping investigate a 3rd party marketing messaging integration. It's not super sexy work, but it moves the needle. And like [Orta](https://orta.io/) said in an [old comment](https://github.com/artsy/mobile/issues/68#issuecomment-164888807) of his that I stumbled on this week, incremental improvements are how big things get made. 

### Headspace

Another thing I'd like to reflect on is what's been occupying my mind over the week. There's generally two topics here that've been bouncing around this week. 

**What's wrong with our devices and how do we improve them?**

This is a topic that's been bouncing around in my head for a long time. It seems like lately it's just bouncing a little faster. In this vein I started a [twitter list](https://twitter.com/i/lists/1382752816817655814?s=20) about people I think have an interesting take on how technology can improve our lives. This is definitely a space I'd like to explore future. Of particular note I'd highly recommend the [metamuse podcast](https://museapp.com/podcast/) as it's been particularly enriching.

**Designing and building a custom mechanical keyboard**

In college I studied computer engineering. Generally I framed that as mostly electrical engineering with some CS classes sprinkled in. I interned at [Adtran](https://www.adtran.com/) while still in school and was able to work on some hardware projects professionally but after I graduated I mostly focused on software (and specifically web tech). I've been wanting to get back to my roots a bit and a keyboard seemed like an interesting and challenging project to tackle. If you struggle to visualize what this process might look like [Kevin Lynagh](https://kevinlynagh.com/) has an excellent [blog post](https://kevinlynagh.com/keyboards/) about his exploration in building keyboards over the last year. 

I've got a few different things I want to accomplish with this project. One is this idea that I want my keyboard smart enough to know what system I'm working on. I want to be able to build up cross system muscle memory in that way. I'd also like it to be able to host its own tiny webserver to give me a graphical mechanism to hot swap key bindings. Visually this would work similar to Ergodox's (https://ergodox-ez.com/pages/oryx) but hosted _on the device_. That'll obviously require a little more horse power than I could squeeze out of a tiny promicro. Luckily, I've had a few raspberry pi zero's sitting around that'll be perfect for this project. The actual motivation for this project was an [adafruit article](https://learn.adafruit.com/turning-your-raspberry-pi-zero-into-a-usb-gadget?view=all#other-modules) about how a raspberry pi zero could be turned into a usb gadget. Essentially, this means you can plug the pi into a computer via usb and have it be detected as something else... like a keyboard. 

I was pretty far down the rabbit hole of getting the pi setup and trying to tweak rasbian's setup to utilize the [linux gadget api](http://www.linux-usb.org/gadget/) before I actually discovered that most of these problems have been solved by the [nerves project](https://hexdocs.pm/nerves/getting-started.html) (which is a way to build embedded platforms with elixir). With a bit of searching I found an [article](https://medium.com/swlh/building-a-keyboard-with-elixir-fc7bd3f60ec3) about building a keyboard with a raspberry pi and nerves... which lead to me stumbling on a [small community](https://github.com/nerves-keyboard)doing exactly that! Suffice to say, that's going to be a fun rabbit hole. 

---

I think that's it friends. This ended up taking a bit of a different direction than I expected but sometimes it's about the journey. 

Be well.