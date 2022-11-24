---
id: 01GJHMXCX39WKWT316EXM9N5GT
---

Short for _Universally Unique Lexicographically Sortable Identifier_, ULID is a unique ID format which uses no special characters, is textually shorter than UUID, and is sortable. 

> [!NOTE] > Everything below this is directly copied from [the spec](https://github.com/ulid/spec)

## Specification

Below is the current specification of ULID as implemented in [ulid/javascript](https://github.com/ulid/javascript).

_Note: the binary format has not been implemented in JavaScript as of yet._

```
 01AN4Z07BY      79KA1307SR9X4MV3

|----------|    |----------------|
 Timestamp          Randomness
   48bits             80bits
```

### Components

**Timestamp**

-   48 bit integer
-   UNIX-time in milliseconds
-   Won't run out of space 'til the year 10889 AD.

**Randomness**

-   80 bits
-   Cryptographically secure source of randomness, if possible

### Sorting

The left-most character must be sorted first, and the right-most character sorted last (lexical order). The default ASCII character set must be used. Within the same millisecond, sort order is not guaranteed

### Canonical String Representation

```
ttttttttttrrrrrrrrrrrrrrrr

where
t is Timestamp (10 characters)
r is Randomness (16 characters)
```

#### Encoding

Crockford's Base32 is used as shown. This alphabet excludes the letters I, L, O, and U to avoid confusion and abuse.

```
0123456789ABCDEFGHJKMNPQRSTVWXYZ
```