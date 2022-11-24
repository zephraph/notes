---
id: 01GJKWS282W5NT95M68M5EPFWY
url: https://learning.edx.org/course/course-v1:IsraelX+LIBPROGx+3T2022/home
---

**Summary**: This course was _mildly_ interesting and there was some stuff about [[statecharts]] that I learned, but overall it was kind of meh. A lot of basic information and 

## 2.4 Topology vs Geometry

Topology is more fundamental than geometry. Geometry deals with the shape of an object whereas topology deals more with its physical nature. E.g. in topology a cube and sphere are the same because they can be molded to be the same shape. A sphere and a donut aren't the same because one has a hole and one is whole. Topology doesn't allow tearing or adding a hole to a geometry. 

>[!NOTE]
> I found this course via this tweet by [[👤 People/Chris Shank|@chrisshank]]:
> <blockquote class="twitter-tweet"><p lang="en" dir="ltr">When I feel this I remind myself to take a step back to focus on topology (e.g. containment, connection, order) rather than geometry (e.g. shape, position, size). Topology has little concern for such a strict structure. This insight is from David Harel:<a href="https://t.co/vycol01C45">https://t.co/vycol01C45</a></p>&mdash; 𝕮 | @chrisshank@mastodon.social (@chrisshank23) <a href="https://twitter.com/chrisshank23/status/1595577568274845696?ref_src=twsrc%5Etfw">November 24, 2022</a></blockquote>

**Encapsulation**, **Intersection**, and **Connection** are three primary topological notions. When considering visual languages [[David Harel|Harel]] posits that we should focus first on the topological aspects and not be distracted by the geometric ones. 

## 3. Statecharts

- Inner states are collapsible visually
- Events can be broadcasted to parallel states via the syntax `a/b` where `a` is the triggered event and `b` is the event to be broadcast. 
- Guards are generally represented in `[]` where `a[b]` means the event `a` only triggers if the guard `b` is satisified. 

