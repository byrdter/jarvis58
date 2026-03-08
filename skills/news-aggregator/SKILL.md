---
name: news-aggregator
description: Aggregate and analyze news from multiple sources
metadata:
  jarvis:
    requires:
      bins:
        []
      env:
        []
      config: []
      mcp_servers:
        []
    primaryEnv: ""
    domain: research
    security_level: low
    requires_approval: false
    allowed_operations:
      - read
      - network
    version: 1.0.0
    author: JARVIS
    tags:
      - research
      - news
      - aggregation
      - analysis
    integrates_with:
      []
    feeds_into:
      []
    consumes_from:
      []
---
# News Aggregator Skill

> **Purpose:** Aggregate AI news from multiple sources and generate daily digests
> **Method:** Web scraping with agent-browser + API integration where available
> **Output:** Daily digest in Obsidian vault (`research/daily-digests/`)

## Overview

This skill automatically aggregates AI news from 10+ sources daily, filters for relevance, deduplicates, and generates a structured digest. It combines web scraping (agent-browser) with free APIs (Hacker News, ArXiv) to provide comprehensive AI news coverage at $0 cost.

**Target sources:**
1. TechCrunch AI (web scraping)
2. VentureBeat AI (web scraping)
3. Hacker News (API)
4. Company blogs: OpenAI, Anthropic, Google AI (web scraping)
5. ArXiv AI papers (API)

**Output:** Daily markdown digest saved to Obsidian vault

---

## When to Use This Skill

**Daily execution:**
- Run every morning to aggregate yesterday's AI news
- Generates digest for review over coffee
- Identifies trending topics and breaking news

**Ad-hoc execution:**
- Research a specific topic (e.g., "what's new with GPT-4?")
- Catch up after being away
- Deep dive on emerging trends

---

## Core Workflow

### Daily Digest Generation

```bash
# Run the aggregator (outputs to Obsidian vault)
python3 skills/news-aggregator/aggregate.py daily \
    --date 2026-01-28 \
    --output ~/ORICO/OBSIDIAN-VAULT/research/daily-digests/

# Or use skill wrapper
./skills/news-aggregator/run-daily.sh
```

**What happens:**
1. **Fetch** - Scrape/API call to each source
2. **Extract** - Pull article title, link, summary, date
3. **Filter** - Relevance check (AI-related keywords)
4. **Deduplicate** - Remove duplicate articles (same URL or very similar title)
5. **Categorize** - Tag by topic (LLMs, Computer Vision, NLP, etc.)
6. **Tag** - Map to Nine Skills framework where applicable
7. **Generate** - Create markdown digest
8. **Save** - Write to Obsidian vault

---

## News Sources

### Tier 1: Primary Sources (High Quality)

**TechCrunch AI**
- URL: `https://techcrunch.com/category/artificial-intelligence/`
- Method: agent-browser web scraping
- Articles per day: 5-10
- Quality: ⭐⭐⭐⭐⭐

**VentureBeat AI**
- URL: `https://venturebeat.com/category/ai/`
- Method: agent-browser web scraping
- Articles per day: 3-7
- Quality: ⭐⭐⭐⭐⭐

**Hacker News (AI)**
- URL: `https://news.ycombinator.com/`
- Method: Hacker News API (free)
- Articles per day: 10-20 (filtered for AI)
- Quality: ⭐⭐⭐⭐

### Tier 2: Company Blogs (Official)

**OpenAI Blog**
- URL: `https://openai.com/blog`
- Method: agent-browser web scraping
- Articles per day: 0-2 (infrequent but high impact)
- Quality: ⭐⭐⭐⭐⭐

**Anthropic Blog**
- URL: `https://www.anthropic.com/news`
- Method: agent-browser web scraping
- Articles per day: 0-1 (infrequent but high impact)
- Quality: ⭐⭐⭐⭐⭐

**Google AI Blog**
- URL: `https://ai.googleblog.com/`
- Method: agent-browser web scraping
- Articles per day: 1-3
- Quality: ⭐⭐⭐⭐⭐

### Tier 3: Research (ArXiv)

**ArXiv AI Papers**
- URL: `http://export.arxiv.org/api/query`
- Method: ArXiv API (free)
- Papers per day: 50-100 (filter to top 5-10)
- Quality: ⭐⭐⭐⭐⭐ (academic)

---

## Scraping Patterns (agent-browser)

### Pattern 1: Article List Scraping (TechCrunch, VentureBeat)

