---
name: image-generation
description: Generate images using Gemini Nana Banana Pro for video production
metadata:
  jarvis:
    requires:
      bins: []
      env:
        - GEMINI_API_KEY
      config: []
      mcp_servers: []
    primaryEnv: GEMINI_API_KEY
    domain: content-creation
    security_level: low
    requires_approval: false
    allowed_operations:
      - read
      - write
      - network
    version: 1.0.0
    author: JARVIS
    tags:
      - image-generation
      - video-production
      - gemini
      - nana-banana-pro
    integrates_with:
      - video-image-creation
    feeds_into:
      - video-production
    consumes_from: []
---

# Image Generation Skill

Generate high-quality images for video production using Gemini's Nana Banana Pro model.

## Critical Information

**IMPORTANT - Read This First Every Time:**

### Correct Model Name
- **Model:** `gemini-3-pro-image-preview`
- **Display Name:** Nana Banana Pro 3
- **NOT:** `nana-banana-pro`, `nano-banana-pro-preview`, `imagen-3.0`, etc.

### Required SDK
```python
from google import genai
from google.genai import types
```

**Installation:** Already installed on system (do NOT try to reinstall)

### API Key Location
- **File:** `${JARVIS_PRIVATE}/apps/content-creation/video-generator/.env`
- **Variable:** `GEMINI_API_KEY`
- **Note:** Always load from the env var; never hardcode the value in any file

## Standard Usage Pattern

### 1. Load Environment Variables

```python
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
```

### 2. Initialize Client

```python
from google import genai
from google.genai import types

client = genai.Client(api_key=GEMINI_API_KEY)
```

### 3. Generate Image

```python
response = client.models.generate_content(
    model='gemini-3-pro-image-preview',
    contents=prompt,
    config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE'],
        image_config=types.ImageConfig(
            aspect_ratio="16:9",  # YouTube standard
            image_size="2K"       # High quality
        )
    )
)

# Save image
for part in response.parts:
    if image := part.as_image():
        image.save(str(output_path))
        return True
```

## Common Input Formats

### Format 1: Markdown File with Sections

**Pattern:**
```markdown
## Image 001: Title

**Image Generation Prompt:**
[prompt text here]

---

## Image 002: Title

**Image Generation Prompt:**
[prompt text here]
```

**Extraction Code:**
```python
import re

def extract_prompts(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    sections = re.split(r'^## Image (\d+):', content, flags=re.MULTILINE)
    prompts = {}
    
    for i in range(1, len(sections), 2):
        image_num = sections[i].strip()
        section_content = sections[i + 1] if i + 1 < len(sections) else ""
        
        prompt_match = re.search(
            r'\*\*Image Generation Prompt:\*\*\s*\n(.+?)(?=\n\n---|$)', 
            section_content, 
            re.DOTALL
        )
        
        if prompt_match:
            prompt = prompt_match.group(1).strip()
            img_key = f"{int(image_num):03d}"
            prompts[img_key] = prompt
    
    return prompts
```

### Format 2: Python Dictionary

```python
PROMPTS = {
    "001": "Image prompt for slide 1...",
    "002": "Image prompt for slide 2...",
    # ...
}
```

## Standard Output Structure

### Directory Structure
```
project-name/
├── images/
│   ├── project-v1-001.png
│   ├── project-v1-002.png
│   └── ...
├── generate_images.py
└── prompts.md
```

### File Naming Convention
- **Pattern:** `{project}-v{version}-{number}.png`
- **Examples:**
  - `jarvis-v4-001.png`
  - `openclaw-v3-012.png`
  - `agent-sdk-v1-045.png`

## Rate Limiting

**Best Practice:** 1 second delay between requests

```python
import time

for img_num in sorted(prompts.keys()):
    generate_image(prompts[img_num], f"output-{img_num}.png")
    
    # Don't wait after last image
    if img_num != list(prompts.keys())[-1]:
        time.sleep(1)
```

## Complete Working Example

