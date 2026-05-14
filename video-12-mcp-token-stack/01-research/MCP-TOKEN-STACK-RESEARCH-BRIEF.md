# MCP Token Stack Research Brief

**Working video title:** MCP Token Costs Changed. Here's What Still Matters.

**Date:** 2026-05-14

**Purpose:** Build a source-backed foundation for a 10-15 minute Byrddynasty video about modern MCP token optimization, Claude Skills, code execution, scoped tool loading, and JARVIS's practical architecture.

## Executive Takeaway

The old claim, "MCP servers burn your context window before you ask a question," is no longer universally true in current Claude Code. Claude Code now enables MCP Tool Search by default in supported environments, deferring full MCP tool schemas until a relevant tool is needed.

But the problem is not gone. It moved.

The modern issue is a full **token stack** problem:

- Tool schemas can still load upfront in unsupported configurations.
- Tool outputs and intermediate results still accumulate in context.
- Too many similar tools still create selection and reliability problems.
- Large JSON, markdown, HTML, or raw web results still waste tokens.
- Procedural knowledge still belongs in Skills, not MCP.
- Multi-step data workflows increasingly belong behind code execution or programmatic tool calling.

The strongest video thesis:

> MCP fixed much of the upfront schema problem, but serious agent builders now need a layered token strategy: Tool Search, scoped tools, Skills, CLI/scripts, code execution, output filtering, and compact structured formats.

## Safe Core Claims

These claims are safe to make with current evidence:

1. **Claude Code now defers MCP tool schemas by default in supported environments.**
   Official Claude Code docs say Tool Search keeps context low by loading only tool names at session start and loading full schemas on demand.

2. **The old "all MCP tools always load upfront" argument is now incomplete.**
   It may still be true for some clients, older versions, disabled Tool Search, unsupported models, Vertex AI defaults, or proxy setups, but it is not the default Claude Code behavior in normal first-party supported environments.

3. **Code execution with MCP can dramatically reduce token usage for data-heavy workflows.**
   Anthropic's engineering post gives a Google Drive to Salesforce example where token usage drops from about 150,000 tokens to about 2,000 tokens, a 98.7% reduction.

4. **Skills still matter because they solve a different problem than MCP.**
   Skills package procedural knowledge and reusable workflows. Claude Code loads skill descriptions at startup and full skill content only when invoked, with user-only skills costing zero context until invoked.

5. **MCP is still best for live external tools.**
   MCP is appropriate for services like GitHub, Slack, Gmail, databases, browser automation, web data, and other authenticated/live systems.

6. **Large tool outputs remain a context problem even after tool schemas are deferred.**
   Official Claude Code agent-loop docs say conversation history, tool inputs, and tool outputs accumulate across turns. Claude Code MCP docs also warn about large MCP outputs and default result limits.

7. **Scoped MCP loading is a real pattern.**
   Bright Data's MCP docs and GitHub README support group-based loading and explicit tool allowlists using `GROUPS` and `TOOLS`, reducing context by exposing fewer tools.

8. **TOON can reduce structured-output tokens for the right data shape.**
   TOON docs claim 30-60% token reduction compared to JSON, especially for flat, uniform arrays. This should be presented as useful for certain data, not a universal JSON replacement.

## Claims To Avoid Or Qualify

Do not say:

- "Skills beat MCPs by 97%."
- "MCP is bad."
- "MCP no longer has token costs."
- "Tool Search solves MCP context bloat completely."
- "TOON always saves 60%."
- "The 98.7% Anthropic code-execution result applies to every MCP workflow."

Better wording:

- "The old upfront MCP problem is mostly solved in supported Claude Code setups."
- "The new bottleneck is output volume, intermediate results, and choosing the right layer."
- "Skills are better for reusable know-how. MCP is better for live tools."
- "Code execution gives the biggest savings when the workflow has many tools or large intermediate data."

## Current State: What Changed With MCP

### Tool Search In Claude Code

Claude Code now supports MCP Tool Search. Instead of loading all full MCP JSON schemas upfront, Claude Code:

- loads tool names initially;
- defers full schemas;
- lets Claude search for relevant tools when needed;
- loads only the tools actually used.

The docs say Tool Search is enabled by default. The docs also say descriptions and server instructions are truncated at 2KB each, which means MCP server authors must keep critical routing details near the start.

