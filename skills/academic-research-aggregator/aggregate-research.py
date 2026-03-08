#!/usr/bin/env python3
"""
aggregate-research.py - Academic Research Aggregator

Aggregates latest research from academic journals via Auburn University library access.
Generates research digest in markdown format.

Usage:
    python3 aggregate-research.py latest --output research-digest.md
    python3 aggregate-research.py latest --journals "Sloan,MIT Tech Review"
"""

import argparse
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
from difflib import SequenceMatcher


# Research relevance keywords (focused on AI, technology, innovation)
RESEARCH_KEYWORDS = [
    # AI/ML Core
    'artificial intelligence', 'machine learning', 'deep learning',
    'neural network', 'llm', 'large language model',
    'natural language processing', 'computer vision', 'reinforcement learning',

    # AI Applications
    'generative ai', 'chatbot', 'conversational ai', 'ai agent',
    'automation', 'predictive analytics', 'recommendation system',

    # Technology & Innovation
    'digital transformation', 'innovation', 'technology adoption',
    'platform economy', 'network effects', 'data-driven',

    # Business & Strategy
    'competitive advantage', 'strategic management', 'business model',
    'organizational learning', 'knowledge management',

    # Information Systems
    'information systems', 'it strategy', 'enterprise systems',
    'decision support', 'business intelligence', 'analytics'
]


# Priority journals configuration
JOURNALS = {
    'Sloan Management Review': {
        'database': 'Business Source Premier',
        'topics': ['Business Strategy', 'Management', 'Innovation'],
        'priority': 1
    },
    'MIT Technology Review': {
        'database': 'Academic Search Premier',
        'topics': ['Technology', 'Innovation', 'AI'],
        'priority': 1
    },
    'MIS Quarterly': {
        'database': 'Business Source Premier',
        'topics': ['Information Systems', 'Research'],
        'priority': 1
    },
    'Harvard Business Review': {
        'database': 'Business Source Premier',
        'topics': ['Business', 'Management', 'Leadership'],
        'priority': 1
    },
    'Information Systems Research': {
        'database': 'Business Source Premier',
        'topics': ['Information Systems', 'Research'],
        'priority': 1
    }
}


def run_agent_browser(command: str, timeout: int = 30, profile: str = None) -> str:
    """Run agent-browser command and return output."""
    try:
        if profile:
            full_command = f"agent-browser --profile {profile} {command}"
        else:
            full_command = f"agent-browser {command}"

        result = subprocess.run(
            full_command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=timeout
        )
        return result.stdout.strip()
    except subprocess.TimeoutExpired:
        print(f"  Warning: Command timed out: {command}")
        return ""
    except Exception as e:
        print(f"  Error running agent-browser: {e}")
        return ""


def is_research_relevant(text: str, threshold: float = 0.2) -> bool:
    """Check if text is research-relevant based on keywords."""
    text_lower = text.lower()
    score = 0

    for keyword in RESEARCH_KEYWORDS:
        if keyword in text_lower:
            score += 0.15

    return score >= threshold


def calculate_relevance_score(title: str, abstract: str = '', keywords: str = '') -> float:
    """Calculate relevance score for research article."""
    text = (title + ' ' + abstract + ' ' + keywords).lower()
    score = 0

    # High-value AI terms
    if any(term in text for term in ['artificial intelligence', 'machine learning', 'deep learning']):
        score += 0.3

    # Generative AI
    if any(term in text for term in ['generative ai', 'llm', 'large language model', 'gpt']):
        score += 0.3

    # Business/Strategy
    if any(term in text for term in ['digital transformation', 'innovation', 'competitive advantage']):
        score += 0.2

    # Information systems
    if any(term in text for term in ['information systems', 'it strategy', 'decision support']):
        score += 0.2

    return min(score, 1.0)


def deduplicate_articles(articles: List[Dict]) -> List[Dict]:
    """Remove duplicate articles based on title similarity."""
    seen_titles = []
    unique_articles = []

    for article in articles:
        title = article.get('title', '')
        is_duplicate = False

        for seen_title in seen_titles:
            similarity = SequenceMatcher(None, title.lower(), seen_title.lower()).ratio()
            if similarity > 0.85:
                is_duplicate = True
                break

        if is_duplicate:
            continue

        seen_titles.append(title)
        unique_articles.append(article)

    duplicates_removed = len(articles) - len(unique_articles)
    if duplicates_removed > 0:
        print(f"  Removed {duplicates_removed} duplicates")

    return unique_articles


