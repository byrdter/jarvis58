# Video 11 — VO Master

30 segments. ~12:30 spoken + ~45 s of break-tag pause padding = ~13:15 total.
Source: `../01-script/VIDEO-11-SCRIPT-V2.md`

Each `segment-NNN.txt` contains just the VO with SSML `<break>` tags. Paste
one file per HeyGen segment. Keep the breaks — they become scene boundaries
the pipeline trusts (see segment 12).

---

## Act 1 — Hook + Stakes

### Segment 001 — Hook (25 s) — face-fullscreen
I made this video in under an hour. <break time="1.5s"/> The avatar, the graphics, the transitions, the captions. All of it. <break time="1s"/> The avatar takes twenty manual minutes. The rest is automated. <break time="1.5s"/>

### Segment 002 — Three Paths Tease (22 s) — face-fullscreen
I'm going to show you three ways to get there. <break time="1s"/> One costs money. <break time="1s"/> One costs almost nothing. <break time="1s"/> One is the pragmatic middle. <break time="1.5s"/>

### Segment 003 — The Problem (28 s) — face-corner
A single ten-minute educational video used to take me a full day. <break time="1s"/> Record on camera. Edit. Find B-roll. Build title cards. Render. Re-render when something breaks. <break time="1.5s"/> That doesn't scale. If you want to ship one video a week, you need a pipeline, not a manual workflow. <break time="1.5s"/>

## Act 2 — Pipeline Map

### Segment 004 — The Stack (28 s) — face-corner
So I built one. Here's the stack. <break time="1s"/> HeyGen for the talking-head avatar. <break time="1s"/> Remotion for everything else — graphics, transitions, captions, the final render. <break time="1s"/> HyperFrames for HTML-based graphics. <break time="1s"/> Claude Code and Codex as the director, orchestrating the whole thing. <break time="1.5s"/>

### Segment 005 — Optional Connectors (24 s) — face-corner
Optional add-ons. <break time="1s"/> Higgsfield for AI B-roll. <break time="1s"/> Nano Banana Pro for image generation. <break time="1s"/> ElevenLabs if you don't want an avatar. <break time="1s"/> MCP servers for anything else. <break time="1.5s"/>

### Segment 006 — Where The Choice Lives (22 s) — face-corner
The avatar work is where the choice lives. <break time="1s"/> You can fully automate it with the HeyGen API. <break time="1s"/> You can drive the HeyGen browser app with Claude Code. <break time="1s"/> Or you can do twenty minutes of manual work and let the pipeline handle the rest. <break time="1.5s"/>

## Act 3 — Three Paths

### Segment 007 — Path A: How It Works (28 s) — face-corner
Path A. Full API automation. <break time="1s"/> HeyGen exposes a REST API. You send it a script, a voice ID, and an avatar ID. It returns a finished avatar video. <break time="1s"/> Claude Code writes the script, splits it into segments, calls the API per segment, polls for completion, downloads the clips. <break time="1.5s"/>

### Segment 008 — Path A: Cost & Best For (30 s) — face-corner
Zero human touch on the avatar side. <break time="1s"/> The trade-off is cost. <break time="1s"/> HeyGen API is pay-as-you-go. No monthly minimum. <break time="1s"/> One dollar a minute for Avatar Three at 1080p. Four dollars a minute for Avatar Four. Up to five dollars a minute for the 4K Digital Twin. <break time="1s"/> Best for high volume, repeatable formats, no patience for clicking. <break time="1.5s"/>

### Segment 009 — Path B: How It Works (26 s) — face-corner
Path B. Browser automation. <break time="1s"/> Claude Code has a Chrome connector. Codex can run in the browser too. <break time="1s"/> Both can drive the HeyGen web app the same way you would. Log in, paste each segment into the editor, click generate, wait, download. <break time="1.5s"/>

### Segment 010 — Path B: Cost & Tradeoffs (28 s) — face-corner
You only pay for your existing HeyGen subscription. No API fees. Same avatar, same voice, same output. <break time="1s"/> The trade-off is reliability. Browsers break. UIs change. <break time="1s"/> Build retry logic. <break time="1s"/> Best for solo creators on a budget who still want automation. <break time="1.5s"/>

### Segment 011 — Path C: How It Works (28 s) — face-corner
Path C. The pragmatic middle. <break time="1s"/> You spend twenty minutes in HeyGen. Pick your avatar, paste your script, hit generate, download the file. <break time="1.5s"/>

### Segment 012 — Path C: Why Manual + Pause Protocol (30 s) — face-corner
Why twenty manual minutes? <break time="1s"/> Because you catch problems before the pipeline blindly composes around them. <break time="1s"/> And if you used the pause protocol in your script — one-second pauses between scenes — HeyGen renders those gaps to the millisecond. <break time="1s"/> That precision is what makes the downstream automation possible. <break time="1.5s"/>

### Segment 013 — Path C: Handoff & Best For (22 s) — face-corner
Then you drop the avatar video into the pipeline folder. <break time="1s"/> That's the handoff. Everything else is automated from there. <break time="1s"/> Best for ninety percent of creators. <break time="1.5s"/>