### Tool Search Caveats

Tool Search can fall back or fail depending on environment:

- Vertex AI default behavior can fall back to upfront loading.
- Non-first-party `ANTHROPIC_BASE_URL` hosts can fall back because proxies may not forward `tool_reference` blocks.
- Unsupported models do not support Tool Search. Docs call out Sonnet 4+ and Opus 4+ support, with Haiku models not supporting Tool Search.
- `ENABLE_TOOL_SEARCH=false` disables deferral.
- `ENABLE_TOOL_SEARCH=auto` uses threshold mode: tools load upfront if they fit inside a context percentage, defaulting to 10%.
- `alwaysLoad: true` on a server or `anthropic/alwaysLoad` on a tool forces upfront loading.
- Denying the `ToolSearch` tool disables this path.

Video angle: Tool Search changes the baseline, but builders still need to know when they are outside the happy path.

## Code Execution With MCP

Anthropic's engineering post argues that direct MCP tool calls scale poorly when agents have hundreds or thousands of tools and large intermediate results. The proposed solution is to present MCP tools as code APIs inside a filesystem-like environment.

Pattern:

```text
servers/
  google-drive/
    getDocument.ts
  salesforce/
    updateRecord.ts
```

The agent discovers tools by navigating files and reads only the tool definitions needed for the task. Then it writes code that calls the tools and filters/processes intermediate data before returning a final result to the model.

Anthropic example:

- Direct approach: about 150,000 tokens.
- Code execution approach: about 2,000 tokens.
- Reduction: 98.7%.

Why this matters:

- Tool definitions are loaded on demand.
- Loops and conditionals happen in code rather than model round trips.
- Intermediate data can stay inside the execution environment.
- Sensitive data can be processed without entering model context.
- Reusable code can be saved and used again.

Important caveat: this is powerful but higher complexity. It needs sandboxing, resource limits, permissions, and careful data-flow design.

## Programmatic Tool Calling

Programmatic Tool Calling lets Claude write code that calls tools from within a code execution container instead of doing a model round trip per tool call.

Key points:

- Tools opt in using `allowed_callers`.
- The response includes a `caller` field showing the code execution tool that invoked the tool.
- Anthropic's advanced tool-use post describes this as letting Claude orchestrate tools through code and control what enters context.
- It is strongest for multi-step lookup/filter/aggregation workflows where the model only needs the final answer.

Limitation to verify in final script: the provided transcript says MCP connector tools cannot currently be called programmatically. Treat this as a research question unless confirmed directly in the latest docs. Even if true, the code-execution-with-MCP pattern can still present MCP tools as code APIs through a separate layer.

## Skills: What They Still Do Better

Claude Code Skills are not MCP replacements. They are a progressive-disclosure mechanism for reusable knowledge and workflows.

Official docs support:

- Skill descriptions are available at startup.
- Full skill content loads only when the skill is invoked.
- `disable-model-invocation: true` makes user-only skills invisible to Claude until invoked, producing zero context cost until use.
- Subagents are different: skills listed for a subagent are preloaded into that subagent context.

Best use cases:

- deployment runbooks;
- video production workflows;
- research procedures;
- data-analysis playbooks;
- coding conventions;
- document-generation process;
- JARVIS-specific operating procedures.

Bad use cases:

- live API access;
- authenticated SaaS operations;
- database queries;
- operations requiring a structured external tool call.

Video wording:

> MCP gives the agent hands. Skills give it operating procedures.

## Scoped MCP Loading

Bright Data's MCP server is a useful public example of scoped MCP loading.

Supported patterns:

- `GROUPS`: enable curated bundles such as `ecommerce`, `social`, `browser`, `finance`, `research`, `code`.
- `TOOLS`: add explicit individual tool names.
- `PRO_MODE=true`: enable all tools.
- Mode priority: all tools via Pro mode, then group/tool whitelist, then default rapid/base tools.

Why it matters:

- In development, discovery may require a broad toolset.
- In production, narrow the surface area to only the tools required for the job.
- This reduces context, improves selection, and reduces permission risk.

Video wording:

> Tool Search is dynamic. Scoped loading is intentional. In production, intentional usually wins.

## Output Optimization

Even if input/tool schema loading is solved, output volume still matters.

Common waste:

