# WorldNews29

A world news learning project led by Kuldeep, with Ankit observing for now. The first version shows BBC News RSS headlines for World, Business, Technology and Science, with links to original reporting. It uses plain HTML, CSS, JavaScript and a small Python feed collector. No API keys, paid services or npm installation required.

## Try it locally

Install Python 3.10 or newer, download or clone this repository, and open a terminal inside it:

```sh
python scripts/update_news.py
python -m http.server 8000 --directory docs
```

Open http://localhost:8000. On Windows, `py` may be used instead of `python`. Internet access is needed to fetch publisher feeds. Use the local server rather than double-clicking index.html.

## Publish with GitHub Pages

1. Merge the starter pull request into `main`.
2. Open **Actions → Refresh news** and check that the first run succeeds. You can also click **Run workflow**.
3. Open **Settings → Pages**. Select **Deploy from a branch**, branch **main**, folder **/docs**, then **Save**.
4. GitHub will show the published URL once deployment completes.

The workflow attempts a refresh every hour at minute 17. Scheduled Actions can be delayed or disabled by GitHub; check Actions if updates stop. It retains old category headlines after partial failures and leaves the entire file unchanged if every feed fails. The website flags data older than six hours. Refresh on the page reloads the saved feed, rather than contacting publishers directly.

The initial news file is intentionally empty. The first successful collector run populates it with real headlines; no example news is presented as current reporting.

If repository rules block bot commits to main, the workflow needs an approved write path before automatic updates will work. Do not disable protections merely to resolve an error.

## Work together

Kuldeep makes changes while Ankit observes the process for now. No editing task is assigned to Ankit.

1. Kuldeep creates a feature branch, such as `kuldeep-style`.
2. Make a small change, preview it locally, and commit it with a clear message.
3. Open a pull request so Ankit can follow the changed files and discussion.
4. Kuldeep reviews and merges the change into main.

Ankit can view a public repository without collaborator access. A personal-repository collaborator generally has write access, so describing someone as a viewer does not itself restrict their GitHub permissions.

A branch holds your changes; a commit saves a version; a pull request proposes merging that work into main.

## Files

| File | Purpose |
| --- | --- |
| `docs/index.html` | Page structure and wording |
| `docs/styles.css` | Responsive appearance |
| `docs/app.js` | Topic filters, loading and source links |
| `docs/news.json` | Generated headline data; do not edit manually |
| `scripts/update_news.py` | Fetch and validate RSS headlines |
| `.github/workflows/update-news.yml` | Hourly update job |

## Sources

Feeds: https://feeds.bbci.co.uk/news/world/rss.xml, https://feeds.bbci.co.uk/news/business/rss.xml, https://feeds.bbci.co.uk/news/technology/rss.xml and https://feeds.bbci.co.uk/news/science_and_environment/rss.xml.

This is an independent educational project, not affiliated with the BBC. Headlines remain the publisher's content. Full articles and images are not copied. Review publisher feed terms before commercial reuse. Additional publishers and editorial summaries are future enhancements.
