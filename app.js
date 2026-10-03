'use strict';
let articles = [];
let category = 'All';
const stories = document.querySelector('#stories');
const status = document.querySelector('#status');
const updated = document.querySelector('#updated');
const refresh = document.querySelector('#refresh');
const dateFormat = new Intl.DateTimeFormat(undefined, {dateStyle:'medium', timeStyle:'short'});
function displayDate(value) {
  const date = new Date(value);
  return value && !Number.isNaN(date.getTime()) ? dateFormat.format(date) : 'Date unavailable';
}
function safeUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && ['www.bbc.com','www.bbc.co.uk','bbc.com','bbc.co.uk'].includes(url.hostname) ? url.href : null; }
  catch { return null; }
}
function render() {
  stories.replaceChildren();
  const selected = articles.filter(a => category === 'All' || a.category === category);
  for (const article of selected) {
    const url = safeUrl(article.url);
    if (!url || typeof article.title !== 'string') continue;
    const card = document.createElement('article'); card.className = 'story';
    const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = article.category;
    const heading = document.createElement('h2');
    const link = document.createElement('a'); link.href = url; link.textContent = article.title;
    heading.append(link);
    const meta = document.createElement('p'); meta.className = 'byline'; meta.textContent = `${article.source} · ${displayDate(article.published)}`;
    const read = document.createElement('a'); read.className = 'read'; read.href = url; read.textContent = 'Read at BBC News';
    card.append(tag, heading, meta, read); stories.append(card);
  }
  if (!stories.children.length) {
    const empty = document.createElement('p'); empty.textContent = articles.length ? 'No headlines in this topic yet.' : 'No headlines have been loaded yet. Please check back after the first news update.'; stories.append(empty);
  }
}
async function load() {
  refresh.disabled = true; status.textContent = 'Loading headlines…';
  try {
    const response = await fetch('./news.json', {cache:'no-store'});
    if (!response.ok) throw new Error('News request failed');
    const data = await response.json();
    if (!Array.isArray(data.articles)) throw new Error('Invalid news data');
    articles = data.articles.filter(a => a && typeof a === 'object');
    updated.textContent = data.updatedAt ? `Last fetched: ${displayDate(data.updatedAt)}` : 'Waiting for the first news update';
    const messages = [];
    if (data.updatedAt && Date.now() - new Date(data.updatedAt).getTime() > 6*60*60*1000) messages.push('Updates are delayed. These headlines may be out of date.');
    if (data.failedCategories?.length) messages.push(`Some feeds could not refresh: ${data.failedCategories.join(', ')}. Older headlines may be shown.`);
    status.textContent = messages.join(' '); render();
  } catch {
    status.textContent = 'News could not be loaded. Please try Refresh in a moment.';
    if (!articles.length) updated.textContent = 'News currently unavailable';
  } finally { refresh.disabled = false; }
}
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
  category = button.dataset.category;
  document.querySelectorAll('[data-category]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  render();
}));
refresh.addEventListener('click', load);
load();