```bash
# 1. Open category page
agent-browser open "https://techcrunch.com/category/artificial-intelligence/"

# 2. Wait for load
agent-browser wait --load networkidle

# 3. Get snapshot of article list
agent-browser snapshot -i -c --json > techcrunch-articles.json

# Parse JSON to extract:
# - Article titles (headings)
# - Links (href attributes)
# - Summaries (if available)

# 4. Close
agent-browser close
```

**Expected refs in snapshot:**
- `heading [ref=e1]` - Article title
- `link [ref=e2]` - Article URL
- Multiple article blocks

**Python parsing:**
```python
import json

snapshot = json.load(open('techcrunch-articles.json'))
refs = snapshot['data']['refs']

articles = []
for ref_id, ref_data in refs.items():
    if ref_data.get('role') == 'heading' and ref_data.get('level') == 2:
        # This is likely an article title
        title = ref_data.get('name')
        # Find associated link ref...
        articles.append({
            'title': title,
            'source': 'TechCrunch AI'
        })
```

### Pattern 2: Blog Post List (OpenAI, Anthropic, Google AI)

```bash
# 1. Open blog homepage
agent-browser open "https://openai.com/blog"

# 2. Get snapshot
agent-browser snapshot -i -c --json > openai-blog.json

# 3. Extract recent posts (last 7 days)
# Parse for article titles, dates, links

# 4. For each new post, optionally visit full article
agent-browser open "https://openai.com/blog/article-slug"
agent-browser snapshot -i -c -s "article" --json > full-article.json

# 5. Close
agent-browser close
```

### Pattern 3: API-Based (Hacker News, ArXiv)

**Hacker News API:**
```python
import requests

# Get top stories
response = requests.get('https://hacker-news.firebaseio.com/v0/topstories.json')
top_stories = response.json()[:30]  # Top 30

articles = []
for story_id in top_stories:
    story = requests.get(f'https://hacker-news.firebaseio.com/v0/item/{story_id}.json').json()

    # Filter for AI-related
    title = story.get('title', '').lower()
    if any(keyword in title for keyword in ['ai', 'gpt', 'llm', 'machine learning', 'neural']):
        articles.append({
            'title': story['title'],
            'url': story.get('url'),
            'score': story.get('score'),
            'source': 'Hacker News'
        })
```

**ArXiv API:**
```python
import requests
import xml.etree.ElementTree as ET

# Search for recent AI papers
query = 'cat:cs.AI OR cat:cs.LG'
url = f'http://export.arxiv.org/api/query?search_query={query}&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending'

response = requests.get(url)
root = ET.fromstring(response.content)

papers = []
for entry in root.findall('{http://www.w3.org/2005/Atom}entry'):
    title = entry.find('{http://www.w3.org/2005/Atom}title').text
    summary = entry.find('{http://www.w3.org/2005/Atom}summary').text
    link = entry.find('{http://www.w3.org/2005/Atom}id').text

    papers.append({
        'title': title,
        'summary': summary[:200],
        'url': link,
        'source': 'ArXiv'
    })
```

---

## Content Extraction

### For agent-browser scraped content

After getting article URL, extract full content:

```bash
# Open article
agent-browser open "https://techcrunch.com/2026/01/28/some-article"

# Wait for load
agent-browser wait --load networkidle

# Get article content (scoped to article element)
agent-browser snapshot -i -c -s "article" --json > article-content.json

# Or get specific text
agent-browser get text "article h1"  # Title
agent-browser get text "article .article-content"  # Body
```

**Fallback: Get full page text**
```bash
agent-browser get text "body" > article-text.txt
```

---

## Relevance Filtering

### Keyword-Based (Fast, $0 cost)

```python
AI_KEYWORDS = [
    # Core AI
    'artificial intelligence', 'machine learning', 'deep learning',
    'neural network', 'llm', 'large language model',

    # Models
    'gpt', 'claude', 'gemini', 'llama', 'mistral', 'palm',

    # Techniques
    'transformer', 'attention', 'rag', 'fine-tuning', 'prompt engineering',
    'reinforcement learning', 'supervised learning',

    # Applications
    'chatbot', 'code generation', 'image generation', 'text generation',

    # Companies
    'openai', 'anthropic', 'google ai', 'meta ai', 'microsoft ai'
]

def is_ai_relevant(title, summary=''):
    text = (title + ' ' + summary).lower()
    return any(keyword in text for keyword in AI_KEYWORDS)
```

### Score-Based

