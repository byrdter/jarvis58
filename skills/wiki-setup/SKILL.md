# Wiki Setup Skill

**Purpose:** Initialize or verify LLM Wiki structure for JARVIS  
**When to use:** First-time setup or after structural changes  
**Location:** `jarvis-private/context/`

---

## What This Skill Does

Ensures the complete LLM Wiki structure exists and is properly initialized:
- Creates directory structure (raw/, wiki/)
- Creates or verifies core files (SCHEMA.md, hot.md, index.md, log.md, .manifest.json)
- Verifies existing context files are cataloged
- Reports wiki status and readiness

---

## How to Use

```
User: "Set up the wiki" or "Verify wiki structure"
```

Claude will:
1. Check if wiki structure exists
2. Create missing directories/files
3. Verify SCHEMA.md is current
4. Update .manifest.json
5. Report status

---

## Execution Steps

### 1. Verify Directory Structure

**Check paths exist:**
```bash
# Required directories
${JARVIS_PRIVATE}/context/raw/
${JARVIS_PRIVATE}/context/raw/documents/
${JARVIS_PRIVATE}/context/raw/transcripts/
${JARVIS_PRIVATE}/context/raw/reports/
${JARVIS_PRIVATE}/context/raw/data/
${JARVIS_PRIVATE}/context/wiki/
```

**If missing:** Create with `mkdir -p`

### 2. Verify Core Files

**Check files exist:**
- `context/SCHEMA.md` — Wiki schema and workflows
- `context/wiki/hot.md` — Rolling context cache
- `context/wiki/index.md` — Content catalog
- `context/wiki/log.md` — Operations history
- `context/.manifest.json` — Delta tracking

**If missing:** Use templates from SCHEMA.md or create fresh

### 3. Verify SCHEMA.md Content

**Check SCHEMA.md includes:**
- Three-layer architecture explanation
- Directory structure documentation
- Page templates (concept, entity, source, synthesis)
- Workflows (ingest, query, lint)
- JARVIS-specific rules (7 domains, investment templates)
- Frontmatter conventions
- Wikilink conventions

**If outdated:** Update from latest spec

### 4. Update .manifest.json

**Verify manifest tracks:**
- Wiki pages created
- Stats (pages, sources, domains)
- Scheduled tasks
- Last operations

**Update stats:**
```json
{
  "last_updated": "YYYY-MM-DDTHH:MM:SSZ",
  "stats": {
    "total_pages": [count wiki/*.md],
    ...
  }
}
```

### 5. Catalog Existing Context

**Check index.md catalogs:**
- memory/learnings.md
- memory/user-preferences.md
- memory/work-status.md
- projects/*/CLAUDE.md
- tools/*.md
- conversations/*.md

**If missing:** Add entries to index.md

### 6. Report Status

**Output:**
```markdown
## Wiki Setup Status

✅ Directory structure verified
✅ Core files present
✅ SCHEMA.md current (v1.0)
✅ .manifest.json updated
✅ Existing context cataloged (N files)

**Wiki Location:** ${JARVIS_PRIVATE}/context/

**Structure:**
- raw/ (4 subdirectories)
- wiki/ (N pages)
- SCHEMA.md, .manifest.json

**Next Steps:**
1. Begin ingesting sources with wiki-ingest skill
2. Query wiki with wiki-query skill
3. Check health with wiki-lint skill
4. View status with wiki-status skill
```

---

## Validation Checklist

Before reporting success, verify:

- [ ] All directories exist
- [ ] All core files exist and non-empty
- [ ] SCHEMA.md has correct version
- [ ] hot.md has valid frontmatter
- [ ] index.md catalogs existing files
- [ ] log.md has setup entry
- [ ] .manifest.json has valid JSON
- [ ] No syntax errors in any file

---

## Error Handling

**If directory creation fails:**
- Check permissions
- Check disk space
- Report error to user with path

**If file creation fails:**
- Check permissions
- Check file locks
- Report error to user

**If SCHEMA.md missing:**
- Cannot proceed without schema
- Prompt user to restore from backup or research/

---

## Post-Setup Actions

**Automatic:**
- Update log.md with setup operation
- Update hot.md with setup status
- Update .manifest.json stats

**Prompt user:**
- "Wiki structure ready. Would you like to ingest existing context files?"
- Suggest starting with high-value sources (projects/investments/CLAUDE.md)

---

## Integration Points

**Called by:**
- New JARVIS installations
- After git pull with structural changes
- Manual verification requests

**Calls:**
- None (foundational skill)

**Updates:**
- .manifest.json
- log.md
- hot.md
- index.md (if cataloging needed)

---

## Success Criteria

Wiki is considered "set up" when:
1. All directories exist
2. All core files exist and valid
3. index.md catalogs existing context
4. .manifest.json has current stats
5. No errors or warnings

---

## Notes

- This skill is idempotent (safe to run multiple times)
- Does not modify existing wiki pages (only creates missing structure)
- Does not ingest sources (use wiki-ingest for that)
- Phase 1 creates flat wiki/ structure (no subfolders except meta files)
- Phase 2+ may add subfolders (investments/, concepts/, etc.)

---

**End of Skill**
