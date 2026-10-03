"""Fetch publisher RSS feeds into the static website; Python standard library only."""
import json
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import urlparse

FEEDS = {
    'World': 'https://feeds.bbci.co.uk/news/world/rss.xml',
    'Business': 'https://feeds.bbci.co.uk/news/business/rss.xml',
    'Technology': 'https://feeds.bbci.co.uk/news/technology/rss.xml',
    'Science': 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
}
OUTPUT = Path(__file__).resolve().parents[1] / 'docs' / 'news.json'


def parse_feed(xml, category):
    stories = []
    for item in ET.fromstring(xml).findall('./channel/item'):
        title = (item.findtext('title') or '').strip()
        url = (item.findtext('link') or '').strip()
        parsed = urlparse(url)
        if not title or parsed.scheme != 'https' or parsed.hostname not in {'www.bbc.com', 'www.bbc.co.uk', 'bbc.com', 'bbc.co.uk'}:
            continue
        try:
            date = parsedate_to_datetime(item.findtext('pubDate') or '')
            if date.tzinfo is None:
                date = date.replace(tzinfo=timezone.utc)
            published = date.astimezone(timezone.utc).isoformat()
        except (ValueError, TypeError, OverflowError):
            published = None
        stories.append(dict(title=title, url=url, category=category, source='BBC News', published=published))
    return stories[:20]


def main():
    previous = json.loads(OUTPUT.read_text()) if OUTPUT.exists() else {'articles': []}
    articles, failed, succeeded = [], [], []
    for category, url in FEEDS.items():
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'WorldNews29/1.0 RSS Reader'})
            with urllib.request.urlopen(request, timeout=25) as response:
                parsed = parse_feed(response.read(2_000_000), category)
            if not parsed:
                raise ValueError('Feed contained no valid articles')
            articles.extend(parsed)
            succeeded.append(category)
        except Exception as error:
            print(f'{category}: {error}', file=sys.stderr)
            failed.append(category)
            articles.extend(a for a in previous['articles'] if a['category'] == category)
    if not succeeded:
        raise SystemExit('All feeds failed; existing news file left unchanged.')
    articles.sort(key=lambda a: a['published'] or '', reverse=True)
    unique = list({a['url']: a for a in reversed(articles)}.values())
    unique.sort(key=lambda a: a['published'] or '', reverse=True)
    result = {'updatedAt': datetime.now(timezone.utc).isoformat(), 'failedCategories': failed, 'articles': unique}
    temporary = OUTPUT.with_suffix('.tmp')
    temporary.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n')
    temporary.replace(OUTPUT)
    print(f'Saved {len(unique)} headlines; {len(failed)} unavailable feeds.')


if __name__ == '__main__':
    main()