```python
def calculate_relevance_score(title, summary=''):
    score = 0
    text = (title + ' ' + summary).lower()

    # High-value terms
    if any(term in text for term in ['gpt-', 'claude-', 'gemini']):
        score += 0.3

    # Core AI terms
    if any(term in text for term in ['ai', 'llm', 'machine learning']):
        score += 0.2

    # Technical terms
    if any(term in text for term in ['transformer', 'neural network']):
        score += 0.2

    # Companies
    if any(term in text for term in ['openai', 'anthropic', 'google ai']):
        score += 0.1

    # Techniques
    if any(term in text for term in ['rag', 'fine-tuning', 'prompt']):
        score += 0.2

    return min(score, 1.0)  # Cap at 1.0
```

---

## Deduplication

### URL-Based (Primary)

```python
seen_urls = set()

def is_duplicate_url(url):
    # Normalize URL
    normalized = url.split('?')[0].rstrip('/')

    if normalized in seen_urls:
        return True

    seen_urls.add(normalized)
    return False
```

### Title-Based (Secondary)

```python
from difflib import SequenceMatcher

seen_titles = []

def is_duplicate_title(title, threshold=0.85):
    for seen_title in seen_titles:
        similarity = SequenceMatcher(None, title.lower(), seen_title.lower()).ratio()
        if similarity > threshold:
            return True

    seen_titles.append(title)
    return False
```

---

## Categorization

### Topic Tagging

```python
TOPICS = {
    'LLMs': ['llm', 'language model', 'gpt', 'claude', 'gemini', 'chatbot'],
    'Computer Vision': ['vision', 'image', 'video', 'dall-e', 'stable diffusion'],
    'NLP': ['nlp', 'natural language', 'text generation', 'translation'],
    'Reinforcement Learning': ['rl', 'reinforcement learning', 'rlhf'],
    'Research': ['arxiv', 'paper', 'research', 'study'],
    'Business': ['funding', 'acquisition', 'revenue', 'startup', 'series'],
    'Regulation': ['regulation', 'policy', 'law', 'ethics', 'safety'],
}

def categorize_article(title, summary=''):
    text = (title + ' ' + summary).lower()
    tags = []

    for topic, keywords in TOPICS.items():
        if any(keyword in text for keyword in keywords):
            tags.append(topic)

    return tags if tags else ['General AI']
```

### Nine Skills Mapping

```python
NINE_SKILLS_MAPPING = {
    'Multi-Agent Orchestration': ['multi-agent', 'agent coordination', 'agentic'],
    'Interoperability': ['mcp', 'integration', 'api', 'tool use'],
    'Observability': ['monitoring', 'observability', 'mlops', 'logging'],
    'Memory': ['memory', 'rag', 'retrieval', 'vector database'],
    'Context Economics': ['context', 'token', 'efficiency', 'optimization'],
    'Data Quality': ['data quality', 'grounding', 'hallucination'],
    'Security': ['security', 'adversarial', 'jailbreak', 'safety'],
}

def map_to_nine_skills(title, summary=''):
    text = (title + ' ' + summary).lower()
    skills = []

    for skill, keywords in NINE_SKILLS_MAPPING.items():
        if any(keyword in text for keyword in keywords):
            skills.append(skill)

    return skills
```

---

## Output Format

### Daily Digest Structure

```markdown
# AI News Digest - January 28, 2026

Generated: 2026-01-28 08:00 AM
Sources: 8 sources, 47 articles processed, 23 included
Coverage: Last 24 hours

---

## 🔥 Breaking News

### OpenAI Releases GPT-5
**Source:** OpenAI Blog | **Date:** Jan 28, 2026
**Topics:** LLMs, Research | **Nine Skills:** Multi-Agent Orchestration

OpenAI announced GPT-5 with significant improvements in reasoning, tool use, and multi-agent coordination...

[Read more →](https://openai.com/blog/gpt-5)

---

## 📰 Top Stories

### Anthropic Raises $500M Series D
**Source:** TechCrunch AI | **Date:** Jan 28, 2026
**Topics:** Business, LLMs

Anthropic announced a $500M Series D funding round led by...

[Read more →](https://techcrunch.com/...)

### Google Releases Gemini 2.0 Pro
**Source:** Google AI Blog | **Date:** Jan 28, 2026
**Topics:** LLMs, Research

Google's latest model features improved reasoning and extended context...

[Read more →](https://ai.googleblog.com/...)

---

## 🔬 Research Highlights

### [ArXiv] Efficient Multi-Agent Coordination with LLMs
**Authors:** Smith et al. | **Date:** Jan 27, 2026
**Topics:** Research, Multi-Agent | **Nine Skills:** Multi-Agent Orchestration

Abstract: We present a novel approach to multi-agent coordination...

[Read paper →](https://arxiv.org/abs/2026.12345)

---

## 🏢 Company Updates

### Meta AI Announces New Research Lab
**Source:** VentureBeat AI | **Date:** Jan 28, 2026

Meta is opening a new AI research lab focused on...

[Read more →](https://venturebeat.com/...)

---

## 📊 Trending Topics

1. **GPT-5 Release** (5 mentions)
2. **Multi-Agent Systems** (3 mentions)
3. **AI Safety** (3 mentions)
4. **MCP Integration** (2 mentions)

---

## 🏷️ Nine Skills Coverage

- Multi-Agent Orchestration: 4 articles
- Memory & RAG: 2 articles
- Context Economics: 2 articles
- Interoperability: 2 articles

---

## 📈 Statistics

- **Total articles processed:** 47
- **AI-relevant:** 31 (66%)
- **Included in digest:** 23 (49%)
- **Duplicates removed:** 8
- **Sources:** TechCrunch (8), VentureBeat (5), Hacker News (6), OpenAI (1), ArXiv (3)

---

*Generated by JARVIS news-aggregator skill*
*Saved to: `~/ORICO/OBSIDIAN-VAULT/research/daily-digests/2026-01-28.md`*
```

