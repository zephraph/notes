
Issue: https://github.com/oxidecomputer/omicron/issues/2036

RFD-352

- Physical Resource allocation metrics

Resource overview API
- What sleds are in the rack?
- What disks are plugged into the sled?

Multiple views of component listings
- See physical representation of rack and sleds with disk utilizations

For disks do we show all the partitions or only partitions that have z-pools?
Usually there will only be 1 partition with z-pool.
- This is the only one that exposes metrics

z-pools have a name and datasets

![[Pasted image 20230109164120.png]]

RFD-312 (storage)