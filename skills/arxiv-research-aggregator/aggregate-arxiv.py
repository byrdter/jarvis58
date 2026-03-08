#!/usr/bin/env python3
"""
arXiv Research Aggregator

Searches arXiv for AI/ML research papers and generates weekly digests.
Uses arXiv API (public, no authentication required).

Usage:
    python3 aggregate-arxiv.py --days 7 --max-results 50
"""

import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from pathlib import Path
import argparse
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# arXiv API endpoint
ARXIV_API = "http://export.arxiv.org/api/query"

# Search categories (AI/ML focused)
SEARCH_CATEGORIES = [
    "cs.AI",  # Artificial Intelligence
    "cs.LG",  # Machine Learning
    "cs.CL",  # Computation and Language (NLP)
    "cs.CV",  # Computer Vision
    "cs.NE",  # Neural and Evolutionary Computing
    "stat.ML"  # Machine Learning (Statistics)
]

# Search terms for agentic AI and related topics
AGENTIC_KEYWORDS = [
    "agentic",
    "multi-agent",
    "agent system",
    "autonomous agent",
    "llm agent",
    "tool use",
    "function calling",
    "agent framework"
]

def search_arxiv(query, max_results=50, days_back=7):
    """
    Search arXiv API for papers matching query.

    Args:
        query: Search query string
        max_results: Maximum number of results to return
        days_back: Only include papers from last N days

    Returns:
        List of paper dictionaries
    """
    # Build search query (combine categories with OR)
    category_query = " OR ".join([f"cat:{cat}" for cat in SEARCH_CATEGORIES])

    # Add date filter (submitted in last N days)
    cutoff_date = datetime.now() - timedelta(days=days_back)

    # Combine query with categories
    full_query = f"({query}) AND ({category_query})"

    # URL encode the query
    params = {
        "search_query": full_query,
        "start": 0,
        "max_results": max_results,
        "sortBy": "submittedDate",
        "sortOrder": "descending"
    }

    url = f"{ARXIV_API}?{urllib.parse.urlencode(params)}"

    print(f"Searching arXiv: {full_query[:100]}...")
    print(f"Date filter: Papers from last {days_back} days")

    try:
        with urllib.request.urlopen(url) as response:
            xml_data = response.read()

        # Parse XML response
        root = ET.fromstring(xml_data)

        # Extract namespace
        ns = {'atom': 'http://www.w3.org/2005/Atom',
              'arxiv': 'http://arxiv.org/schemas/atom'}

        papers = []
        for entry in root.findall('atom:entry', ns):
            # Extract paper metadata
            paper = {
                'title': entry.find('atom:title', ns).text.strip().replace('\n', ' '),
                'authors': [author.find('atom:name', ns).text for author in entry.findall('atom:author', ns)],
                'summary': entry.find('atom:summary', ns).text.strip().replace('\n', ' '),
                'published': entry.find('atom:published', ns).text,
                'updated': entry.find('atom:updated', ns).text,
                'link': entry.find('atom:id', ns).text,
                'pdf_link': None,
                'categories': []
            }

            # Get PDF link
            for link in entry.findall('atom:link', ns):
                if link.get('title') == 'pdf':
                    paper['pdf_link'] = link.get('href')
                    break

            # Get categories
            for category in entry.findall('atom:category', ns):
                paper['categories'].append(category.get('term'))

            # Parse date and filter
            published_date = datetime.fromisoformat(paper['published'].replace('Z', '+00:00'))
            if published_date.replace(tzinfo=None) >= cutoff_date:
                papers.append(paper)

        print(f"  Found {len(papers)} papers (after date filter)")
        return papers

    except Exception as e:
        print(f"  Error searching arXiv: {e}")
        return []