def scrape_journal(journal_name: str, profile: str) -> List[Dict]:
    """Scrape latest articles from a specific journal via library portal."""
    print(f"Scraping {journal_name}...")

    articles = []

    try:
        if journal_name == 'MIS Quarterly':
            articles = scrape_misq(profile)
        elif journal_name == 'Harvard Business Review':
            articles = scrape_hbr(profile)
        elif journal_name == 'MIT Technology Review':
            articles = scrape_mit_tech_review(profile)
        elif journal_name == 'Sloan Management Review':
            articles = scrape_sloan(profile)
        elif journal_name == 'Information Systems Research':
            articles = scrape_isr(profile)
        else:
            print(f"  Journal not yet implemented: {journal_name}")

        print(f"  Found {len(articles)} articles from {journal_name}")

    except Exception as e:
        print(f"  Error scraping {journal_name}: {e}")

    return articles


def scrape_misq(profile: str) -> List[Dict]:
    """Scrape latest MIS Quarterly articles."""
    articles = []

    try:
        # Navigate to MIS Quarterly journal page
        # URL from screenshots: research.ebsco.com/c/j6vsfb/search/advanced/publications/MISQ
        run_agent_browser('open "https://research.ebsco.com/c/j6vsfb/search/advanced/publications/MISQ?autocorrect=n&selectedDb=buhjnh" --load networkidle', timeout=20, profile=profile)

        # Get snapshot to find latest issues
        snapshot_json = run_agent_browser('snapshot -i -c --json', profile=profile)
        if not snapshot_json:
            print("  Warning: Empty snapshot from MIS Quarterly page")
            return articles

        snapshot = json.loads(snapshot_json)
        refs = snapshot.get('data', {}).get('refs', {})

        # Find latest issue links (e.g., "Vol. 49 Issue 4 – Dec2025")
        # We'll scrape the top 2 issues
        issue_links = []
        for ref_id, ref_data in refs.items():
            name = ref_data.get('name', '')
            if 'Vol.' in name and 'Issue' in name and '2025' in name:
                issue_links.append((ref_id, name))
                if len(issue_links) >= 2:  # Top 2 issues
                    break

        print(f"  Found {len(issue_links)} recent issues to scrape")

        # For each issue, extract articles
        for issue_ref, issue_name in issue_links:
            print(f"    Scraping: {issue_name}")

            # Click the issue link
            run_agent_browser(f'click @{issue_ref}', profile=profile)
            run_agent_browser('wait --load networkidle', timeout=15, profile=profile)

            # Get article list snapshot
            articles_json = run_agent_browser('snapshot -i -c --json', profile=profile)
            if not articles_json:
                continue

            article_snapshot = json.loads(articles_json)
            article_refs = article_snapshot.get('data', {}).get('refs', {})

            # Extract articles from search results
            # Look for article titles (long link text, all caps or title case)
            for ref_id, ref_data in article_refs.items():
                role = ref_data.get('role', '')
                name = ref_data.get('name', '')

                # Article titles are long links (>40 chars) and not navigation elements
                if (role == 'link' and
                    len(name) > 40 and
                    not name.startswith('Vol.') and
                    not name.startswith('By:') and
                    'MIS Quarterly' not in name):

                    # This is likely an article title
                    # We'll need to extract more metadata by looking at surrounding elements
                    # For now, collect the title
                    articles.append({
                        'title': name,
                        'journal': 'MIS Quarterly',
                        'journal_priority': 1,
                        'issue': issue_name,
                        'authors': 'To be extracted',  # Will extract in next iteration
                        'abstract': 'To be extracted',  # Will extract in next iteration
                        'publication_date': issue_name.split('–')[-1].strip() if '–' in issue_name else '2025',
                        'url': 'https://research.ebsco.com/',  # Placeholder
                        'topics': ['Information Systems', 'Research'],
                        'relevance_score': 0.5  # Default, will be calculated
                    })

            # Go back to journal page for next issue
            run_agent_browser('back', profile=profile)
            run_agent_browser('wait --load networkidle', timeout=10, profile=profile)

    except Exception as e:
        print(f"  Error in scrape_misq: {e}")

    return articles


def scrape_hbr(profile: str) -> List[Dict]:
    """Scrape latest Harvard Business Review articles."""
    # Placeholder - will implement after MIS Quarterly works
    print("  Harvard Business Review scraping not yet implemented")
    return []


def scrape_mit_tech_review(profile: str) -> List[Dict]:
    """Scrape latest MIT Technology Review articles."""
    # Placeholder - will implement after MIS Quarterly works
    print("  MIT Technology Review scraping not yet implemented")
    return []


def scrape_sloan(profile: str) -> List[Dict]:
    """Scrape latest Sloan Management Review articles."""
    # Placeholder - will implement after MIS Quarterly works
    print("  Sloan Management Review scraping not yet implemented")
    return []


