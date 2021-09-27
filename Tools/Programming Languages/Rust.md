## Notes

- Automatically imports stuff from [prelude](https://doc.rust-lang.org/stable/std/prelude/index.html) into scope
- 

## Errors and how to fix them

---
```text
thread 'rustc' panicked at 'assertion failed: `(left == right)`
  left: `Some(Fingerprint(4565771098143344972, 7869445775526300234))`,
  right: `Some(Fingerprint(14934403843752251060, 623484215826468126))`:
```

Fix documented in the [rust lang blog](https://blog.rust-lang.org/2021/05/10/Rust-1.52.1.html). I encountered this when building [[omicron]]-common and fixed it by running `cargo clean` to delete the incremental compiler cache.