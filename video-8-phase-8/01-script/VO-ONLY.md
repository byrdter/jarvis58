# Video 8 — Voiceover Only

**Source of truth:** `01-script/SCRIPT-AND-PLAN.md`
**Purpose:** clean, ambiguity-free VO for HeyGen recording. One segment per block. No titles, no composition labels, no imagery descriptions, no stage directions.

**Recording rules:**
- Record one segment at a time, in order
- **Exactly 1 second of silence between every segment** — this is what the pipeline uses to recover boundaries automatically. Without it, segmentation fails.
- Voiceover is continuous within a segment — no fades, no cuts inside the spoken block

---

## Segment 001

Last month we shipped a self-healing wiki. It catches stale pages, broken links, missing topics, and writes the fixes itself. We review and approve. That was Phase 7. But there were three things Phase 7 couldn't do. Two pages contradicting each other. A concept stuck in one wiki when it belonged in another. And us reviewing every tiny fix the system already knew was right. Phase 8 fixed all three. Hi, I am an avatar for Dr. Terry Byrd. I will be leading you through this video where we show you how to make your second brain more self-sustaining.

---

## Segment 002

Quick recap. Phase 7 watches our wikis. When a page goes stale, when a link breaks, when somebody searches for something the wiki doesn't have — Phase 7 notices. Then it spawns a Claude subprocess that drafts the fix. The draft lands in a queue. We review it. We approve it. The wiki updates. That loop has been running for weeks. It works.

---

## Segment 003

Phase 7 caught problems within a single page. But it never compared pages to each other. It never noticed when one wiki learned something the other wiki should know about. And it asked us to approve everything — even the typo fixes that nobody could disagree with. Three blind spots. Three things to build.

---

## Segment 004

Here's a real one. The investments wiki said position sizing should never exceed twenty-five percent of the portfolio. The methodology wiki, written six weeks later, said never exceed twenty percent. Both pages were technically right at the time they were written. Neither knew about the other. Phase 7's detector reads pages one at a time. It's structurally incapable of catching that. We needed something that reads pairs.

---

## Segment 005

Same with concepts. The AI filmmaking wiki had a whole section on constraint-driven creativity — how limits force better choices. The investments wiki was teaching the same idea, in completely different language, about position sizing. Same lesson. Different worlds. Nobody linked them. The cross-wiki bridge that would have made that connection didn't exist. Until now.

---

## Segment 006

And the queue. Every typo. Every missing link. Every tiny additive change. Sitting there waiting for us to click approve. Phase 7 was risk-averse by design — every change went through me. That was the right call for week one. By month one, it was just noise. We needed the system to handle the obvious stuff itself.

---

## Segment 007

So Phase 8 added three things. One: contradiction detection — the system reads page pairs and flags real disagreements. Two: cross-wiki bridges — when a concept in one wiki becomes relevant to another, the system proposes the link. Three: an auto-apply tier — low-risk changes apply themselves. We only see the ones that need judgment.

---

## Segment 008

Contradiction detection is the simplest of the three to explain and the hardest to build. Simple to explain: if two pages say opposite things about the same fact, flag it. Hard to build because real contradictions are rarely word-for-word. They're paraphrased. They use different units. They contradict implicitly. String matching catches none of that. So we use an LLM to do the comparison.

---

## Segment 009

Here's the mechanic. The detector picks page pairs — by topic, by tag, by recent edit. It spawns a Claude subprocess, hands it both pages, and asks one question: do these contradict each other on any factual claim? If yes, what's the conflict, where is it, and which one looks more recently authored? The answer comes back as a structured proposal. Lands in the improvements queue.

---

## Segment 010

Let's watch one run. We are calling the detector against the investments wiki. It picks five page pairs based on tag overlap. It spawns the subprocess. Forty seconds later — there's the result. Two contradictions found. The position-sizing one we talked about, and another one about whether stop-loss percentages should be calculated from entry or from twenty-day low. Both real. Both worth fixing. Proposal lands in queue.

---

## Segment 011

Cross-wiki bridges are the second piece. The premise: knowledge gets siloed in whichever wiki you happened to be working in when you learned it. But concepts overlap. A pattern from AI filmmaking applies to investments. An idea from operations applies to claude code. The bridge detector watches for those overlaps and proposes links.

---

## Segment 012

Here's one the system caught. The AI filmmaking wiki had a page on the constraint loop — how limits force creativity. The investments wiki was teaching position sizing as constraint-driven decision-making. Same underlying idea, different vocabulary. The bridge detector noticed the conceptual overlap, drafted a proposal: add a cross-wiki link, here's the suggested anchor text, here's the rationale. We approved it. Took five seconds.

---

## Segment 013

Zoom out. This is the wiki graph before Phase 8 — four wikis, links only within each wiki. And here it is after a few weeks of Phase 8 running. Bridges everywhere. Most of them we didn't write. The system noticed connections we never would have, because we were only ever working in one wiki at a time.

---

## Segment 014

Third addition: the auto-apply tier. Phase 7's queue got too noisy because every proposal needed a human click. But not every proposal is a judgment call. Adding a missing link to an existing page? That's not a judgment call. Fixing a typo? Not a judgment call. Restructuring an entire knowledge domain? Definitely a judgment call. Phase 8 sorts proposals by risk and lets the boring ones apply themselves.