- full markdown pages when the agent only needs three fields;
- full HTML instead of extracted text;
- large JSON arrays with repeated field names;
- search results with ads, related searches, and boilerplate;
- verbose logs.

Recommended output tactics:

- return summaries or selected fields;
- strip formatting;
- paginate aggressively;
- return file references for large artifacts;
- process raw data in code and return only final findings;
- use compact encodings for uniform tabular data.

## TOON

TOON, Token-Oriented Object Notation, is a compact structured-data format designed for LLM prompts. Public docs claim 30-60% savings compared with JSON.

Best fit:

- flat uniform arrays;
- tables;
- search results;
- product lists;
- rows from a database;
- event logs with repeated fields.

Weak fit:

- deeply nested objects;
- heterogeneous records;
- data where model familiarity with JSON matters more than savings;
- cases where TOON instructions/examples would cost more than the saved tokens.

Video stance:

> TOON is not magic. It is a good compression trick for repeated structured rows.

## JARVIS Architecture Angle

JARVIS already reflects much of the recommended token stack:

- **Progressive disclosure:** local docs say JARVIS loads only relevant context instead of all context.
- **Skills:** reusable domain workflows live under `skills/`.
- **CLI tools:** deterministic local operations like `jarvis-price` stay outside model context.
- **Wiki/RAG:** long-term knowledge lives in searchable files/databases, not the base prompt.
- **MCP:** planned/used for live external systems and broader integrations.
- **Subprocess/subagent pattern:** isolates work so the main conversation does not carry every intermediate step.

Local evidence:

- `CLAUDE.md` says JARVIS uses progressive disclosure and MCP lazy loading.
- `README.md` documents 55-80% context reduction in practice and examples of loading 1,500 tokens instead of 8,000.
- `research/karpathy-llm-wiki/PRACTICAL-INSIGHTS.md` estimates 80-97% reductions for wiki/hot-cache patterns.
- `ecosystem/orchestrator/README.md` describes replacing full `SKILL.md` loading with routing/minimal context.

This gives the video a personal proof angle:

> I did not wait for the MCP ecosystem to solve context bloat. JARVIS was already built around progressive disclosure. The new MCP stack validates that design.

## Proposed Video Positioning

### Best Title

**MCP Token Costs Changed. Here's What Still Matters.**

### More Aggressive Titles

- MCP Fixed Its Token Problem. So Do Skills Still Matter?
- The New MCP Token Stack: How Agents Cut Context Costs by 98%
- Stop Turning Everything Into an MCP Server
- Tool Search, Skills, and Code Execution: The New Agent Token Stack

### Recommended Hook

"MCP servers used to chew through your context window before you sent a single message. Now Claude Code says MCP tools lazy-load by default. So is the problem solved? Not exactly. The schema problem got better. The architecture problem is still very real."

## Suggested 10-15 Minute Structure

### 1. Cold Open: The Old MCP Problem

Show a context meter filling before the user prompt. Explain the old pattern: every tool schema, every description, every parameter loaded upfront.

Visual assets:

- MCP config screenshot.
- Animated token meter.
- Tool schema blocks flooding the screen.

### 2. What Changed: Claude Code Tool Search

Explain deferred schemas and on-demand discovery.

Visual assets:

- Official docs screenshot.
- Zoom on `ENABLE_TOOL_SEARCH`.
- Before/after architecture.

### 3. The Caveats

Show when lazy loading is not guaranteed.

Visual assets:

- Checklist: Vertex, proxy, unsupported model, `alwaysLoad`, disabled Tool Search, threshold mode.
- Red/yellow/green environment matrix.

### 4. What Tool Search Does Not Fix

Focus on outputs and intermediate results.

Visual assets:

- Giant JSON result entering the context window.
- Tool output log accumulating over turns.

### 5. The 98.7% Pattern: Code Execution With MCP

Explain the Google Drive to Salesforce pattern from Anthropic.

Visual assets:

- File tree of tool wrappers.
- Code snippet calling two tools.
- Token counter: 150k down to 2k.

### 6. Programmatic Tool Calling

Explain code calling tools and returning only final results.

Visual assets:

- Python/code execution sandbox.
- Loop over 20 lookups, final filtered result only.

### 7. Skills Still Matter

Position Skills as procedural knowledge.

Visual assets:

