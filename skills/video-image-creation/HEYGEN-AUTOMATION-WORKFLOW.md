# HEYGEN VIDEO AUTOMATION WORKFLOW
**For Claude Code Desktop + HeyGen**
**Created:** March 25, 2026

---

## OVERVIEW

Automate HeyGen long-form video creation (15+ scenes) using Claude Code Desktop's computer use capabilities. This workflow reduces video creation time from **60 minutes to 12-15 minutes** per video.

---

## THE KEY INSIGHT (Your Breakthrough)

**Pre-upload all images to HeyGen's Media Library BEFORE automation.**

This eliminates the fragile file picker dialogs and makes automation 10X more reliable:
- ✅ No OS file dialogs (the tricky part)
- ✅ Just UI clicks within HeyGen (reliable)
- ✅ Name matching is trivial (script-002.txt → energy-002.png)
- ✅ Batch upload takes 2 minutes vs 20+ minutes one-by-one

---

## WORKFLOW STRUCTURE

### **Phase 1: Manual Prep (5 minutes)**

**1. Upload Images to HeyGen (2 minutes)**
```
→ Open HeyGen
→ Click Media tab
→ Create folder: "Energy Transitions" (or video name)
→ Upload all images at once (batch upload)
→ Images now in HeyGen cloud, ready to select
```

**2. Terminal Claude: Generate Script Files (1 minute)**
```bash
claude "Take the Energy Transitions video script segments
from skills/video-image-creation/output/ and create
individual files numbered segment-001.txt through segment-015.txt.

Segment 001: Avatar intro
Segments 002-014: Image scenes
Segment 015: Avatar outro

Save to ./energy-video/ folder"
```

Output structure:
```
energy-video/
  ├── segment-001.txt  (avatar intro)
  ├── segment-002.txt  (image scene)
  ├── segment-003.txt  (image scene)
  ...
  ├── segment-014.txt  (image scene)
  └── segment-015.txt  (avatar outro)
```

**3. Terminal Claude: Generate Config File (1 minute)**
```bash
claude "Create a HeyGen automation config file for Energy Transitions video:
- 15 scenes total
- Scene 1: Avatar (Terry Byrd)
- Scenes 2-14: Images from 'Energy Transitions' HeyGen folder
- Scene 15: Avatar (Terry Byrd)
- Scripts in ./energy-video/
- Aspect ratio: 9:16
- Voice: TerryByrd3.mp3

Save as energy-heygen-config.yaml"
```

**Config file format:**
```yaml
# energy-heygen-config.yaml
video:
  name: "Energy Transitions AI Transformation"
  aspect_ratio: "9:16"
  heygen_url: "https://app.heygen.com/create-v4/draft?..."

avatar:
  name: "Terry Byrd - Cyborg Innovator"
  voice: "TerryByrd3.mp3"
  scenes: [1, 15]

images:
  heygen_folder: "Energy Transitions"
  scenes: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  naming_pattern: "energy-{number:03d}.png"

scripts:
  folder: "./energy-video/"
  naming_pattern: "segment-{number:03d}.txt"
```

---

### **Phase 2: Desktop Claude Execution (7-10 minutes)**

**1. Open HeyGen + Claude Desktop**
- Browser: HeyGen video editor open
- Claude Desktop app: Ready

**2. Give Claude the Command**
```
"Execute energy-heygen-config.yaml to create the HeyGen video.

Process:
- Set aspect ratio to 9:16
- For each scene:
  * If avatar (scenes 1, 15): Paste script, select Terry Byrd avatar, set voice
  * If image (scenes 2-14): Paste script, click Add Scene, select image from 'Energy Transitions' folder matching segment number

Pause after every 3 scenes so I can verify.
Show me what you're doing at each step."
```

**3. Claude Executes Step-by-Step**

**Scene 1 (Avatar Intro):**
```
Claude: "Starting scene 1 - Avatar intro"
→ Clicks aspect ratio dropdown (top right)
→ Selects "9:16"
→ Reads segment-001.txt
→ Pastes script into script box (left side)
→ Clicks avatar panel (right side)
→ Selects "Terry Byrd - Cyborg Innovator"
→ Clicks voice dropdown
→ Selects "TerryByrd3.mp3"
Claude: "✓ Scene 1 complete (Avatar intro)"
```

