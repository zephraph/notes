As I've been working on my site I've been a little frustrated at the difficulty of parsing markdown. I want something that's just easier to work with. Being able to quickly edit something directly from the file should be possible while still mainly focusing the usecase on ease of parsing. 

```
title=Building a better smartphone

node:heading
level=1

The world deserves a better smartphone. 

node:paragraph 

Isn't that true? here's a

  node:break
  size=2

  node:link
  href=https://www.google.com

that represents some content. Now, I know this is ugly, but it's easy to read
and easy to parse, right? You could mention a 
node:whatever which would just have to be escaped by whatever you were using to write

  node:codeblock
  lang=javascript

  x=test

parsing semantics:
\s+node:<name>
```