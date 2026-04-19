# Playbook Authoring Routine

Standard procedure for every new playbook added to openemis-mcp-pro.

---

## Four-Step Routine

### 1. Prepare the Doc

- Dispatch **Xirdal** to analyse the API write surface from source:
  - Check `data/manifest.jsonl` for which resources support POST/PUT/DELETE
  - Read PHP model files in `/Users/khindol/webstore/api/` for required fields, FK names, composite PKs, workflow-control flags
- Dispatch **Coddy** to cross-check Xirdal's findings (second opinion, different model family)
- Incorporate all corrections before writing
- Write the playbook to `docs/playbooks/{id}.md` following the standard format:
  - Title, Domain, Audience, Playbook ID
  - Description
  - **Questions to Ask First** table (for write playbooks — the agent must collect all needed info before any write)
  - Resources Used
  - Steps table
  - Step Notes with exact POST/PUT body examples
  - Key Gotchas
  - Example Query

### 2. Translate

- Run `scripts/translate_docs.py` on the new doc for Russian, Spanish, Arabic, Hindi
- Translated files go to `docs/playbooks/{id}.ru.md`, `.es.md`, `.ar.md`, `.hi.md`
- Apply Arastu's per-language style guide (formal register — see script header)
- Never translate backtick content or API resource names

### 3. Add to Pro (all files)

- English doc + all translations → `docs/playbooks/`
- Add entry to `data/playbooks.json`
- Update `data/grouped-manifest.json` (copy entry from playbooks.json, add `"coverage": 100`)
- Update Pro README: add row to playbooks table with translation links
- Commit and push to `openemis-mcp-pro`

### 4. Add to Free (read-only playbooks only, with memo)

> ⚠️ **Write playbooks stay in Pro only.** A playbook is read-only if its steps use only `openemis_get`. If it uses `openemis_create`, `openemis_update`, or `openemis_delete` — Pro only, do not add to free.

For **read-only playbooks**:
- Copy English doc to `openemis-mcp/docs/playbooks/{id}.md`
- Add the memo under the `# heading` (after the first `# Title\n` line):
  ```
  > 📖 **Read-only server.** Playbooks that create or update records require **[openemis-mcp-pro](https://github.com/tixuz/openemis-mcp-pro)**.
  ```
- Copy all translations to `openemis-mcp/docs/playbooks/` — same memo on each translated file
- Add entry to `openemis-mcp/data/playbooks.json`
- Update `openemis-mcp/data/grouped-manifest.json`
- Update free README: add row to playbooks table with translation links (Translations column)
- Commit and push to `openemis-mcp`

---

## Playbook Format Reference

```markdown
# {Title}

**Domain:** {domain}  
**Audience:** {comma-separated roles}  
**Playbook ID:** `{kebab-case-id}`

## Description

One paragraph. Key gotchas about the domain upfront (composite PKs, workflow control, FK traps).

---

## Questions to Ask First     ← write playbooks only

| Question | Field | Notes |
|---|---|---|
| ... | ... | ... |

---

## Resources Used

| Resource | Purpose |
|---|---|
| `resource-name` | What it does in this workflow |

---

## Steps

| Step | Action | Resource | Purpose |
|---|---|---|---|
| 1 | `openemis_get` / `openemis_create` | `resource-name` | Why |

---

## Step Notes

One sub-section per non-trivial step. Include exact POST/PUT body examples.

---

## Key Gotchas

- Bullet list of things that will silently fail or cause 422 in production.

---

## Example Query

> *"Natural language question the user might ask"*

1. `tool_call { ... }` → result
2. `tool_call { ... }` → result
```

---

## Checklist Before Committing

- [ ] Xirdal analysed — Coddy cross-checked
- [ ] All FK field names verified (especially plural/singular traps)
- [ ] Composite PKs noted
- [ ] Workflow-controlled resources flagged (no direct write)
- [ ] Questions to Ask First covers all required fields
- [ ] POST body examples include ALL required fields
- [ ] PUT pattern documented (fetch-merge-PUT, full payload)
- [ ] Translation files created
- [ ] playbooks.json updated
- [ ] grouped-manifest.json updated
- [ ] README table updated with translation links
- [ ] Free repo updated (read-only playbooks only, with memo)