def scrape_isr(profile: str) -> List[Dict]:
    """Scrape latest Information Systems Research articles."""
    # Placeholder - will implement after MIS Quarterly works
    print("  Information Systems Research scraping not yet implemented")
    return []


def generate_research_digest(articles: List[Dict], date: str) -> str:
    """Generate markdown research digest from articles."""

    # Sort by relevance score (if available) then by journal priority
    articles_sorted = sorted(
        articles,
        key=lambda x: (x.get('relevance_score', 0), -x.get('journal_priority', 5)),
        reverse=True
    )

    # Generate markdown
    md = f"# Academic Research Digest - {date}\n\n"
    md += f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
    md += f"Articles: {len(articles)}\n"
    md += f"Journals: {len(set(a['journal'] for a in articles))}\n\n"
    md += "---\n\n"

    # Group by journal
    journals_with_articles = {}
    for article in articles_sorted:
        journal = article.get('journal', 'Unknown')
        if journal not in journals_with_articles:
            journals_with_articles[journal] = []
        journals_with_articles[journal].append(article)

    # Output by journal
    for journal, journal_articles in journals_with_articles.items():
        md += f"## 📚 {journal}\n\n"

        for article in journal_articles:
            title = article.get('title', 'Untitled')
            authors = article.get('authors', 'Unknown')
            abstract = article.get('abstract', 'No abstract available')
            url = article.get('url', '#')
            pub_date = article.get('publication_date', 'Unknown')
            topics = article.get('topics', [])

            md += f"### {title}\n"
            md += f"**Authors:** {authors}\n"
            md += f"**Published:** {pub_date}\n"
            if topics:
                md += f"**Topics:** {', '.join(topics)}\n"
            md += f"\n**Abstract:** {abstract[:300]}{'...' if len(abstract) > 300 else ''}\n\n"
            md += f"[Read full article →]({url})\n\n"
            md += "---\n\n"

    # Statistics
    md += "## 📊 Statistics\n\n"
    md += f"- **Total articles:** {len(articles)}\n"
    md += f"- **Journals covered:** {', '.join(journals_with_articles.keys())}\n\n"

    md += "---\n\n"
    md += "*Generated by JARVIS academic-research-aggregator skill*\n"
    md += "*Source: Auburn University Library Research Databases*\n"

    return md


def main():
    parser = argparse.ArgumentParser(description='Aggregate academic research from university library')
    parser.add_argument('mode', choices=['latest'], help='Aggregation mode')
    parser.add_argument('--output', help='Output file path', default='research-digest.md')
    parser.add_argument('--profile', help='Agent-browser profile path',
                       default='~/.jarvis-auburn-library')
    parser.add_argument('--journals', help='Comma-separated journal names (default: all)',
                       default=None)

    args = parser.parse_args()

    # Expand profile path
    profile_path = Path(args.profile).expanduser()

    # Parse journal filter
    if args.journals:
        target_journals = [j.strip() for j in args.journals.split(',')]
    else:
        target_journals = list(JOURNALS.keys())

    print(f"Academic Research Aggregator - {datetime.now().strftime('%Y-%m-%d')}")
    print("=" * 60)
    print(f"Profile: {profile_path}")
    print(f"Journals: {', '.join(target_journals)}")
    print()

    # Check if profile exists
    if not profile_path.exists():
        print(f"❌ Profile not found: {profile_path}")
        print()
        print("Please run setup first:")
        print("  ./setup-profile.sh")
        print()
        sys.exit(1)

    # Aggregate from all journals
    all_articles = []

    for journal_name in target_journals:
        if journal_name not in JOURNALS:
            print(f"⚠️  Unknown journal: {journal_name}")
            continue

        journal_articles = scrape_journal(journal_name, str(profile_path))
        all_articles.extend(journal_articles)

    print()
    print(f"Total articles collected: {len(all_articles)}")

    # Filter for relevance
    print("Filtering for research relevance...")
    relevant_articles = [a for a in all_articles if is_research_relevant(
        a.get('title', '') + ' ' + a.get('abstract', '')
    )]
    print(f"  Relevant articles: {len(relevant_articles)}")

    # Deduplicate
    print("Removing duplicates...")
    unique_articles = deduplicate_articles(relevant_articles)

    # Generate digest
    print("Generating research digest...")
    digest_md = generate_research_digest(unique_articles, datetime.now().strftime('%Y-%m-%d'))

    # Save to file
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(digest_md)

    print(f"\n✓ Research digest saved to: {output_path}")
    print(f"  Articles included: {len(unique_articles)}")


if __name__ == '__main__':
    main()
