# Image Prompt Template - Quick Reference

Use this template for each image in a video project.

---

## Image [NUMBER]: [VISUAL TYPE]

**Concept:** [One sentence - what story does this tell?]

**Visual Elements:**
- [Primary element 1]
- [Primary element 2]
- [Primary element 3]

**Text on Image:**
- Main Heading: "[LARGE PROMINENT TEXT]"
- Subheading: "[Brief secondary text]" (optional)
- Data/Labels: "[Key numbers or short labels]"
- Source: "[Citation if applicable]" (small text at bottom)

**Color Palette:**
- [Primary colors and meaning - e.g., "Blue gradient background, green zone (optimal), yellow zone (marginal), red zone (danger)"]

**Style Notes:**
- [Illustration style - infographic/realistic/semi-realistic]
- [Mood - professional/energetic/cautionary]
- [Specific metaphors - e.g., "treadmill represents work pace"]

**Image Generation Prompt:**
```
[Complete detailed prompt for DALL-E or Midjourney]

Example structure:
A [style] illustration showing [main visual elements]. [Layout description].
[Text placement and content]. [Color scheme]. [Lighting/mood].
Professional infographic style, clean modern design, vibrant colors,
suitable for educational video content.
```

---

## Visual Type Reference

Choose one:
- **Progression/Timeline** - Stage 1 → Stage 2 → Stage 3
- **Comparison/Contrast** - Side-by-side or top vs. bottom
- **Data Visualization** - Charts, graphs, prominent statistics
- **Cycle/Loop** - Circular diagrams showing patterns
- **Concept Illustration** - Central idea with supporting elements

---

## Style Checklist

Before finalizing prompt:
- [ ] Concept is visually clear (not text-dependent)
- [ ] Headline is LARGE and prominent
- [ ] Explanatory text is minimal (2-3 lines max per section)
- [ ] Colors are vibrant and purposeful (not drab)
- [ ] Layout is simple (one main concept)
- [ ] Design is artistic (not just boxes)
- [ ] Image tells a story
- [ ] Suitable for video production workflow

---

## Color Guidance

**Use colors with meaning:**
- Green = positive, optimal, growth
- Red = danger, decline, warning
- Yellow/Orange = caution, transition
- Blue = trust, stable, information
- Purple = premium, advanced
- Gradients = progression, transition

**Background options:**
- Gradient (two-tone blend)
- Zoned (sections with different colors)
- Solid with accent zones
- Light neutral with colorful elements

---

## Text Hierarchy

**Size Priority:**
1. **Main Headline** - LARGEST (60-80pt equivalent)
2. **Key Data** - VERY LARGE (50-70pt for %, numbers)
3. **Subheadings** - Medium-Large (30-40pt)
4. **Labels/Annotations** - Medium (20-30pt)
5. **Source Citations** - Small (12-16pt)

**Amount:**
- Headline: 3-8 words
- Subheading: 4-10 words
- Labels: 1-3 words each
- Explanatory text: 5-15 words max per section

---

## Common Patterns

### Pattern: Stage Progression
```
[Stage 1] → [Stage 2] → [Stage 3]
Horizontal flow with arrows
Each stage: icon + label + 2-3 line description
Color coding per stage
```

### Pattern: Prominent Statistic
```
[GIANT NUMBER - 346%]
Supporting context: timeline or simple chart
Brief explanation (1 line)
Large heading below
```

### Pattern: Split Comparison
```
[TOP HALF]
Heading 1
Visual representation
Brief description

[BOTTOM HALF]
Heading 2 (contrasting)
Contrasting visual
Brief description
```

### Pattern: Cycle Diagram
```
     [Stage 2]
[Stage 1] ← → [Central Concept] ← → [Stage 3]
     [Stage 4]
Circular arrows connecting
Brief label per stage
Key insight below
```

### Pattern: Data Chart
```
[Chart/Graph as main element]
Color zones (green/yellow/red)
Annotations (callouts with arrows)
Large heading below chart
Source citation at bottom
```

---

## Quality Gates

**Before generating image, verify:**

✅ **Visual First**
- Can this be understood without the narration?
- Do visuals carry the message?

✅ **Text Minimal**
- Is text supporting (not replacing) visuals?
- Are headlines large and impactful?
- Is explanatory text under 15 words per section?

✅ **Color Purposeful**
- Do colors have meaning (not random)?
- Is it vibrant and engaging (not drab)?

✅ **Layout Simple**
- One main concept per image?
- Not overcrowded?
- Clear visual hierarchy?

✅ **Production Ready**
- Simple sequential number (001, 002, 003...)?
- Maps clearly to script segment?
- Easy to match for video editing?

---

## Example Prompt Structure

```
A professional infographic illustration in modern corporate style showing
[MAIN VISUAL CONCEPT]. The image features [LAYOUT DESCRIPTION - e.g.,
"a horizontal timeline with three distinct stages"].

Stage 1 (left): [description] with [visual element]
Stage 2 (center): [description] with [visual element]
Stage 3 (right): [description] with [visual element]

Text elements:
- Large bold headline at top: "[HEADLINE TEXT]"
- Stage labels: "[LABEL 1]", "[LABEL 2]", "[LABEL 3]"
- Brief descriptions under each stage (5-10 words each)

Color scheme: [BACKGROUND COLOR] background with [ACCENT COLORS].
[Stage 1 zone COLOR], [Stage 2 zone COLOR], [Stage 3 zone COLOR].

Visual style: Clean modern infographic, vibrant colors, professional
business illustration, suitable for educational video content. Include
simple icons and visual metaphors. Avoid photorealism - use illustrated
style similar to corporate presentation graphics.

Lighting: Bright, clear, high contrast for readability.
Composition: Balanced, horizontal flow, clear progression from left to right.
```

---

## Anti-Patterns (Don't Do This)

❌ **Text-heavy slide**
- Paragraphs of text
- Small fonts everywhere
- Text as primary element

❌ **Drab boxes**
- Plain rectangles with text
- No color variation
- Generic layout

❌ **Over-detailed**
- Too many concepts in one image
- Cluttered layout
- Competing focal points

❌ **Vague visuals**
- Generic stock photo style
- Unclear message
- Needs narration to understand

❌ **Bad numbering**
- Sub-versions (001A, 001B, 001C)
- Confusing sequence
- Hard to match with script

---

## Workflow Reminder

```
1. Read full script
2. Map concepts to image numbers (001, 002, 003...)
3. For each image:
   - Choose visual type
   - Identify key elements
   - Draft text content
   - Select colors
   - Write complete prompt
4. Quality check all prompts
5. Deliver sequence map + all prompts
6. User generates images
7. User matches images to script segments (easy 1:1 mapping)
8. User creates video in Heygen
```

Simple. Sequential. Story-driven.