### Segment 014 — Three Paths Converge (20 s) — face-corner
So whichever path you pick, you end up at the same place. <break time="1s"/> A folder full of HeyGen MP4 clips. <break time="1.5s"/> Now Remotion takes the ball. <break time="1.5s"/>

## Act 4 — Remotion Takes The Ball

### Segment 015 — Pipeline 5 Stages Overview (12 s) — face-corner
The pipeline runs in five stages. <break time="1.5s"/>

### Segment 016 — Stage 1: Transcribe (28 s) — face-corner
Stage one. Transcribe. <break time="1s"/> AssemblyAI extracts word-level timestamps from the avatar audio. Every word. Every pause. Every gap. <break time="1s"/> The pipeline scans for gaps longer than one second. Each gap becomes a hard scene boundary. <break time="1.5s"/>

### Segment 017 — Stage 2: Plan (26 s) — face-corner
Stage two. Plan. <break time="1s"/> Claude reads the script and the transcript and decides what visual goes with each scene. <break time="1s"/> Title cards for transitions. Charts for data. Code blocks for technical bits. B-roll for emotional beats. <break time="1.5s"/>

### Segment 018 — Stage 3: Generate Visuals (30 s) — face-corner
Stage three. Generate the visuals. <break time="1s"/> Static images from Nano Banana Pro, DALL-E, or Midjourney — whatever you've wired up. <break time="1s"/> Animated graphics from HyperFrames — title sequences, charts, captions, audio-reactive overlays. <break time="1s"/> Cinematic B-roll from Higgsfield via MCP. <break time="1.5s"/>

### Segment 019 — Stage 4: Remotion Is React (30 s) — face-corner
Stage four. Compose. <break time="1s"/> Remotion is React for video. <break time="1s"/> Every scene is a component. The avatar clip, the overlay graphic, the captions, the background — all just JSX. <break time="1s"/> Every frame is deterministic. Frame three hundred always looks the same. No render lottery. <break time="1.5s"/>

### Segment 020 — Stage 4: Transitions & Captions (28 s) — face-corner
Transitions are code, not clicks. <break time="1s"/> Crossfades, wipes, shader effects — all defined in TypeScript, all reusable across videos. <break time="1s"/> Captions come from the same word-level transcript. Synced to the millisecond. Style them however you want. <break time="1.5s"/>

### Segment 021 — Stage 5: Render (26 s) — face-corner
Stage five. Render. <break time="1s"/> One command. <break time="1s"/> Remotion renders every frame in parallel using a headless Chrome cluster. <break time="1s"/> Ten-minute video, ten minutes to render. <break time="1.5s"/>

### Segment 022 — Stage 5: QA Loop (24 s) — face-corner
Then a QA loop. <break time="1s"/> A Claude subagent watches the output, checks for motion defects, transition glitches, audio drift. <break time="1s"/> If it passes, you have a finished video. If it doesn't, the pipeline reports what to fix. <break time="1.5s"/>

## Act 5 — Decision Framework

### Segment 023 — Bridge to Decision (10 s) — face-corner
So which path should you actually pick? <break time="1.5s"/>

### Segment 024 — Decision: Volume (Path A) (22 s) — face-corner
Are you shipping more than ten videos a month? <break time="1s"/> Path A. <break time="1s"/> The API cost pays for itself in time saved. <break time="1.5s"/>

### Segment 025 — Decision: Budget (Path B) (24 s) — face-corner
Are you bootstrapping and every dollar counts? <break time="1s"/> Path B. <break time="1s"/> Browser automation gets you ninety percent of the value at zero marginal cost. <break time="1.5s"/>

### Segment 026 — Decision: Control + My Choice (30 s) — face-corner
Are you a solo creator who wants control over the avatar but hates everything that comes after? <break time="1s"/> Path C. The pragmatic middle. <break time="1s"/> I use Path C for ninety percent of my videos. <break time="1s"/> Twenty minutes manual. Forty minutes automated. One hour total. <break time="1.5s"/>

### Segment 027 — Why Path C Works (22 s) — face-corner
Why? <break time="1s"/> Because the avatar is the part viewers actually judge. <break time="1s"/> Everything else is just packaging. <break time="1.5s"/>

### Segment 028 — Framework Recap (20 s) — face-corner
Match the path to the bottleneck. <break time="1s"/> Don't automate what doesn't need it. Don't over-pay for what you can drive yourself. <break time="1.5s"/>

## Act 6 — Outro

### Segment 029 — Takeaways 1 & 2 (28 s) — face-fullscreen
Two things to take away. <break time="1s"/> One. HeyGen makes the avatar. Remotion makes everything else. The handoff is just a folder of MP4 files. <break time="1s"/> Two. Pick the path that matches your volume and your budget. Not the one that sounds the most impressive. <break time="1.5s"/>

### Segment 030 — Takeaway 3 + Send-Off (26 s) — face-fullscreen
And the third one. <break time="1s"/> The pause protocol is the secret weapon. Your one-second pauses become scene boundaries the pipeline can trust. <break time="1.5s"/> That's the pipeline. <break time="1s"/> Pick your path, build it once, ship videos every week. <break time="2s"/>
