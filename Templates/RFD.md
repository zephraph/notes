<%* 
tp.file.title = await tp.system.prompt('RFD', 'XXXX -- Title') 
const f = tp.config.target_file
f.name = f.basename = tp.file.title
f.path = `Oxide/rfds/${f.name}.md`
-%>
---
id: <% tp.user.ulid() %>
tags: oxide/rfd
alias: RFD <% tp.user.rfd_name(tp) %>
---

https://rfd.shared.oxide.computer/rfd/<% tp.file.title.split('--')[0].trim() %>