**Scene 2 (First Image):**
```
Claude: "Adding scene 2 - First image"
→ Clicks "+ Add scene" button (bottom left)
→ Reads segment-002.txt
→ Pastes script into new scene
→ Clicks "Media" icon (right panel)
→ Navigates to "Energy Transitions" folder
→ Clicks "energy-002.png"
Claude: "✓ Scene 2 complete (Image: energy-002.png)"
```

**Scene 3 (Second Image):**
```
Claude: "Adding scene 3 - Second image"
→ Clicks "+ Add scene"
→ Reads segment-003.txt
→ Pastes script
→ Media browser already open to correct folder
→ Clicks "energy-003.png"
Claude: "✓ Scene 3 complete (Image: energy-003.png)"

[PAUSE]
Claude: "Scenes 1-3 complete. Please verify before continuing."
```

**You verify:** Look at timeline, check scripts, check images
**You:** "Looks good, continue"

**Scenes 4-6:**
```
[Claude repeats process for scenes 4-6]
[PAUSE]
Claude: "Scenes 4-6 complete. Please verify."
```

**You verify and approve**

**Scenes 7-9:**
```
[Claude continues...]
[PAUSE]
```

**Scenes 10-12:**
```
[Claude continues...]
[PAUSE]
```

**Scenes 13-14:**
```
[Claude continues...]
```

**Scene 15 (Avatar Outro):**
```
Claude: "Adding final scene 15 - Avatar outro"
→ Clicks "+ Add scene"
→ Reads segment-015.txt
→ Pastes script
→ Clicks avatar panel
→ Selects "Terry Byrd - Cyborg Innovator"
→ Voice already set to TerryByrd3.mp3
Claude: "✓ Scene 15 complete (Avatar outro)"

Claude: "All 15 scenes created. Timeline shows:
- Scene 1: Avatar (0:20)
- Scenes 2-14: Images with narration (13 scenes)
- Scene 15: Avatar (0:10)

Ready to generate?"
```

**4. Final Verification**
- You scroll through timeline
- Check each scene preview
- Verify scripts match images
- Confirm everything looks correct

**5. Generate**
```
You: "Everything looks good. Generate the video."
Claude:
→ Clicks "Generate" button (top right)
→ Waits for render to start
→ Confirms generation started
Claude: "Video generation started. HeyGen will email you when complete (usually 5-10 minutes)."
```

---

## TIME BREAKDOWN

### **Manual Process (Current):** 60 minutes
- Upload images one-by-one: 10 min
- Type 15 script segments: 15 min
- Click Add Scene 14 times: 5 min
- Match images to segments: 20 min
- Verify everything: 10 min

### **Automated Process (This Workflow):** 12-15 minutes
- Batch upload images to HeyGen: 2 min
- Terminal Claude generates files: 1 min (automated)
- Desktop Claude executes workflow: 7-10 min
- You verify 4 times (every 3 scenes): 3 min
- Final review: 2 min

### **Time Savings:** 45-48 minutes per video (75% reduction)

### **For 4 Videos:**
- Manual: 4 hours
- Automated: 48-60 minutes
- **Total time saved: 3 hours**

---

## VERIFICATION CHECKPOINTS

**Every 3 scenes, Claude pauses and you check:**

✅ **Scripts:** Does the narration make sense?
✅ **Images:** Correct image for each segment?
✅ **Timing:** Scenes flow logically?
✅ **Avatar scenes:** Correct avatar selected?
✅ **Aspect ratio:** Still 9:16?

If something's wrong:
- Tell Claude what to fix
- Claude corrects it
- Continue from that point

---

## NAMING CONVENTIONS (CRITICAL)

**Scripts:**
```
segment-001.txt  (avatar intro)
segment-002.txt  (image scene)
segment-003.txt  (image scene)
...
segment-014.txt  (image scene)
segment-015.txt  (avatar outro)
```

**Images in HeyGen:**
```
energy-002.png  (matches segment-002.txt)
energy-003.png  (matches segment-003.txt)
...
energy-014.png  (matches segment-014.txt)
```

**Pattern:** `{video-name}-{number:03d}.png`

