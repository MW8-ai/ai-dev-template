# DAILY_REFRESH_PROMPT.md

Use this prompt manually or in a scheduled research workflow.

```text
Check official vendor docs and changelogs for the tools listed in CURRENT_TOOL_REGISTER.md.
Only use official sources where possible.
Create a dated snapshot file in docs/07_snapshots/.
Do not modify core guidance unless a material change affects workflow, safety, pricing, or tool support.
Summarize:
- what changed
- source links
- whether any repo docs should be updated
- whether this is urgent or informational
```

## Automation Note

Daily checking is optional.

For most projects, weekly or monthly is enough.

Use daily checks only for active tool evaluation, enterprise governance, or fast-moving pilots.
