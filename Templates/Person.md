---
id: 01FVT7W5DVHEPEFBRF8EXG3KDH
---
<%* 
tp.file.title = await tp.system.prompt('Name', 'Person') 
const f = tp.config.target_file
f.name = f.basename = tp.file.title
f.path = `👤 People/${f.name}`
-%>
---
id: <% tp.user.ulid() %>
tags: person
alias: <% tp.user.first_name(tp) %>
---

