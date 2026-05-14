# Video 12 Script: MCP Token Costs Changed. Here's What Still Matters.

Target runtime: 11-13 minutes.

Avatar blocks:

- Segment 1: Avatar V full-screen.
- Segment 6: Avatar V side-screen.
- Segment 13: Avatar V side-screen.
- Segment 22: Avatar V side-screen.
- Segments 31-32: Avatar V full-screen.

All other segments: hidden avatar / voice-only in HeyGen, filled by Remotion/HyperFrames.

## Segment 1 — Full-Screen Avatar — Cold Open

I am the avatar for Dr. Terry Byrd, and we are looking at a problem every serious agent builder has to understand. MCP used to have a brutal problem. You could burn tens of thousands of tokens before you asked the agent to do anything. But in 2026, that story changed. Tool Search, scoped loading, and Code Mode are real improvements. So the question is no longer, "Is MCP bad?" The better question is, "Which layer should do which job?"

## Segment 2 — Source Proof: Old Context Flood

Here is the old failure mode. You connect GitHub, Slack, Sentry, Grafana, Splunk, maybe Jira. Before the user types a task, the model is already carrying tool definitions. That is not work. That is overhead. And overhead is not just money. It is latency, confusion, and less room for the actual problem.

## Segment 3 — Source Proof: Tool Search Changed the Baseline

Anthropic's Tool Search changed the baseline. Instead of loading every tool definition upfront, Claude starts with a small search tool and expands only the tools it needs. In Anthropic's own example, the setup moves from roughly seventy-seven thousand tokens of context consumption to about eight point seven thousand. That is a serious improvement.

## Segment 4 — Fast Reset: The Trap

But this is where the easy take gets dangerous. If you say, "MCP is fixed now," you miss the next problem. Search reduces schema load. It does not make every tool result small. It does not make every multi-step workflow efficient. And it does not make tool retrieval perfectly reliable.

## Segment 5 — Accuracy Evidence

The accuracy numbers are better, but not magical. Anthropic reported MCP eval improvements from forty-nine percent to seventy-four percent on Opus 4, and from seventy-nine point five to eighty-eight point one percent on Opus 4.5. Then Arcade stress-tested more than four thousand tools and saw retrieval around sixty percent. That is the trade: better context economics, but now search quality is part of your reliability model.

## Segment 6 — Side Avatar — Thesis

So here is our position. MCP is not dead. Skills are not a replacement for MCP. And CLI scripts are not the universal answer. These are layers. MCP connects agents to external systems. Skills teach the agent procedures. CLI scripts do deterministic local work. Code execution compresses multi-step workflows. The mistake is forcing one layer to do all four jobs.

## Segment 7 — Cloudflare Code Mode Hook

Cloudflare showed the sharpest version of this idea. They took the entire Cloudflare API and exposed it through two tools: search and execute. Instead of loading thousands of endpoint schemas, the agent writes code against a typed API and runs that code in a sandbox. Their claim is extreme: about one thousand input tokens instead of one point one seven million.

## Segment 8 — Cloudflare Visual Number Drop

That number matters because it changes the mental model. The agent does not need every API endpoint poured into its context window. It needs a way to discover what exists, inspect what matters, execute the operation, and return the result. The context window should carry reasoning, not every possible instruction manual.

## Segment 9 — Anthropic Code Execution Example

Anthropic published the same pattern from another angle. Their example is simple: download a meeting transcript from Google Drive and attach it to a Salesforce lead. In the naive tool-call path, the transcript enters the model context when it is read, then enters again when the model passes it to Salesforce.

## Segment 10 — Data Movement Animation

That is the waste. The model is not thinking about the transcript twice. It is transporting the transcript twice. Anthropic estimates a two-hour sales meeting could add fifty thousand intermediate-result tokens. With code execution, the transcript stays inside the execution environment as a variable, and only the final status comes back to the model.

## Segment 11 — 150K to 2K

The result is the headline number: one hundred fifty thousand tokens down to two thousand. That is a ninety-eight point seven percent reduction. But the important part is not the percentage. The important part is where the data lives. If intermediate data never needs the model's judgment, it should not enter the model's context.

## Segment 12 — Programmatic Tool Calling Caveat

There is a catch. Anthropic's programmatic tool calling docs say MCP connector tools cannot be called programmatically. That means you cannot simply take every MCP connector and expect programmatic calling to solve it. For MCP-heavy workflows, you need the code-execution wrapper pattern, server-side Code Mode, or another layer that turns tools into callable code inside a controlled runtime.

## Segment 13 — Side Avatar — Security Warning

This is also where serious engineers should slow down. Code execution is powerful because the model can write code that touches real tools. That is also why it is dangerous. Cloudflare runs generated code in a V8 isolate with no file system, no environment variables, and external fetch disabled by default. If you cannot provide a real sandbox, you do not get a free token win. You get a new attack surface.

## Segment 14 — Scoped MCP

The lighter-weight fix is scoped MCP. Bright Data is a good example. Their MCP docs expose Rapid mode, Pro mode, and eleven tool groups. You can turn on a group like browser, finance, ecommerce, or code. You can also allowlist specific tools. That is not as dramatic as Code Mode, but for production agents it is often the first sane move.

## Segment 15 — Skills Section

