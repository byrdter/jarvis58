# MCP Token Stack Research Addendum: Verified Script Notes

Date: 2026-05-14

This addendum updates `MCP-TOKEN-STACK-RESEARCH-BRIEF.md` with the strongest current numbers and caveats for Video 12.

## 1. Cloudflare Code Mode

Source: https://blog.cloudflare.com/code-mode-mcp/

Verified points:

- Cloudflare published "Code Mode: give agents an entire API in 1,000 tokens" on 2026-02-20.
- Their MCP server exposes the Cloudflare API through two tools: `search()` and `execute()`.
- Cloudflare states the server gives access to the entire Cloudflare API while consuming around 1,000 tokens.
- Cloudflare states an equivalent MCP server without Code Mode would consume 1.17 million tokens.
- Cloudflare states the reduction is 99.9%.
- Security model: generated code runs inside a Dynamic Worker isolate with no file system, no environment variables, and external fetch disabled by default.

Script implication:

Use Cloudflare as the dramatic proof that MCP itself is evolving. Do not frame this as anti-MCP. Frame it as "MCP plus code execution is the new direction."

## 2. Anthropic Tool Search

Source: https://www.anthropic.com/engineering/advanced-tool-use

Verified points:

- Anthropic's five-server example totals 58 tools and roughly 55K tokens before work starts.
- Anthropic says it has seen tool definitions consume 134K tokens before optimization.
- Tool Search loads only the search tool upfront, then expands matching tools on demand.
- Anthropic reports total context consumption falling to about 8.7K tokens in its example, preserving 95% of the context window.
- Anthropic reports an 85% token reduction while maintaining access to the full library.
- Anthropic reports MCP eval accuracy improvements:
  - Opus 4: 49% to 74%.
  - Opus 4.5: 79.5% to 88.1%.

Script implication:

Say "the upfront schema problem is partly solved," not "MCP is still always 90K tokens upfront." The caveat is that search quality, output size, and multi-step workflows still matter.

## 3. Code Execution With MCP

Source: https://www.anthropic.com/engineering/code-execution-with-mcp

Verified points:

- Anthropic's example task is downloading a meeting transcript from Google Drive and attaching it to a Salesforce lead.
- In the direct-tool path, the transcript passes through the model context twice.
- Anthropic estimates a two-hour sales meeting transcript can add 50,000 intermediate-result tokens.
- Presenting MCP tools as code APIs lets the agent load only the needed tool files and process intermediate data in the execution environment.
- Anthropic reports the Google Drive to Salesforce example reducing token usage from 150,000 to 2,000, a 98.7% reduction.

Script implication:

This is the clearest animation in the video: transcript flows through the context window twice in the naive path; then stays inside a sandbox variable in the code-execution path.

## 4. Programmatic Tool Calling Limitation

Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling

Verified points:

- Anthropic's docs say tools provided by an MCP connector cannot be called programmatically.
- Other limitations include strict structured outputs, forced tool choice, and disabled parallel tool use.
- Anthropic states tool results from programmatic calls are not added to Claude's context; only the final code output is.
- Anthropic warns that tool results are strings and may contain executable-looking content, so external tool results must be validated before interpretation.

Script implication:

This explains why "programmatic tool calling" and "code execution with MCP" are not the same path. MCP connector tools are excluded from programmatic calling, so MCP-heavy workflows need the code-execution wrapper pattern or server-side Code Mode.

## 5. Independent Tool Search Stress Test

Source: https://www.arcade.dev/blog/anthropic-tool-search-4000-tools-test/

Verified points:

- Arcade loaded 4,027 tools and ran 25 straightforward tasks.
- Regex search retrieved the right tool in 56% of cases.
- BM25 search retrieved the right tool in 64% of cases.
- Arcade tested retrieval only, not final tool selection or parameter filling.

Script implication:

Do not claim a universal "30-50 tool threshold." Use the better wording:

> Tool Search saves tokens, but search quality is now part of your reliability model.

## 6. CLI vs MCP Benchmark

Source: https://www.scalekit.com/blog/mcp-vs-cli-use

Verified points:

- Scalekit compared CLI, CLI plus Skills, and MCP on GitHub tasks with the same model and prompts.
- For "repo language and license," CLI used 1,365 tokens and MCP used 44,026 tokens.
- Scalekit reports MCP costing 4-32x more tokens across tasks.
- Scalekit reports 7 failures out of 25 MCP runs, a 28% failure rate, due to TCP connect timeouts to GitHub's Copilot MCP server.
- At 10,000 monthly operations, Scalekit estimates CLI at about $3.20/month, MCP direct at about $55.20/month, and MCP through a schema-filtering gateway at about $5/month.
- Scalekit also argues CLI is not the right answer for every production agent because customer-scoped authorization and auditability change the architecture.

Script implication:

This is the strongest independent benchmark for the "CLI still matters" section, but use it honestly: CLI wins for local deterministic work; MCP still matters when an agent acts for many users with scoped permissions.

## 7. Scoped MCP Loading

Sources:

- https://docs.brightdata.com/ai/mcp-server/tools
- https://github.com/brightdata/brightdata-mcp

Verified points:

- Bright Data documents Rapid mode, Pro mode, and 11 tool groups.
- Groups include e-commerce, social media, browser automation, business intelligence, finance, research, app stores, travel, advanced scraping, GEO / LLM visibility, and code.
- Bright Data supports `GROUPS=<group_name>` for local MCP and `&groups=<group_name>` for remote MCP.
- Bright Data also supports `TOOLS` for explicit tool allowlists.

Script implication:

Use Bright Data as the concrete example of scoped MCP. Avoid using an exact "87 tools" number unless re-counted from a current release at render time.

## 8. TOON Caveats

Sources:

- https://arxiv.org/abs/2603.03306
- https://adam.holter.com/toon-vs-json-for-llms-token-efficiency-retrieval-accuracy-and-where-it-actually-helps/

Verified points:

- Matveev's arXiv benchmark finds TOON promising for token efficiency, but its advantage can shrink because of prompt overhead in shorter contexts.
- The same benchmark finds plain JSON has the best one-shot and final accuracy in tested generation settings.
- The paper suggests TOON's strongest advantage appears only when syntax savings amortize the instructional overhead.
- Practitioner critiques emphasize that TOON is best for flat, repetitive, tabular data and weaker for nested, graph-shaped, or very wide structures.

Script implication:

Do not present TOON as magic. Present it as an output-layer optimization for the right data shape.

## Updated Bottom Line

The video should make this argument:

1. Old MCP criticism was real.
2. New MCP features solve part of it.
3. The remaining issue is not one tool definition trick; it is architecture.
4. The practical 2026 stack is:
   - Tool Search for discovery.
   - Scoped MCP for production surfaces.
   - Skills for procedural knowledge.
   - CLI/scripts for deterministic local work.
   - Code execution for multi-step data workflows.
   - Output filtering and TOON-like compression where the payload shape supports it.
5. JARVIS becomes the demo because it already uses skills, local files, scripts, and staged automation.

