# Wiki Query Skill

**Purpose:** Efficiently query the LLM Wiki knowledge base  
**When to use:** User has questions about documented knowledge  
**Key principle:** File valuable answers back into wiki (knowledge compounds)

---

## What This Skill Does

Answers questions by navigating the wiki efficiently:
1. Reads hot.md (recent context)
2. Reads index.md (content map)
3. Searches keywords if needed
4. Reads 3-10 specific pages
5. Synthesizes answer with citations
6. Files valuable answers back to wiki
7. Updates log.md if answer filed

---

## How to Use

**Simple query:**
```
User: "What is 4-stage analysis?"
```

**Complex query:**
```
User: "How does JARVIS detect Stage 2 entry signals and what indicators are used?"
```

**Cross-domain query:**
```
User: "What are the key learnings from Phase 0?"
```

---

## Execution Steps

### 1. Read Hot Cache

**File:** `wiki/hot.md`

**Look for:**
- Recent context (last 24-48 hours)
- Active focus areas
- Recent learnings
- Quick links

**Purpose:** Answer might be in recent context (90% of queries)

**If answer found:** Cite hot.md and answer immediately

### 2. Read Index

**File:** `wiki/index.md`

**Look for:**
- Relevant domain section
- Concepts matching query keywords
- Entities matching query
- Sources that might contain answer

**Purpose:** Navigation map to find relevant pages

### 3. Search Keywords (Optional)

**If index doesn't have obvious matches:**

```bash
# Search wiki pages for keywords
grep -ri "stage 2" wiki/

# Search specific domain
grep -ri "MACD" wiki/ | grep -i "invest"

# Find page with most matches
grep -ric "portfolio" wiki/*.md | sort -t: -k2 -rn | head -5
```

### 4. Read Specific Pages

**Priority order:**
1. Concept pages (direct answers)
2. Source pages (detailed info)
3. Entity pages (context)
4. Synthesis pages (cross-cutting insights)

**Read 3-10 pages:**
- Start with most relevant (from index or grep)
- Read until answer is complete
- Note contradictions if found
- Track which pages used

**Example for "What is 4-stage analysis?":**
1. Read `wiki/4-stage-analysis.md` (concept page)
2. Read `wiki/asset-revesting.md` (source page)
3. Read `wiki/chris-vermeulen.md` (entity - creator)
4. Done (3 pages sufficient)

### 5. Synthesize Answer

**Format:**
```markdown
[Answer to user's question]

**From wiki:**
- [[Page 1]] — [What it contributed]
- [[Page 2]] — [What it contributed]
- [[Page 3]] — [What it contributed]

**Sources:**
^[raw/path/to/source1.md]  
^[raw/path/to/source2.md]
```

**Include:**
- Direct answer to question
- Supporting details
- Examples if helpful
- Citations to wiki pages
- Source attribution