Skills solve a different problem. A skill is not a live connector. It is procedural knowledge. It tells the agent how to do a job: what files matter, what commands to run, what patterns to follow, what mistakes to avoid. That kind of knowledge does not belong in a massive always-loaded context file.

## Segment 16 — JARVIS Skill Artifact

This is why JARVIS uses skills heavily. A video-production skill can say, "Here is how we structure HeyGen blocks. Here is where stills live. Here is how Remotion should treat avatar segments." The model only needs that instruction when it is doing video work. It should not carry it during a market scan or a wiki cleanup.

## Segment 17 — CLI and Scripts

Then there is the boring layer that keeps winning: CLI scripts. If a task is deterministic and local, a command-line tool is often cheaper and more reliable than an MCP server. Scalekit measured a simple GitHub repo question at one thousand three hundred sixty-five tokens with CLI, compared with forty-four thousand twenty-six tokens through MCP.

## Segment 18 — Honest MCP Defense

But the same benchmark makes the important counterpoint. CLI is great when the agent is acting as you, on your machine, with your credentials. If you are building a product where an agent acts for many customers inside many organizations, MCP gives you a permission and audit boundary that CLI does not automatically provide. So the right question is not CLI or MCP. It is: who is the agent acting for?

## Segment 19 — Output Filtering

The next layer is output filtering. Many tools return too much. A web scrape returns navigation, ads, related links, formatting, and metadata. A search result returns fields the agent never asked for. If the agent only needs title, URL, and price, return title, URL, and price. Every extra field competes with the user's actual task.

## Segment 20 — TOON and Compact Formats

Compact formats like TOON can help, but only in the right shape. TOON is strongest for flat, repetitive, tabular data where JSON repeats the same keys over and over. Independent benchmarks are more cautious than the hype. For small payloads, nested objects, or very wide rows, the instruction overhead and ambiguity can eat the savings.

## Segment 21 — Comparison Table

Put the stack on one screen. Direct MCP is simple but expensive when schemas and outputs are large. Tool Search reduces idle load. Scoped MCP narrows production surfaces. Skills carry procedure. CLI handles local deterministic work. Code execution keeps intermediate data out of context. Output filtering and compact notation reduce payloads after the call.

## Segment 22 — Side Avatar — Practical Rule

Here is the rule we use now. If the agent needs permissioned access to an external system, consider MCP. If it needs to know how we do something, use a skill. If it needs to run a local deterministic operation, use a CLI script. If it needs to move or transform a lot of data across steps, use code execution. Do not make one tool carry every job.

## Segment 23 — JARVIS Architecture Map

That is the pattern we want in JARVIS. The wiki is memory. Skills are operating procedures. Local scripts are reliable actions. MCP is for permissioned external services. Scheduled jobs create the heartbeat. The agent orchestrates the layers, but it does not need every layer fully loaded in context all the time.

## Segment 24 — Measurement Plan

The next step is measuring it. Pick one real task: look up the current MACD value for QQQ, compare it to last week, and write a one-paragraph report. Run it four ways: naive MCP, Tool Search, the current JARVIS stack with skills plus CLI, and a code-execution version. Capture tokens, latency, reliability, and context used.

## Segment 25 — Migration Phase 1

If you are fixing your own setup, start with the free wins. Check your MCP token load. Disconnect servers you do not use. Turn on Tool Search where your client supports it. Scope big MCP servers by group or explicit tool list. You can do that in an hour, and it immediately reduces noise.

## Segment 26 — Migration Phase 2

Then move procedural knowledge into skills. Stop stuffing every rule into the main context file. Move deterministic local work into scripts. Filter tool outputs at the source. If the agent only needs three fields, return three fields. Do not make the model carry a full object because the tool was easy to write.

## Segment 27 — Migration Phase 3

Only then reach for the heavy patterns. For multi-step workflows with large intermediate data, use programmatic tool calling where it fits. For MCP connector workflows that cannot be called programmatically, use Code Mode or code execution with MCP wrappers. If you do this, sandboxing is not optional. It is the product.

## Segment 28 — Mistakes to Avoid

There are three mistakes we would avoid. First, saying MCP is dead because CLI is cheaper on local tasks. Second, saying MCP is fixed because Tool Search exists. Third, treating compact formats like TOON as a universal compression spell. The winning stack is boring: right layer, right scope, measured output.

## Segment 29 — Evidence Beats Opinion

The reason this video matters is that the debate is moving from opinions to evidence. Cloudflare has the one-thousand-token API. Anthropic has Tool Search and code execution numbers. Arcade has a four-thousand-tool stress test. Scalekit has CLI versus MCP cost and failure data. JARVIS gives us a place to test the stack on real work.

## Segment 30 — Graphics CTA

Before the closing summary, take a second to subscribe, hit the like button, and ring the notification bell for the next video. This channel is building a practical library around agentic AI, automation, and real systems like JARVIS. The more feedback we get, the better these walkthroughs become.

## Segment 31 — Full-Screen Avatar — Recap

So the answer is not "skills beat MCP." The answer is that MCP is one layer in a larger agent architecture. Use Tool Search to avoid loading everything. Use scoped MCP to narrow production access. Use skills for procedures. Use CLI for local deterministic work. Use code execution when intermediate data should stay out of the model.

## Segment 32 — Full-Screen Avatar — Close

If you build agents, do not ask which integration is fashionable. Ask where the tokens go, where the data lives, and who the agent is acting for. That is the 2026 token stack. New videos every week.
