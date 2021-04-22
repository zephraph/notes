- [[blog post]]
- Inspiration
    - [I'm a software engineer going blind, how should I prepare?](https://news.ycombinator.com/item?id=22918980)
        - "You can definitely continue as a software 
engineer. I'm living proof. It won't be easy, especially at first. For a
 while it will feel like you're working twice as hard just to keep up 
with your sighted peers. But eventually, the better you get with your 
tools, you'll find you have some superpowers over your sighted peers. 
For example, as you get better with a screen reader, you'll be bumping 
the speech rate up to 1.75-2X normal speech. You'll be the only one who 
can understand your screen reader. You'll become the fastest and most 
proficient proof reader on your team. Typos will be easily spotted as 
they just won't "sound right". It will be like listening to a familiar 
song and then hitting an off note in the melody. And this includes code.
 Also, because code is no longer represented visually as blocks, you'll 
find you're building an increasingly detailed memory model of your code.
 Sighted people do this, too, but they tend to visualize in their mind. 
When you abandon this two dimensional representation, your non-visual 
mental map suffers no spatial limits. You'll be amazed how good your 
memory will get without the crutch of sight. Good luck. If you're a Mac 
user you can hit me up for tool recommendations. My email is my username
 at gmail dot com." by [kolanos](https://news.ycombinator.com/user?id=kolanos).
        - https://www.parhamdoustdar.com/2016/04/03/tools-of-blind-programmer/
        - [An Exploratory Study of Blind Software Developers](https://people.engr.ncsu.edu/ermurph3/papers/vlhcc12.pdf)
        - https://github.com/EmpowermentZone/EdSharp
        - https://stackoverflow.com/questions/118984/how-can-you-program-if-youre-blind
- What would it look like if there was a way to program __without__ interacting w/ the syntax. Take prettier to the logical extreme: all whitespace is auto formatted. 
- Tried to install [[mint-lang]] today but had a pretty frustrating experience. There's a few things that are required to resolve that. 
    - On OSX, `llvm` takes a _really_ long time to build. You want to make sure to avoid that. The `llvm` bottle from `brew` requires `Xcode CLT` to be installed.
    - `XCode CLT` is `XCode's Command Line Toolkit` which can be downloaded from [apple](https://developer.apple.com/download/more/)
    - To see if you have CLT installed run `brew config`