---

## Segment 015

Here's the actual tier definitions. Low-risk: typo fixes, missing-link additions, format corrections, broken-link replacements when the target obviously exists. These auto-apply. Medium-risk: cross-wiki bridges, additive content where the source is already approved. These auto-apply but we get notified. High-risk: contradiction resolutions, content removal, structural changes, anything touching the methodology pages. These wait for us. The split is roughly seventy percent auto, thirty percent human.

---

## Segment 016

Watch the auto-apply runner. It runs every day at noon, after the detector and the drafter have had time to scan and write proposals. For each new proposal, it checks the risk tier. Low-risk ones get applied — git commit, file updated, queue entry marked done. The whole batch finishes in under a minute. Yesterday's run applied seven proposals automatically. We never had to look at any of them.

---

## Segment 017

Here's what makes this work. The three additions aren't three separate things — they're one loop. The detector finds problems and overlaps. The drafter writes the fixes. The auto-apply tier ships the obvious ones. Then the cycle starts again. Every day. Without us. The wiki gets sharper while we relax.

---

## Segment 018

Here's the architecture. All three pieces live in the agent-sdk repo, under improvements. Contradiction-detector dot ts. Cross-wiki-bridge dot ts. Auto-apply dot ts. They get registered with the existing detectors module and the server-command-center. The auto-apply runner is wired into the scheduler as the daily-auto-apply job. Total new code: about thirty kilobytes. It plugs into Phase 7's existing pipeline without touching the parts that already worked.

---

## Segment 019

And here's the daily schedule. At eight AM, the daily reflection runs. Mid-morning, the detector scans the wikis. Through the day, the drafter writes proposals against the queue. At noon, auto-apply takes over and ships everything safe. Evening — we review whatever needs my eye. The whole cycle is on autopilot. I just open the queue once a day.

---

## Segment 020

Cost. The whole system runs on a Bun server with the OAuth token. Every Claude call is a subprocess of my existing logged-in session. Zero API charges. The AssemblyAI captions are eight cents per video. That's it. A second brain that improves itself for the price of dinner once a month.

---

## Segment 021

And here's what it's actually doing. This is our live improvements queue, right now, as we are recording. Eleven proposals applied automatically in the last seven days — those green ones. Four queued waiting for my review — those yellow and red ones. Two contradictions caught this week, three cross-wiki bridges proposed. The system is running while we are making this video. It will probably catch something between now and when we publish.

> Recording note: replace placeholder counts (11 / 4 / 2 / 3) with actual queue numbers at recording time.

---

## Segment 022

Three real examples from this week. Auto-applied: a missing link from the position-sizing page to the methodology page — system noticed we had referenced methodology three times without ever linking it. Auto-applied: a typo on the AI filmmaking page that misspelled cinematography. And a cross-wiki bridge from the operations wiki to the claude code wiki around context window management. None of these needed me. All three are live.

> Recording note: pull three actual recent auto-applied proposals from the queue at recording time and substitute.

---

## Segment 023

Here's what excites us about this. Phase 7 made the wiki self-healing. Phase 8 made it self-sharpening. Every fix the system applies makes the next scan slightly more accurate, because there's less noise to filter through. The wiki gets cleaner, which means the contradictions and bridges that surface are higher-signal, which means I trust the auto-apply more. It compounds.

---

## Segment 024

Stepping back. Phase 8 is the eighth piece of a larger system. Phase 1 was the investment domain. Phase 2 added vector search. Phase 3 made it autonomous. Phase 7 made it self-healing. Phase 8 made it sharper. There's a Phase 9 and a Phase 10 already coming. The map keeps expanding.

---

## Segment 025

Phase 9 is next. JARVIS already absorbs knowledge from a few different feeds — research documents, docs crawls, and YouTube transcripts. But only one YouTube channel is in the loop right now: Chris Vermeulen for markets. Phase 9 adds a second one. New creator, new domain. The pipeline is already built — pull, transcribe, summarize, route to the right wiki. We'll talk about the channel choice in the next video.

---

## Segment 026

Phase 10 is more ambitious. We already have Telegram connected to JARVIS — but only for a fixed set of commands, mostly investment queries. To run anything else we still have to be at the desk. Phase 10 turns the Telegram bot into a full remote shell. The full set of commands we run locally, from the phone, anywhere. Build a video. Query the wiki queue. Trigger a market scan. The terminal goes mobile.

---

## Segment 027

What's the through-line. We are building a second brain that doesn't need us to maintain it. It captures, it organizes, it heals, it sharpens, and soon it'll listen to YouTube and respond from our phones. Every phase removes one more thing I had to do manually. The goal isn't more features. The goal is less work.

---

## Segment 028

If this is the kind of architecture-level AI work you want more of — subscribe and hit the bell. Comment below with the next system you'd want us to dig into. Agent commerce. Alignment. Regulation. Whatever you're building yourself. We read all of them. And share with one friend who's been quietly building their own stack — the bigger this channel grows, the deeper we go on each phase.

---

## Segment 029

Phase 8 shipped. JARVIS now catches its own contradictions, builds its own bridges, and quietly fixes the obvious things while we relax. Every phase removes one more thing we used to do manually. The system is closer to being its own caretaker every week. We'll see you in the next deep dive.
