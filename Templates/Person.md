<%* tp.file.title = await tp.system.prompt('Name', 'Person') %>
<%* tp.file.functions.move(`👤 People/${tp.file.title}`, tp.config.target_file) %>
---
id: <% tp.user.ulid() %>
tags: person
alias: <% tp.user.first_name(tp) %>
---

