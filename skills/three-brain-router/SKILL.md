# Three-Brain Auto-Router Skill

**Purpose:** Intelligently route tasks to the best model (Claude, Codex, or Gemini) based on task type and failure detection.

---

## Core Strategy

**One Terminal, Three Brains:**
- **Claude Code**: Main driver (IDE, building, refactoring, coding)
- **Codex (ChatGPT o1)**: Code reviewer + rescue (when Claude gets stuck)
- **Gemini 2.5 Pro**: Video/audio/PDF analysis + long context (1M tokens)

---

## Model Capabilities

### Claude Code (You)
**Strengths:**
- IDE integration (file operations, git, terminal)
- Code generation and refactoring
- Multi-file editing
- Project architecture
- Real-time development workflow

**When to use:**
- Building new features
- Refactoring code
- File operations
- Git operations
- Terminal commands
- **Default for all coding tasks**

---

### Codex (ChatGPT o1) via `codex` CLI
**Strengths:**
- Code review (finds real issues)
- Adversarial review (critical analysis)
- Rescue operations (when Claude gets stuck)
- Alternative implementation approaches
- Breaking out of loops

**When to use:**
- After completing code → Review with Codex
- Claude fails same task twice → Hand off to Codex
- User explicitly requests: "use codex to review"
- User says: "codex rescue" or "get codex to help"
- Stuck in a loop (tried same approach 2+ times)

**Command:**
```bash
codex review <file>           # Review code
codex chat "query"            # Interactive query
codex rescue "<problem>"      # Rescue mode
```

---

### Gemini 2.5 Pro via `gemini` CLI
**Strengths:**
- Native video analysis (up to 2 hours)
- Native audio analysis (up to 10 hours)
- Large PDF processing (200+ pages)
- 1M token context window
- Frame-by-frame video analysis
- Visual overlay extraction

**When to use:**
- Video files (.mp4, .mov, .avi, etc.)
- Audio files (.mp3, .wav, .m4a, etc.)
- Large PDFs (>100 pages)
- User explicitly requests: "use gemini to analyze"
- Need visual analysis from video
- Need transcription + visual overlays

**Command:**
```bash
gemini analyze-video <file>   # Full video analysis
gemini analyze-audio <file>   # Audio transcription
gemini analyze-pdf <file>     # PDF analysis (long context)
gemini chat "query"           # Interactive query
```

---

## Auto-Routing Rules

### Rule 1: No Self-Review
**Problem:** Claude doesn't recognize its own errors. It gets stuck in loops.

**Solution:** Hard stop rule
- If Claude fails same task **once** → Consider Codex review
- If Claude fails same task **twice** → **Mandatory hand-off to Codex**
- Codex provides fresh perspective, breaks the loop

**Example:**
```
User: "Fix the authentication bug"
Claude: [attempts fix, fails]
User: "That didn't work, try again"
Claude: [attempts same approach, fails again]
→ AUTO-TRIGGER: Hand off to Codex rescue
```

---

### Rule 2: Failure Detection
**Watch for:**
- Same error appears 2+ times
- User says "that didn't work" twice
- Tests fail repeatedly with same error
- Circular logic detected

**Action:**
```bash
# Automatically invoke Codex rescue
codex rescue "Describe the problem and what Claude tried"
```

---

### Rule 3: Media/Document Routing
**Automatic triggers:**
- File extension: `.mp4`, `.mov`, `.avi`, `.mkv` → Gemini video
- File extension: `.mp3`, `.wav`, `.m4a`, `.ogg` → Gemini audio
- File extension: `.pdf` AND size >10MB → Gemini PDF
- User says "analyze this video" → Gemini
- User says "transcribe this audio" → Gemini

**Action:**
```bash
# Route to Gemini automatically
gemini analyze-video <path>
gemini analyze-audio <path>
gemini analyze-pdf <path>
```

---

### Rule 4: Parallel Consensus
**When user says:** "Ask all three" or "Get consensus" or "debate this"

