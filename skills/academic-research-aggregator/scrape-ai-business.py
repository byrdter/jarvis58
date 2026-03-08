#!/usr/bin/env python3
"""
Academic Research Aggregator - AI in Business Topic
Scrapes Auburn Library's Business Source Premier for AI-related articles
"""

import json
import re
from datetime import datetime
from playwright.sync_api import sync_playwright
from pathlib import Path

# Configuration
CDP_ENDPOINT = "http://localhost:9223"

# Obsidian vault integration
# Update this path to your Obsidian vault location
OBSIDIAN_VAULT = Path.home() / "ORICO" / "OBSIDIAN-VAULT" / "research" / "academic"

# Fallback to jarvis folder if Obsidian path doesn't exist
if OBSIDIAN_VAULT.exists():
    OUTPUT_DIR = OBSIDIAN_VAULT
else:
    OUTPUT_DIR = Path.home() / "Dropbox/jarvis/research-digests"
    print(f"⚠️  Obsidian vault not found at {OBSIDIAN_VAULT}")
    print(f"   Saving to: {OUTPUT_DIR}")
    print()

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def extract_articles(page, max_articles=50):
    """Extract articles from current EBSCO results page"""

    articles = []

    # Scroll to load more results
    for _ in range(3):
        page.evaluate('window.scrollBy(0, 1000)')
        page.wait_for_timeout(1000)

    # Get all h3 headings (article titles)
    print("Finding article titles...")
    h3_elements = page.locator('h3').all()

    for h3 in h3_elements[:max_articles]:
        try:
            title = h3.inner_text().strip()

            # Skip if too short or not relevant
            if len(title) < 15:
                continue

            # Get link (h3 is wrapped by anchor tag)
            link = ''
            parent_anchor = h3.locator('xpath=ancestor::a[1]').first
            if parent_anchor.count() > 0:
                href = parent_anchor.get_attribute('href')
                if href:
                    link = f"https://research.ebsco.com{href}" if href.startswith('/') else href

            # Try to get surrounding metadata
            # The metadata is typically in sibling elements or nearby text
            parent_container = h3.locator('xpath=ancestor::*[5]').first

            metadata = {
                'authors': '',
                'publication': '',
                'date': '',
                'abstract': ''
            }

            if parent_container.count() > 0:
                # Get all text and parse for patterns
                all_text = parent_container.inner_text()

                # Look for common patterns
                # "By: Author Name"
                by_match = re.search(r'By:\s*([^\n]+)', all_text)
                if by_match:
                    metadata['authors'] = by_match.group(1).strip()[:150]

                # "In: Publication Name"
                in_match = re.search(r'In:\s*([^\n,]+)', all_text)
                if in_match:
                    metadata['publication'] = in_match.group(1).strip()[:100]

                # Common publication names
                for pub_name in ['Harvard Business Review', 'MIT Technology Review', 'MIS Quarterly',
                                'Forbes', 'Entrepreneur', 'Fortune', 'Bloomberg', 'Management Science']:
                    if pub_name in all_text and not metadata['publication']:
                        metadata['publication'] = pub_name

                # Look for dates
                date_patterns = [
                    r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[/\s-]*(\d{1,2})[/,\s-]*(\d{4})',
                    r'(\d{1,2})/(\d{1,2})/(\d{4})',
                    r'(202[0-9])',
                ]
                for pattern in date_patterns:
                    date_match = re.search(pattern, all_text)
                    if date_match:
                        metadata['date'] = date_match.group(0)
                        break

            article = {
                'title': title,
                'authors': metadata['authors'],
                'publication': metadata['publication'],
                'date': metadata['date'],
                'link': link,
                'extracted_at': datetime.now().isoformat()
            }

            articles.append(article)
            print(f"  {len(articles)}. {title[:60]}...")

        except Exception as e:
            continue

    return articles


def generate_markdown_digest(articles, output_path):
    """Generate markdown digest from articles"""

    today = datetime.now().strftime("%Y-%m-%d")

    md = f"""# AI in Business Research Digest
**Generated:** {today}
**Source:** Auburn University Libraries - Business Source Premier
**Topic:** Artificial Intelligence in Business
**Articles Found:** {len(articles)}

---

"""

    # Group by publication if available
    with_pub = [a for a in articles if a['publication']]
    without_pub = [a for a in articles if not a['publication']]

    if with_pub:
        md += "## 📚 Academic & Business Publications\n\n"
        for article in with_pub:
            md += f"### {article['title']}\n\n"
            if article['authors']:
                md += f"**Authors:** {article['authors']}  \n"
            if article['publication']:
                md += f"**Publication:** {article['publication']}  \n"
            if article['date']:
                md += f"**Date:** {article['date']}  \n"
            if article['link']:
                md += f"**Link:** [{article['link'][:50]}...]({article['link']})  \n"
            md += "\n---\n\n"

    if without_pub:
        md += "## 📰 Other Sources\n\n"
        for article in without_pub:
            md += f"### {article['title']}\n\n"
            if article['date']:
                md += f"**Date:** {article['date']}  \n"
            if article['link']:
                md += f"**Link:** [{article['link'][:50]}...]({article['link']})  \n"
            md += "\n---\n\n"

    # Save markdown
    with open(output_path, 'w') as f:
        f.write(md)

    print(f"\n✅ Markdown digest saved to: {output_path}")

    # Also save JSON
    json_path = output_path.with_suffix('.json')
    with open(json_path, 'w') as f:
        json.dump(articles, f, indent=2)

    print(f"✅ JSON data saved to: {json_path}")


def main():
    """Main function"""

    print("="*60)
    print("AI in Business Research Aggregator")
    print("="*60)
    print()

    with sync_playwright() as p:
        # Connect to existing Chrome with Auburn Library session
        print("Connecting to Chrome...")
        try:
            browser = p.chromium.connect_over_cdp(CDP_ENDPOINT)
        except Exception as e:
            print(f"\n❌ Error: Could not connect to Chrome on port 9223")
            print(f"Make sure Chrome is running with:")
            print(f'  /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome \\')
            print(f'    --user-data-dir="$HOME/.jarvis-auburn-profile" \\')
            print(f'    --remote-debugging-port=9223 &')
            return

        context = browser.contexts[0]

        # Find the EBSCO search results page
        page = None
        for p in context.pages:
            if 'research.ebsco.com' in p.url:
                page = p
                break

        if not page:
            # Fallback to last page if EBSCO not found
            page = context.pages[-1] if context.pages else context.new_page()

        print(f"Current page: {page.url[:60]}...")
        print()

        # Extract articles
        print("Extracting articles...")
        articles = extract_articles(page, max_articles=30)

        print(f"\n✅ Extracted {len(articles)} articles")

        if not articles:
            print("\n⚠️  No articles found. Make sure you're on the EBSCO search results page.")
            return

        # Generate digest
        today = datetime.now().strftime("%Y-%m-%d")
        output_file = OUTPUT_DIR / f"ai-business-digest-{today}.md"

        generate_markdown_digest(articles, output_file)

        print(f"\n{'='*60}")
        print(f"Research digest complete!")
        print(f"View your digest at: {output_file}")
        print(f"{'='*60}")


if __name__ == "__main__":
    main()
