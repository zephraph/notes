---
alias: RFD 192
---

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