---
alias: RFD 192
---

https://rfd.shared.oxide.computer/rfd/0192

# Goals

- Calls out [[0048 -- Control plane requirements|RFD 48]] mentioning the API should be strongly consistent
- [[0048 -- Control plane requirements|RFD 48]] and [[0053 -- Control plane data storage requirements|RFD 53]] are good to read for requirements

# Modeling control plane data

- This section mentions "VPCs are useful for some of our examples because they’re created synchronously." Why are VPCs created synchronously?
	- Mentions checking out [[0021 -- User networking api|RFD 21]] for more info on VPCs
- Are we building organizations into Nexus?
- Pagination
	- enumeration should include items present in the scan but not what was changed during the scan
	- must be bounded time

## Modeling a collection

- Defines [[identity metadata]]
- Uses [unique partial indexes](https://www.cockroachlabs.com/docs/v21.1/partial-indexes#unique-partial-indexes)
	- i.e. instance uses `project_id` and `name` together
	- is unique on that combination
	- partial means only some rows are indexed, i.e. when `time_deleted` is null

## Use of foreign keys

- Foreign keys can have a performance impact by requiring the db to check two tables in order to run a query
- Does this still ne
> Referential integrity also requires that if we delete a row in the foreign table, we must ensure that there are no rows in this table that reference it. It would be possible to do this efficiently with our unique index by name. Does CockroachDB use that? We would really want to verify this before switching to using explicit foreign keys to avoid seemingly innocuous operations generating very expensive scans. We’d also want to make sure we understand (and carefully choose) the behavior of operations like "DELETE" when foreign keys are used.