- Real JARVIS skill folder.
- `SKILL.md` frontmatter.
- Progressive disclosure diagram.

### 8. Scoped MCP Loading

Explain groups and allowlists.

Visual assets:

- Bright Data `GROUPS=code` and `TOOLS=...` examples.
- Production agent with four allowed tools instead of 60.

### 9. Output Compression

Explain filtering, plain text, pagination, and TOON.

Visual assets:

- JSON vs TOON side-by-side.
- Token savings counter.

### 10. JARVIS Final Architecture

Decision matrix:

```text
Live external system      -> MCP
Reusable know-how         -> Skill
Deterministic local work  -> CLI/script
Multi-step data workflow  -> Code execution
Long-term memory          -> Wiki/RAG
Large structured output   -> Filter/TOON
```

Closing line:

"The goal is not fewer tools. The goal is putting each tool at the right layer."

## Production Visual Strategy

This video is ideal for the improved production approach:

- Use real docs as source evidence.
- Use local JARVIS files as proof.
- Use terminal commands and file-tree shots.
- Use animated token counters.
- Use cursor movement and highlights on exact text.
- Use avatar sparingly for thesis and transitions.
- Avoid generic circle diagrams except for the final architecture map.

Recommended visual mix:

- 15% full-screen avatar;
- 25% official docs/screenshots with highlights;
- 25% local JARVIS files/terminal;
- 20% animated token counters and comparison layouts;
- 15% concise architecture diagrams.

## Research Gaps Before Final Script

Before scripting, verify:

1. Exact latest Claude Code Tool Search docs language and version caveats.
2. Whether Programmatic Tool Calling currently excludes MCP connector tools, or whether this has changed.
3. Bright Data's current number of groups/tools, since the transcript said 60 tools / 11 groups and docs may change.
4. Whether TOON has credible benchmark caveats worth mentioning beyond vendor docs.
5. Whether there is a practical way to run a local measurement demo in JARVIS showing:
   - direct full context;
   - Skill-only;
   - MCP Tool Search;
   - scoped tool loading;
   - code execution / CLI filtering.

## Source List

Primary/official:

- Anthropic Engineering: Code execution with MCP: Building more efficient agents  
  https://www.anthropic.com/engineering/code-execution-with-mcp
- Claude Code MCP docs: Tool Search, `ENABLE_TOOL_SEARCH`, `alwaysLoad`, output limits  
  https://code.claude.com/docs/en/mcp
- Claude Agent SDK MCP docs: MCP configuration and Tool Search summary  
  https://code.claude.com/docs/en/agent-sdk/mcp
- Claude Agent Loop docs: what consumes context; tool outputs accumulate  
  https://code.claude.com/docs/en/agent-sdk/agent-loop
- Claude Code Skills docs: Skills load on demand; user-only skill behavior  
  https://code.claude.com/docs/en/skills
- Claude Code Features Overview: Skills vs MCP context behavior  
  https://code.claude.com/docs/en/features-overview
- Anthropic Advanced Tool Use: Programmatic Tool Calling  
  https://www.anthropic.com/engineering/advanced-tool-use
- Claude API Programmatic Tool Calling docs  
  https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling
- Claude API Code Execution Tool docs  
  https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool

Vendor/community examples:

- Bright Data MCP overview: scoped groups and individual tools  
  https://docs.brightdata.com/ai/mcp-server/overview
- Bright Data MCP tools docs: groups and modes  
  https://docs.brightdata.com/ai/mcp-server/tools
- Bright Data MCP GitHub README: `GROUPS`, `TOOLS`, mode priority  
  https://github.com/brightdata/brightdata-mcp
- TOON docs: token-oriented object notation and 30-60% claim  
  https://www.toontools.app/docs
- TOON official spec  
  https://github.com/toon-format/spec

Local JARVIS evidence:

- `CLAUDE.md`
- `README.md`
- `research/karpathy-llm-wiki/PRACTICAL-INSIGHTS.md`
- `ecosystem/orchestrator/README.md`
- `ecosystem/orchestrator/jarvis_brain.py`
- `skills/wiki-query/SKILL.md`

## Bottom Line For Scripting

Make the video a current investigation, not a rant:

> The old MCP token problem is partly solved. The new challenge is choosing the right layer for every kind of knowledge, tool, and data flow.

This is timely, defensible, and visually strong.