```python
#!/usr/bin/env python3
"""
Generate images using Nana Banana Pro
"""

import os
import sys
import time
from pathlib import Path
from dotenv import load_dotenv

# Load environment
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

# Import Gemini
from google import genai
from google.genai import types

# Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
MODEL = 'gemini-3-pro-image-preview'
OUTPUT_DIR = Path(__file__).parent / "images"
OUTPUT_DIR.mkdir(exist_ok=True)

class ImageGenerator:
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)
    
    def generate(self, prompt: str, output_path: Path) -> bool:
        try:
            response = self.client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_modalities=['TEXT', 'IMAGE'],
                    image_config=types.ImageConfig(
                        aspect_ratio="16:9",
                        image_size="2K"
                    )
                )
            )
            
            for part in response.parts:
                if image := part.as_image():
                    image.save(str(output_path))
                    return True
            
            return False
        except Exception as e:
            print(f"Error: {e}")
            return False

def main():
    generator = ImageGenerator(GEMINI_API_KEY)
    
    prompts = {
        "001": "Your image prompt here...",
        "002": "Another image prompt...",
    }
    
    for img_num, prompt in prompts.items():
        output_path = OUTPUT_DIR / f"image-{img_num}.png"
        print(f"Generating {img_num}...", end=" ")
        
        if generator.generate(prompt, output_path):
            print("✅")
        else:
            print("❌")
        
        time.sleep(1)

if __name__ == "__main__":
    main()
```

## Common Mistakes to Avoid

### ❌ WRONG Model Names
- `nana-banana-pro`
- `nano-banana-pro-preview` 
- `imagen-3.0-generate-001`
- `nana-banana-pro-preview`

### ✅ CORRECT Model Name
- `gemini-3-pro-image-preview`

### ❌ WRONG API Patterns
```python
# Don't try REST API endpoints
url = "https://generativelanguage.googleapis.com/..."
requests.post(url, ...)
```

### ✅ CORRECT API Pattern
```python
# Use the Python SDK
from google import genai
client = genai.Client(api_key=GEMINI_API_KEY)
```

### ❌ WRONG Installation Attempts
```bash
pip3 install google-genai  # Already installed!
```

### ✅ CORRECT Verification
```python
# Just check if it's available
from google import genai  # Will work if installed
```

## Troubleshooting

### Error: "Module not found: google.genai"
**Solution:** Already installed on system. Check Python path or use correct environment.

### Error: "404 Not Found"
**Cause:** Using wrong model name or REST API instead of SDK  
**Solution:** Use `gemini-3-pro-image-preview` with SDK

### Error: "No image generated"
**Cause:** Response format changed or prompt issue  
**Solution:** Check response structure and verify prompt

### Slow Generation
**Expected:** 30-60 seconds per image is normal  
**Solution:** Use background process for batch generation

## Integration with Video Production

### Typical Workflow

1. **Script Ready:** Video script with segments written
2. **Prompts Created:** Image prompts for each segment
3. **Generate Images:** Run this skill to create all images
4. **Generate Audio:** Use ElevenLabs for voice narration
5. **Combine:** Merge images + audio into final video

### File Locations

**Scripts:** `${JARVIS_HOME}/`
- `JARVIS-VIDEO-4-SCRIPT.md`
- `JARVIS-VIDEO-4-IMAGE-PROMPTS.md`

**Output:** `${JARVIS_PRIVATE}/apps/content-creation/video-generator/{project}/images/`

**Generator Scripts:** `${JARVIS_PRIVATE}/apps/content-creation/video-generator/{project}/`

## Quick Reference

| What | Value |
|------|-------|
| Model | `gemini-3-pro-image-preview` |
| SDK | `google.genai` |
| API Key Env Var | `GEMINI_API_KEY` |
| .env Location | `video-generator/.env` |
| Aspect Ratio | `16:9` |
| Image Size | `2K` |
| Rate Limit | 1 second between requests |
| Output Format | PNG |

## Example Projects

Reference these for working patterns:

1. **JARVIS Video 4:** `/jarvis-private/apps/content-creation/video-generator/jarvis-video-4/generate_jarvis_v4_images.py`
2. **Agent SDK:** `/jarvis-private/apps/content-creation/video-generator/generate_agent_sdk_images.py`
3. **OpenClaw Videos:** `/jarvis-private/apps/content-creation/video-generator/projects/byrddynasty/generate_video3_phase5_images.py`

## When to Use This Skill

- ✅ User asks to "generate images with Nana Banana Pro"
- ✅ User asks to "create images for a video"
- ✅ User provides image prompts in markdown format
- ✅ User references JARVIS video production
- ✅ User asks about image generation errors or issues

## Memory Note

**If you find yourself searching for:**
- "How to use Nana Banana Pro"
- "What's the Gemini image model name"
- "Where's the GEMINI_API_KEY"
- "How to extract prompts from markdown"

**STOP and read this skill file first!**

All the answers are here. Don't waste time searching old scripts or trying wrong API endpoints.

---

**Last Updated:** April 8, 2026  
**Status:** Production-ready, tested on multiple projects  
**Maintainer:** JARVIS
