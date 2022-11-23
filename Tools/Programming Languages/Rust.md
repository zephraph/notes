---
id: 01FVT7W5DWGZWXDAVZ7YFGTPK8
---
## Notes

- Automatically imports stuff from [prelude](https://doc.rust-lang.org/stable/std/prelude/index.html) into scope
- Use `cargo doc --open` to generate docs for current project and its dependencies and open them in the browser

### no_std

There was a conversation on [[Daily Notes/2021-09-29|2021-09-29]] during water cooler where [[Bryan]] mentioned `no_std` in rust being an incredibly important feature. There's a section linked in the article below.

- http://dtrace.org/blogs/bmc/2020/10/11/rust-after-the-honeymoon/

Essentially `no_std` does what it says... it doesn't include the standard library which makes a lot of broad assumptions about underlying systems which can't be made in embedded systems. 

## Errors and how to fix them

---
```text
thread 'rustc' panicked at 'assertion failed: `(left == right)`
  left: `Some(Fingerprint(4565771098143344972, 7869445775526300234))`,
  right: `Some(Fingerprint(14934403843752251060, 623484215826468126))`:
```

Fix documented in the [rust lang blog](https://blog.rust-lang.org/2021/05/10/Rust-1.52.1.html). I encountered this when building [[omicron]]-common and fixed it by running `cargo clean` to delete the incremental compiler cache.

## Type State

Encoding the state as a part of the type. First discovered via [this video](https://youtu.be/bnnacleqg6k?t=2023) shared by [[David Crespo]] on [twitter](https://twitter.com/davidcrespo/status/1456976507146887169).

Related resources

- [The Typestate Pattern in Rust](http://cliffle.com/blog/rust-typestate/) by [[Cliff Biffle]]