def generate_markdown_digest(papers, output_path):
    """Generate markdown digest from papers."""

    # Group papers by category
    by_category = {}
    for paper in papers:
        primary_cat = paper['categories'][0] if paper['categories'] else 'Unknown'
        if primary_cat not in by_category:
            by_category[primary_cat] = []
        by_category[primary_cat].append(paper)

    # Generate markdown
    md = f"# arXiv AI Research Digest - {datetime.now().strftime('%Y-%m-%d')}\n\n"
    md += f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
    md += f"Papers: {len(papers)}\n"
    md += f"Categories: {', '.join(by_category.keys())}\n\n"
    md += "---\n\n"

    # Category names mapping
    cat_names = {
        'cs.AI': 'Artificial Intelligence',
        'cs.LG': 'Machine Learning',
        'cs.CL': 'Natural Language Processing',
        'cs.CV': 'Computer Vision',
        'cs.NE': 'Neural Computing',
        'stat.ML': 'Statistical ML'
    }

    # Write papers by category
    for category, category_papers in sorted(by_category.items()):
        cat_name = cat_names.get(category, category)
        md += f"## {cat_name} ({len(category_papers)} papers)\n\n"

        for paper in category_papers:
            # Format authors (first 3, then et al.)
            authors = paper['authors'][:3]
            author_str = ', '.join(authors)
            if len(paper['authors']) > 3:
                author_str += f" et al. ({len(paper['authors'])} total)"

            # Published date
            pub_date = datetime.fromisoformat(paper['published'].replace('Z', '+00:00'))
            pub_date_str = pub_date.strftime('%Y-%m-%d')

            md += f"### {paper['title']}\n"
            md += f"**Authors:** {author_str}\n\n"
            md += f"**Published:** {pub_date_str}\n\n"
            md += f"**Summary:** {paper['summary'][:300]}{'...' if len(paper['summary']) > 300 else ''}\n\n"
            md += f"[📄 Paper]({paper['link']}) | "
            if paper['pdf_link']:
                md += f"[📥 PDF]({paper['pdf_link']})"
            md += "\n\n---\n\n"

    # Statistics
    md += "## 📊 Statistics\n\n"
    md += f"- **Total papers:** {len(papers)}\n"
    for category, category_papers in sorted(by_category.items()):
        cat_name = cat_names.get(category, category)
        md += f"- **{cat_name}:** {len(category_papers)} papers\n"

    # Write to file
    output_path.write_text(md)
    print(f"\n✓ Digest saved to: {output_path}")
    print(f"  Papers included: {len(papers)}")

def send_email_digest(digest_path, paper_count):
    """Send email with digest file"""
    # Load environment variables
    env_path = Path.home() / "Library" / "CloudStorage" / "Dropbox" / "jarvis" / ".env"
    load_dotenv(env_path)

    smtp_server = os.getenv('EMAIL_SMTP_SERVER')
    smtp_port = int(os.getenv('EMAIL_SMTP_PORT', 587))
    from_email = os.getenv('EMAIL_FROM')
    password = os.getenv('EMAIL_PASSWORD')
    to_email = os.getenv('EMAIL_TO')

    if not all([smtp_server, from_email, password, to_email]):
        print("⚠️  Email configuration incomplete in .env file")
        return False

    try:
        # Read digest content
        with open(digest_path, 'r') as f:
            digest_content = f.read()

        # Create email
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'📚 Weekly arXiv AI Research Digest - {paper_count} New Papers'
        msg['From'] = from_email
        msg['To'] = to_email

        # Plain text version
        text_body = digest_content

        # HTML version (basic formatting)
        html_body = f"""
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }}
        h1 {{ color: #00d4ff; }}
        h2 {{ color: #0099cc; border-bottom: 2px solid #00d4ff; padding-bottom: 5px; margin-top: 30px; }}
        h3 {{ color: #333; margin-top: 20px; }}
        a {{ color: #0066cc; text-decoration: none; }}
        a:hover {{ text-decoration: underline; }}
        pre {{ white-space: pre-wrap; font-family: Arial, sans-serif; }}
    </style>
</head>
<body>
<pre>{digest_content}</pre>
</body>
</html>
"""

        msg.attach(MIMEText(text_body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))

        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(from_email, password)
            server.send_message(msg)

        print(f"✉️  Email sent to {to_email}")
        return True

    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Aggregate AI/ML research from arXiv")
    parser.add_argument('--days', type=int, default=7,
                       help='Include papers from last N days (default: 7)')
    parser.add_argument('--max-results', type=int, default=50,
                       help='Maximum papers to retrieve (default: 50)')
    parser.add_argument('--query', type=str, default='',
                       help='Additional search query terms')
    parser.add_argument('--output', type=str,
                       help='Output file path (default: auto-generated)')

    args = parser.parse_args()

    # Build search query
    query = args.query if args.query else "machine learning OR deep learning OR neural network"

    # Search arXiv
    papers = search_arxiv(query, max_results=args.max_results, days_back=args.days)

    if not papers:
        print("No papers found matching criteria")
        sys.exit(1)

    # Determine output path
    if args.output:
        output_path = Path(args.output)
    else:
        # Try Obsidian vault first, fallback to jarvis folder
        obsidian_path = Path.home() / "ORICO" / "OBSIDIAN-VAULT" / "research" / "arxiv"
        jarvis_path = Path.home() / "Dropbox" / "jarvis" / "research-digests"

        if obsidian_path.exists():
            output_dir = obsidian_path
        else:
            output_dir = jarvis_path
            output_dir.mkdir(parents=True, exist_ok=True)

        output_path = output_dir / f"arxiv-digest-{datetime.now().strftime('%Y-%m-%d')}.md"

    # Generate digest
    generate_markdown_digest(papers, output_path)

    # Send email with digest
    send_email_digest(output_path, len(papers))

if __name__ == "__main__":
    main()
