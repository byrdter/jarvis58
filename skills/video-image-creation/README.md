# Video Image Creation Skill

**Purpose:** Create high-quality, story-driven image prompts for Byrddynasty educational videos.

---

## Quick Start

### For Claude

When user requests images for a video:

1. **Read the script** thoroughly
2. **Read `SKILL.md`** for complete process
3. **Reference `VISUAL-STYLE-GUIDE.md`** for quality standards
4. **Use `IMAGE-PROMPT-TEMPLATE.md`** for each image
5. **Deliver** complete package with sequence map + all prompts

### For Terry

When you need images for a video:

1. **Provide the script** to Claude
2. **Request image prompts** (Claude will follow the skill automatically)
3. **Review the sequence map** (001, 002, 003... matching script segments)
4. **Generate images** using the provided prompts in DALL-E or Midjourney
5. **Import to Heygen** (simple 1:1 mapping with script)

---

## File Structure

```
skills/video-image-creation/
├── README.md                     # This file - overview and quick start
├── SKILL.md                      # Complete skill documentation (full process)
├── IMAGE-PROMPT-TEMPLATE.md      # Quick reference template for each image
└── VISUAL-STYLE-GUIDE.md         # Detailed style guide with analyzed examples
```

---

## What This Skill Does

### Problems It Solves

❌ **Before:**
- Confusing numbering (001A, 001B, 001C...)
- Text-heavy images (paragraphs instead of visuals)
- Drab, boring designs (plain boxes)
- Over-detailed images (too many concepts crammed in)
- Hard to match images with script segments

✅ **After:**
- Simple sequential numbering (001, 002, 003...)
- Visual-first storytelling (images tell the story)
- Vibrant, engaging designs (colorful and artistic)
- One concept per image (simple and clear)
- Easy 1:1 mapping with script segments

### Key Features

**1. Simple Numbering System**
- One script segment = One image number
- Sequential: 001, 002, 003, 004...
- No sub-versions (no 001A, 001B nonsense)
- Easy to match with script in video editor

**2. Visual-First Approach**
- Images tell the story (not text)
- Large headlines, minimal body text
- Visual metaphors and storytelling
- Colorful and engaging (not drab boxes)

**3. Complete Workflow**
- Script analysis → Image planning → Prompt crafting → Quality check
- Structured deliverables
- Reference examples
- Quality standards

**4. Style Consistency**
- Based on your best existing images
- Color psychology guide
- Layout patterns
- Text hierarchy standards

---

## Core Principles

### 1. Visual Storytelling
Images should communicate the concept without narration. Use:
- Visual metaphors (treadmill = work pace)
- Progressive sequences (Stage 1 → 2 → 3)
- Contrasting scenarios (before vs. after)
- Data visualization (charts, prominent stats)

### 2. Color with Purpose
Colors should have meaning:
- Green = optimal, positive, growth
- Yellow = caution, transition
- Red = danger, decline
- Blue = trust, information
- Gradients = progression

### 3. Text as Accent
Text supports visuals (not replaces them):
- Headlines: LARGE and prominent
- Body text: Minimal (2-3 lines max per section)
- Labels: Brief (1-3 words)
- Let visuals do the talking

### 4. Simplicity Wins
One concept per image:
- Single clear message
- Clean layout
- Not overcrowded
- Easy to understand at a glance

---

## Workflow

### Phase 1: Script Review
- Read complete script
- Identify key concepts
- Note data points and transitions
- Understand narrative flow

### Phase 2: Image Planning
- Map concepts to simple sequential numbers (001, 002, 003...)
- One concept per number
- Match to script segments
- Create sequence map

### Phase 3: Prompt Crafting
For each image:
- Choose visual type (progression, comparison, data, cycle, etc.)
- Identify main visual elements
- Draft text content (headlines, labels)
- Select color approach
- Write complete DALL-E/Midjourney prompt

### Phase 4: Quality Check
Verify each prompt against checklist:
- [ ] Visual clarity (story told through pictures)
- [ ] Text balance (headlines large, body minimal)
- [ ] Color purpose (vibrant and meaningful)
- [ ] Simplicity (one concept, clean layout)
- [ ] Numbering (simple sequential)

### Phase 5: Delivery
Provide complete package:
- Sequence map (all image numbers with concepts)
- Complete prompt for each image
- Production notes
- Style consistency notes

---

## Visual Types

Choose the right visualization for each concept:

**Progression/Timeline:**
- Stage 1 → Stage 2 → Stage 3
- Timeline with milestones
- Before → After transformations

**Comparison/Contrast:**
- Side-by-side split screens
- Top vs. Bottom contrasts
- This vs. That

**Data Visualization:**
- Prominent statistics (346%, 85%)
- Line charts with zones
- Bar charts showing comparisons
- Pie charts for splits

**Cycle/Loop:**
- Circular diagrams showing patterns
- Feedback loops
- Paradox cycles

**Concept Illustration:**
- Central concept with supporting elements
- Metaphorical scenes
- Icon-based explanations

---

## Quality Standards

### Excellent Image

✅ Clear at a glance (2-second comprehension)
✅ Vibrant and engaging (rich colors with purpose)
✅ Text as accent (headlines large, body minimal)
✅ Story-driven (visual metaphors and sequences)
✅ Production ready (simple numbering, matches script)

### Poor Image

❌ Unclear message (requires narration)
❌ Text-heavy (paragraphs of text)
❌ Visually boring (drab colors, plain boxes)
❌ Overcomplicated (too many concepts)
❌ Production nightmare (confusing numbering)

---

## Reference Examples

**Best examples to reference:**