**Action:**
1. Claude answers (immediately, you're already here)
2. Send to Codex: `codex chat "<question>"`
3. Send to Gemini: `gemini chat "<question>"`
4. Compare results
5. Present all three perspectives with verdict

**Example:**
```
User: "Ask all three: What's the best social media platform to start a business in 2026?"

Claude response: [your answer]
Codex response: [via CLI]
Gemini response: [via CLI]

Verdict: [synthesized conclusion based on all three]
```

---

## Workflow Patterns

### Pattern 1: Build → Review
**Standard workflow for new code:**

1. **Claude builds** (you do this)
   ```
   User: "Build JWT middleware for Express"
   → You write the code, save files
   ```

2. **Codex reviews** (automatic after completion)
   ```bash
   codex review middleware/jwt.ts
   ```

3. **Present findings**
   ```
   Codex found:
   - High: No JWT secret rotation mechanism
   - Medium: Missing token expiration validation
   - Low: Could add rate limiting
   
   Should I implement these fixes?
   ```

---

### Pattern 2: Rescue Mode
**When Claude gets stuck:**

1. **Detect failure** (2+ failed attempts)
2. **Hand off to Codex**
   ```bash
   codex rescue "Problem: Authentication failing after password reset. 
   Claude tried: 
   1. Clearing sessions - didn't work
   2. Resetting DB constraints - didn't work
   
   Suspected issue: Token invalidation timing"
   ```

3. **Codex provides solution**
4. **Claude implements** Codex's recommendation

---

### Pattern 3: Video Analysis
**When analyzing videos:**

1. **Gemini analyzes** video
   ```bash
   gemini analyze-video downloads/alex-hormozi-video.mp4
   ```

2. **Extract:**
   - Full transcript (audio → text)
   - Visual overlays (text appearing on screen)
   - Scene descriptions (frame-by-frame)
   - Timestamps for key moments

3. **Claude builds** interactive HTML
   - Combine transcript + visuals
   - Searchable, navigable interface
   - Save to file

4. **Codex reviews** HTML output
   - Check for accuracy
   - Verify structure
   - Validate completeness

---

## Command Reference

### Codex Commands
```bash
# Review code file
codex review <file>

# Adversarial review (super critical)
codex review --adversarial <file>

# Interactive chat
codex chat "How should I structure this API?"

# Rescue mode (when stuck)
codex rescue "Problem description"

# Check version
codex --version

# Authentication
codex login
```

---

### Gemini Commands
```bash
# Analyze video (up to 2 hours)
gemini analyze-video <file>

# Analyze audio (up to 10 hours)
gemini analyze-audio <file>

# Analyze large PDF (200+ pages)
gemini analyze-pdf <file>

# Interactive chat (1M context)
gemini chat "Question here"

# Check version
gemini --version

# Authentication
gemini login
```

---

## Usage Examples

### Example 1: Code Review
```
User: "Build a user authentication system"

Claude: [builds auth system, saves files]

AUTO-TRIGGER: Code complete → Review with Codex

codex review src/auth/

Codex findings:
- High: Password hashing uses deprecated bcrypt settings
- Medium: No rate limiting on login endpoint
- Low: Could add MFA support

Claude: [implements fixes based on Codex feedback]
```

---

### Example 2: Rescue
```
User: "Fix the database connection timeout"

Claude: [tries increasing timeout → fails]
User: "Still not working"
Claude: [tries connection pooling → fails]

AUTO-TRIGGER: Failed twice → Hand off to Codex

codex rescue "Database connection timeout. Tried:
1. Increased timeout to 30s - still times out
2. Added connection pooling - still times out

Error: 'Connection reset by peer' after 10s"

Codex: "The issue isn't timeout or pooling. Your DB server
firewall is dropping idle connections after 10s. Add keepalive
pings every 5s."

Claude: [implements keepalive pings → SUCCESS]
```

---

### Example 3: Video Analysis
```
User: "Analyze this video from Alex Hormozi and create an
interactive HTML breakdown"

AUTO-TRIGGER: Video file → Route to Gemini

gemini analyze-video downloads/alex-hormozi.mp4

Gemini output:
- Transcript: [full audio transcription]
- Visual overlays: [text on screen at each timestamp]
- Scene descriptions: [visual breakdown frame-by-frame]

Claude: [builds interactive HTML combining all elements]

AUTO-TRIGGER: HTML complete → Review with Codex

codex review video-analysis.html

Codex: "HTML structure good, but missing:
- Search functionality for transcript
- Jump-to-timestamp links
- Mobile responsive CSS"

Claude: [adds missing features]
```

---

### Example 4: Parallel Consensus
```
User: "Ask all three: What's the best database for a social
media app with 1M+ users?"

Claude: "PostgreSQL with read replicas. Strong ACID guarantees,
proven at scale (Instagram, Reddit), excellent JSON support..."

codex chat "Best database for social media app, 1M+ users?"
Codex: "MongoDB with sharding. Flexible schema for evolving
social features, horizontal scaling, good for feeds..."

gemini chat "Best database for social media app, 1M+ users?"
Gemini: "Cassandra for feed data + PostgreSQL for user data.
Hybrid approach: Cassandra handles high write volume for feeds,
PostgreSQL for transactional user data..."

VERDICT: Hybrid approach (Gemini's suggestion) is best:
- PostgreSQL for users, auth, profiles (ACID needed)
- Redis for caching, sessions, real-time features
- Cassandra/ScyllaDB for activity feeds (write-heavy)
- Reasoning: Matches architecture of proven platforms (Twitter, Facebook)
```

---

## Output Filing Rules

**After any Codex or Gemini operation:**

1. **Save output to file** (don't just display)
2. **Use descriptive filenames:**
   - Codex reviews → `codex-review-<feature>.md`
   - Gemini video → `gemini-video-<name>.html`
   - Gemini PDF → `gemini-pdf-<name>.md`

3. **Organize by date:**
   ```
   reviews/
   ├── 2026-05-02-codex-review-auth.md
   ├── 2026-05-02-gemini-video-hormozi.html
   └── 2026-05-03-codex-rescue-database.md
   ```

4. **Include metadata:**
   - Date, time
   - Model used (Codex/Gemini)
   - Task type (review/rescue/analysis)
   - Original file/query

---

## Cost & Limits

### Codex (ChatGPT o1)
**Cost:** Uses existing ChatGPT subscription
- **Plus ($20/month)**: 50 messages per 3 hours
- **Pro ($200/month)**: Unlimited messages

**Best for:**
- Daily code reviews: Plus tier sufficient
- Full-day agent work: Pro tier recommended

---

### Gemini 2.5 Pro
**Cost:** FREE (Google AI Studio)
- **Flash**: 1,500 requests/day (quick text/image)
- **Pro**: 50 requests/day (video/audio/large PDF)

**Limits:**
- Video: Up to 2 hours per request
- Audio: Up to 10 hours per request
- PDF: 200+ pages per request
- Context: 1M tokens

**Best for:**
- Most developers: Free tier sufficient
- Heavy video/PDF work: Still free!

---

## Session Close Integration

**Before ending session:**

1. If Codex/Gemini were used:
   - Save all outputs to files
   - Update `bd` issues with findings
   - Commit review results

2. Create issues for findings:
   ```bash
   bd create --title="Fix: Codex found JWT secret rotation missing" \
            --description="From codex-review-auth.md, priority issue" \
            --type=bug --priority=1
   ```

3. Follow standard close protocol:
   ```bash
   bd close <completed-issues>
   git add . && git commit -m "..."
   git push
   ```

---

## Key Rules Summary

✅ **DO:**
- Use Claude for all coding (you're the driver)
- Auto-invoke Codex after completing code
- Route video/audio/PDF to Gemini automatically
- Hand off to Codex after 2 failures
- Save all Codex/Gemini outputs to files
- Use parallel consensus for important decisions

❌ **DON'T:**
- Let Claude review its own code (blind spots)
- Keep trying same approach after 2 failures
- Try to analyze videos with Claude (use Gemini)
- Forget to save Codex/Gemini outputs
- Skip Codex review on important code

---

## Troubleshooting

### "codex: command not found"
```bash
npm install -g @openai/codex
codex login
```

### "gemini: command not found"
```bash
npm install -g @google/gemini-cli
gemini login
```

### "Codex authentication failed"
```bash
codex login  # Re-authenticate
# Opens browser → Sign in to ChatGPT
```

### "Gemini rate limit exceeded"
- Free tier: 1,500 Flash / 50 Pro requests per day
- Wait 24 hours for reset
- Upgrade to paid tier (if needed)

---

## Advanced: Three-Brain Debate

**For complex decisions:**

```
User: "Should we use microservices or monolith for this project?"

1. Claude (Context-aware):
   "Given our current team size (3 devs) and timeline (3 months),
   start with modular monolith. Microservices add operational
   complexity we can't handle yet. Use bounded contexts now,
   extract services later if needed."

2. Codex (Code-focused):
   "Microservices enable independent deployment and scaling.
   Recommend: API gateway + 3-4 services (auth, users, content,
   analytics). Use Docker Compose locally, deploy to Kubernetes."

3. Gemini (Broad analysis):
   "Historical data shows: Teams <10 succeed with monoliths 73% vs
   microservices 41%. Premature microservices = cognitive overhead.
   However, if any service needs independent scaling (e.g., video
   processing), extract ONLY that service."

Verdict: Modular monolith with extraction strategy
- Start: Single deployable with clear module boundaries
- Monitor: Identify actual bottlenecks (not assumed ones)
- Extract: Only if metrics prove need (>1000 req/s, different SLAs)
- Hybrid approach: Best of both, lowest risk
```

---

**Created:** 2026-05-02  
**Version:** 1.0  
**Dependencies:** `@openai/codex`, `@google/gemini-cli`  
**Purpose:** Intelligent multi-model routing for maximum productivity