Claude extracts the number from segment file and finds matching image.

---

## ERROR RECOVERY

**If Claude makes a mistake:**

1. **Pause execution:** "Stop. Scene 5 has the wrong image."
2. **Claude fixes:** "Delete scene 5 and recreate with energy-005.png"
3. **Resume:** "Continue from scene 6"

**If HeyGen UI changes:**
- Claude can adapt (it sees the screen)
- Might need to update button locations in config
- But workflow pattern stays the same

---

## SCALING TO MULTIPLE VIDEOS

**Once this works for Energy Transitions:**

**Video 2: 5 Boring AI Businesses**
```yaml
# boring-heygen-config.yaml
video:
  name: "5 Boring AI Businesses"
  aspect_ratio: "16:9"  # Different aspect ratio

avatar:
  name: "Terry Byrd - Cyborg Innovator"
  voice: "TerryByrd3.mp3"
  scenes: [1, 18]  # Different structure

images:
  heygen_folder: "Boring AI Businesses"
  scenes: [2, 3, 4, ... 17]
  naming_pattern: "boring-{number:03d}.png"
```

**Same process, different config.**

**Time per video (after first success):**
- Video 1: 15 min (learning curve)
- Videos 2-4: 10-12 min each (optimized)

---

## PREREQUISITES

**Before starting:**

✅ Claude Code Desktop installed
✅ HeyGen account with avatar created
✅ Voice file uploaded to HeyGen (TerryByrd3.mp3)
✅ All images generated and ready
✅ Video script completed and segmented

**First-time setup:**
- 15-20 minutes (figuring out the workflow)

**Subsequent videos:**
- 10-12 minutes each (process optimized)

---

## FIRST TEST: THIS WEEKEND

### **Saturday Setup (10 min):**
1. Install Claude Code Desktop
2. Upload 13 images to HeyGen "Energy Transitions" folder
3. Terminal Claude: Generate segment files
4. Terminal Claude: Generate config file

### **Sunday Execution (15 min):**
1. Open HeyGen video editor
2. Open Claude Desktop
3. Share HeyGen screen with Claude
4. Command: "Execute energy-heygen-config.yaml with verification pauses"
5. Verify every 3 scenes
6. Final review
7. Generate video

**Expected outcome:**
- First video: 15-20 min total
- Proves the workflow works
- Next 3 videos: 10 min each

---

## WHY THIS WORKS

**🎯 You solved the hard part:**
- Pre-uploading images to HeyGen eliminates OS file dialogs
- Name matching is trivial (segment-002 → energy-002)
- All interactions are within HeyGen UI (reliable)

**🤖 Claude handles the tedium:**
- 50+ clicks automated
- 15 script pastes automated
- 13 image selections automated
- Pattern matching (no human error)

**👁️ You maintain quality:**
- Verify every 3 scenes
- Catch errors early
- Final review before generating
- Still 75% faster than manual

---

## SUCCESS CRITERIA

**After first test this weekend:**

✅ Video generates without errors
✅ All 15 scenes in correct order
✅ Images match scripts perfectly
✅ Avatar scenes have correct settings
✅ Total time < 20 minutes

**Then you know it works and can:**
- Create remaining 3 videos
- Reduce verification (trust the process)
- Eventually run with minimal supervision

---

## FUTURE OPTIMIZATION

**Once you've done 3-4 videos successfully:**

**Reduce verification:**
- Verify every 5 scenes instead of 3
- Or verify just at the end
- Claude has proven itself reliable

**Batch production:**
- Generate config files for all 4 videos
- Run them consecutively
- 40 minutes total vs 4 hours manual

**Template reuse:**
- Save working configs
- Modify for new videos
- 90% of work already done

---

## LONG-TERM VALUE

**Per video time investment:**
- Manual: 60 min
- Automated: 12 min
- Savings: 48 min

**If you create 1 video/week for a year:**
- Manual: 52 hours
- Automated: 10.4 hours
- **Annual savings: 41.6 hours**

**Plus:**
- Reduced mental fatigue (no tedious clicking)
- Higher consistency (no human error)
- More videos possible (time available)

---

**Ready to test this weekend. Let's prove it works with Energy Transitions!** 🎬