From Video 3 (Sloperator):
- 001A - Divergence flow (circular diagram)
- 001CB - 3-stage progression (clean, simple)
- 002AB - Timeline with prominent percentages
- 002BB - Color-coded roadmap
- 004BB - Pie chart with contrast boxes
- 005BC - Side-by-side comparison

From Video 2 (Capacity Reuse):
- 001A - Productivity Paradox Cycle
- 001C - ActivTrak data (prominent statistics)
- 003A - AI Productivity Paradox (4-stage cycle)
- 003B - Treadmill progression timeline
- 004A - Manager vs Employee split screen
- 006A - Tool usage chart with zones

**Location:**
`${JARVIS_PRIVATE}/apps/content-creation/video-generator/ProjectsNew/`

---

## File Usage Guide

### SKILL.md
**When to read:** Every time creating images for a video
**Contains:**
- Complete process (5 parts)
- Image planning methodology
- Prompt crafting template
- Quality checklist
- Delivery format
- Execution protocol

**Length:** Comprehensive (full documentation)

### IMAGE-PROMPT-TEMPLATE.md
**When to use:** For each individual image prompt
**Contains:**
- Quick reference template
- Visual type options
- Style checklist
- Color guidance
- Text hierarchy rules
- Common patterns
- Quality gates

**Length:** Quick reference (practical template)

### VISUAL-STYLE-GUIDE.md
**When to reference:** For style decisions and quality verification
**Contains:**
- Core visual principles
- 11 analyzed reference examples
- Specific style elements (backgrounds, arrows, text, icons, layouts)
- Color psychology guide
- Quality standards
- Aspect ratio guidance
- Final checklist

**Length:** Detailed guide (with examples)

### README.md (this file)
**When to read:** First time using skill, or for quick overview
**Contains:**
- Overview and quick start
- Problems solved
- Core principles
- Workflow summary
- Visual types
- Quality standards

**Length:** Overview (navigation guide)

---

## Example Deliverable

```markdown
# Video Images: [Video Title]

## Image Sequence Map
001 - Opening hook: AI productivity paradox intro
002 - Study data: 346% productivity increase
003 - Timeline: 18-month automation progression
004 - Warning: The productivity collapse zone
005 - Solution: 80/20 practice rule
006 - Comparison: Sloperator vs Orchestrator

---

## Image 001: Concept Illustration

**Concept:** Introduce the AI productivity paradox - initial gains followed by decline

**Visual Elements:**
- Central figure surrounded by question marks and competing arrows
- AI tools floating around (representing multiple tools)
- Upward arrow (productivity) and downward arrow (confusion)
- Circular pattern suggesting cycle/loop

**Text on Image:**
- Main Heading: "THE AI PRODUCTIVITY PARADOX"
- Subheading: "More tools ≠ More productivity"

**Color Palette:**
- Blue and orange gradient background
- Green upward arrow (initial gains)
- Red downward arrow (eventual decline)

**Image Generation Prompt:**
A modern infographic illustration showing the AI productivity paradox.
Center: A professional worker surrounded by floating AI tool icons
(robot, gears, chat bubbles, documents). The worker looks confused
with question marks above their head. Two large arrows: a green upward
arrow labeled "Initial Productivity +346%" and a red downward arrow
labeled "Long-term Decline -40%". Circular arrows in background
suggesting a cyclical pattern.

Text elements:
- Large bold heading at top: "THE AI PRODUCTIVITY PARADOX"
- Subheading below: "More tools ≠ More productivity"

Color scheme: Blue to orange gradient background, vibrant professional
colors. Green for positive elements, red for negative elements.

Style: Clean modern infographic style, professional business
illustration, semi-realistic, suitable for educational video content.
Bright, high contrast, clear composition.

---

## Image 002: Data Visualization

[Continue for each image...]

---

## Production Notes

**Style Consistency:**
- All images use blue-green-yellow-red color language
- Consistent illustration style (semi-realistic infographic)
- Consistent text hierarchy (large headlines, minimal body text)

**Timing Suggestions:**
- Hold each image 8-12 seconds
- Allow time for narration to complete
- Transitions: simple fades or wipes

**Aspect Ratio:** 16:9 (1920x1080)
```

---

## Tips for Success

### For Claude

1. **Always read SKILL.md first** - don't guess the process
2. **Reference example images** - maintain quality standard
3. **Keep numbering simple** - no sub-versions
4. **Prioritize visuals** - text should accent, not dominate
5. **One concept per image** - don't overcrowd
6. **Quality over quantity** - better to have 6 great images than 10 mediocre ones

### For Terry

1. **Provide complete script** - helps Claude plan image sequence
2. **Review sequence map first** - confirm it matches your vision
3. **Check numbering** - should be simple and match script segments
4. **Verify visual types** - right visualization for each concept
5. **Generate and test** - create a sample image to verify style
6. **Iterate if needed** - Claude can refine individual prompts

---

## Success Criteria

This skill is successful when:

✅ Terry can copy-paste prompts directly into image generator
✅ Images match script segments 1:1 with simple numbering
✅ Each image tells its story visually (minimal text)
✅ Colors are vibrant and purposeful
✅ Production process is straightforward
✅ No confusion about which image goes where
✅ Final video looks professional and engaging

---

## Version History

**v1.0 - March 17, 2026**
- Initial skill creation
- Based on Video 2 and Video 3 reference examples
- Comprehensive documentation with 4 files
- Simple sequential numbering system
- Visual-first storytelling approach
- Complete workflow from script to prompts

---

## Questions?

If you need help or have feedback:
- Review SKILL.md for complete process
- Check VISUAL-STYLE-GUIDE.md for style questions
- Reference analyzed examples for quality benchmark
- Use IMAGE-PROMPT-TEMPLATE.md for each prompt

**Remember:** Simple, colorful, story-driven. Not text-heavy, not drab, not complicated.
