---
id: <% tp.user.ulid() %>
---
<%* 
tp.file.title = await tp.system.prompt('Title') 
const f = tp.config.target_file
f.name = f.basename = tp.file.title
f.path = `📥 Notes/${f.name}.md`
-%>