1. Export as RTE
2. Copy/Paste that into vscode
3. Use find & replace w/ regex and replace `^\[[0-9|:]+\]` with nothing
4. Use find & replace w/ regex and replace `^ ` with nothing
5. Use find & replace w/ regex and replace `$\n` with `\n\n`
6. Use find & replace w/ regex and replace `^(\w+):` with `**$1**:`