**Avoid:**
- Overly long answers (be concise)
- Info not in wiki (don't hallucinate)
- Missing citations

### 6. Determine if Answer Should Be Filed

**File answer to wiki if:**
- ✅ Answer synthesizes multiple pages
- ✅ Answer provides unique insight
- ✅ Question likely to be asked again
- ✅ Answer fills a gap in wiki

**Don't file if:**
- ❌ Simple lookup (already in one page)
- ❌ Trivial question
- ❌ Time-sensitive (will be outdated)
- ❌ User just browsing

**Example worth filing:**
- "How does JARVIS detect Stage 2 signals?" → synthesis page
- "What's the complete investment workflow?" → synthesis page
- "How do I reduce token usage?" → synthesis page

**Example NOT worth filing:**
- "What is Chris Vermeulen's background?" → already in entity page
- "When was the last market analysis?" → check log.md
- "How many wiki pages exist?" → check wiki-status

### 7. File Answer (If Valuable)

**Create synthesis page:**

```markdown
---
title: [Question as Title]
type: synthesis
domain: [domain]
tags: [tag1, tag2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [source1.md, source2.md]
status: reviewed
query_origin: true
---

# [Question as Title]

**Question:** [Original user question]  
**Answered:** YYYY-MM-DD

## Answer

[Complete synthesized answer]

## Details

[Supporting details, examples, explanations]

## Pages Consulted

- [[Page 1]] — [Contribution]
- [[Page 2]] — [Contribution]
- [[Page 3]] — [Contribution]

## Sources

Information derived from:
^[raw/source1.md]  
^[raw/source2.md]

## Related Questions

- [[Related Question 1]]
- [[Related Question 2]]
```

**Add to index.md:**
```markdown
## [Domain] Domain

### Synthesis
- [[Question]] — Answer summary ( #query #domain)
```

### 8. Update Log (If Filed)

**Add entry:**
```markdown
## [YYYY-MM-DD] query | [Question Title]

- **Type:** query
- **Question:** [User's question]
- **Pages read:** N
- **Pages consulted:** [[Page 1]], [[Page 2]], [[Page 3]]
- **Answer filed:** wiki/[filename].md
- **Key finding:** [Most important insight]
- **Token cost:** ~X tokens (hot.md: 500 + index: 1k + pages: Xk)
```

**Don't update log if answer not filed** (too noisy)

### 9. Report to User

**If answer filed:**
```markdown
[Synthesized answer]

**From wiki:**
- [[Page 1]]
- [[Page 2]]
- [[Page 3]]

✅ **Answer filed to wiki:** [[Question Page]]

This answer is now part of the knowledge base and can be quickly referenced in future sessions.
```

**If answer not filed:**
```markdown
[Synthesized answer]

**From wiki:**
- [[Page 1]]
- [[Page 2]]
```

---

## Navigation Patterns

### Hot-First Pattern (90% of queries)
```
hot.md (500 tokens) → answer found
Total: 500 tokens
```

### Index Navigation (most queries)
```
hot.md (500 tokens) → index.md (1k tokens) → 3 pages (2k tokens)
Total: ~3.5k tokens
```

### Deep Search (complex queries)
```
hot.md → index.md → grep search → 10 pages (5k tokens)
Total: ~6.5k tokens
```

**Compare to current JARVIS:**
- Read all context: 15k tokens
- Find in scattered files: 5k tokens
- Total: 20k tokens

**Token savings: 65-97% depending on query**

---

## Query Types

### 1. Concept Lookup

**Query:** "What is [concept]?"

**Process:**
1. Check hot.md
2. Check index for concept
3. Read concept page
4. Answer

**File?** No (already documented)

### 2. How-To / Workflow

**Query:** "How do I [do something]?"

**Process:**
1. Check hot.md
2. Check index for relevant concepts
3. Read 3-5 pages
4. Synthesize workflow
5. File as synthesis page

**File?** Yes (valuable synthesis)

### 3. Cross-Domain

**Query:** "What are all the patterns related to [topic]?"

**Process:**
1. Check index across all domains
2. Read pages from multiple domains
3. Synthesize cross-cutting insights
4. File as synthesis page

**File?** Yes (cross-domain insights valuable)

### 4. Historical / Timeline

**Query:** "When did we implement [feature]?"

**Process:**
1. Check log.md (grep for keyword)
2. Check relevant source pages
3. Provide timeline
4. File if complex timeline

**File?** Maybe (if complex history)

### 5. Comparison

**Query:** "What's the difference between [A] and [B]?"

**Process:**
1. Read pages for A and B
2. Compare side-by-side
3. Synthesize differences
4. File as synthesis page

**File?** Yes (comparisons valuable)

---

## Special Cases

### Contradiction Found

**If wiki pages contradict:**

```markdown
[Partial answer based on consensus]

⚠️ **Contradiction detected:**
- [[Page A]] states: [claim A]
- [[Page B]] states: [claim B]

**Investigation needed:** [What needs to be resolved]

Should I:
1. Run wiki-lint to check all contradictions?
2. Research which claim is correct?
3. File this contradiction for manual review?
```

**Don't smooth over contradictions** — surface them explicitly

### Information Missing

**If wiki doesn't have answer:**

```markdown
❌ **Not found in wiki:**
The question "[question]" isn't answered in current wiki pages.

**Checked:**
- hot.md
- index.md
- grep search for keywords

**Suggestions:**
1. Ingest sources that might contain this: [suggest sources]
2. Web search and add to raw/documents/
3. Mark as gap for future research

Should I create a placeholder page for this topic?
```

**Don't hallucinate** — admit when wiki doesn't know

### Stale Information

**If information is outdated:**

```markdown
[Answer from wiki]

⚠️ **Note:** This information is from YYYY-MM-DD. 
Source may have been updated since then.

**Check:**
- raw/[source] for changes
- .manifest.json for last ingest date

Should I re-ingest the source to update?
```

---

## Quality Guidelines

**High-quality queries:**
- Read hot.md first (90% of answers)
- Use index for navigation (don't read all pages)
- Cite specific pages used
- File valuable syntheses
- Surface contradictions
- Admit when wiki doesn't know

**Avoid:**
- Reading all wiki pages (defeats token efficiency)
- Not citing sources
- Filing trivial answers
- Hallucinating info not in wiki
- Smoothing over contradictions

---

## Performance Metrics

**Target:**
- 80%+ queries answered from hot.md + index.md (<1.5k tokens)
- 15% require reading 3-5 pages (2-4k tokens)
- 5% require deep search (5-7k tokens)
- 97% token reduction vs reading all context

**Track:**
- Pages read per query (target: <5 average)
- Token cost per query (target: <3k average)
- Answers filed (target: 20% of queries)

---

## Integration Points

**Called by:**
- User (manual queries)
- Morning briefing (automated queries)
- Other skills (wiki lookup)

**Calls:**
- hot.md (always)
- index.md (almost always)
- wiki/*.md (selective)
- log.md (if filing answer)

**Updates:**
- wiki/[synthesis-page].md (if filing)
- index.md (if filing)
- log.md (if filing)

---

## Success Criteria

Query is successful when:
1. hot.md read first
2. index.md used for navigation
3. Specific pages read (not all pages)
4. Answer synthesized with citations
5. Valuable answers filed to wiki
6. Contradictions surfaced (not hidden)
7. Gaps acknowledged (not hallucinated)
8. Token usage <5k (vs 20k current)

---

## Notes

- **Hot cache is key:** 90% of answers in recent context
- **Index is navigation:** Don't grep without checking index first
- **File valuable answers:** Queries should compound into wiki
- **Progressive disclosure:** Read only what's needed
- **Token efficiency:** 80-97% reduction vs current approach
- **Quality over speed:** Cite sources, file syntheses

---

**End of Skill**