---

## Python Script Structure

### Main Script: `aggregate.py`

```python
#!/usr/bin/env python3
"""
aggregate.py - AI News Aggregator

Aggregates AI news from multiple sources using agent-browser and APIs.
Generates daily digest in markdown format.

Usage:
    python3 aggregate.py daily --date 2026-01-28
    python3 aggregate.py weekly --start 2026-01-22 --end 2026-01-28
"""

# Main functions:
# - scrape_techcrunch() - Use agent-browser
# - scrape_venturebeat() - Use agent-browser
# - fetch_hackernews() - Use HN API
# - fetch_arxiv() - Use ArXiv API
# - scrape_company_blog(url) - Generic blog scraper
# - filter_relevance(articles) - Apply keyword filter
# - deduplicate(articles) - Remove duplicates
# - categorize(articles) - Add topic tags
# - generate_digest(articles, date) - Create markdown
# - save_to_obsidian(content, date) - Write to vault
```

---

## Error Handling

### Source Failures

```python
def aggregate_from_sources():
    results = {
        'articles': [],
        'errors': []
    }

    sources = [
        ('TechCrunch', scrape_techcrunch),
        ('VentureBeat', scrape_venturebeat),
        ('Hacker News', fetch_hackernews),
        ('ArXiv', fetch_arxiv),
    ]

    for source_name, scrape_func in sources:
        try:
            articles = scrape_func()
            results['articles'].extend(articles)
            print(f"✓ {source_name}: {len(articles)} articles")
        except Exception as e:
            results['errors'].append(f"{source_name}: {str(e)}")
            print(f"✗ {source_name}: {str(e)}")

    return results
```

### Graceful Degradation

- If 1-2 sources fail: Continue with remaining sources
- If >50% sources fail: Alert user, still generate digest
- If all sources fail: Return error, no digest generated

---

## Integration with Obsidian

### File Location

```
~/ORICO/OBSIDIAN-VAULT/research/daily-digests/
├── 2026-01-26.md
├── 2026-01-27.md
└── 2026-01-28.md  # Today's digest
```

### Obsidian Metadata (YAML frontmatter)

```markdown
---
date: 2026-01-28
type: daily-digest
sources: 8
articles: 23
tags: [ai-news, research, daily]
nine-skills: [multi-agent, memory, context-economics]
---

# AI News Digest - January 28, 2026
...
```

---

## Performance

### Speed

- **TechCrunch scrape:** 3-5 seconds
- **VentureBeat scrape:** 3-5 seconds
- **Hacker News API:** 1-2 seconds
- **ArXiv API:** 2-3 seconds
- **Company blogs (3 sources):** 5-10 seconds
- **Processing & dedup:** 1-2 seconds
- **Total:** ~20-30 seconds for full daily digest

### Reliability

- **Target:** 95% daily success rate
- **Fallback:** If agent-browser fails, try API alternatives
- **Monitoring:** Log all errors to `logs/news-aggregator.log`

---

## Quality Standards

See `design-requirements.md` for:
- Relevance scoring thresholds (>0.7)
- Deduplication criteria
- Content extraction quality
- Output format standards
- Error handling patterns

---

## Resources

- **agent-browser docs:** `skills/agent-browser/SKILL.md`
- **Design requirements:** `skills/news-aggregator/design-requirements.md`
- **Example output:** `skills/news-aggregator/example-digest.md`
- **Main script:** `skills/news-aggregator/aggregate.py`
