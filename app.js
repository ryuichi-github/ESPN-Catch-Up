import { DEMO_RESPONSE, DEMO_FEED_DATE, DEMO_CIRCLES } from './data/demo-feed.js';
import { parseGeminiResponse, normalizeGame, findVideos, gameKey, headline } from './match.js';

const SPORTS = ['NBA', 'NFL', 'MLB', 'CFB'];
const SPORT_LABEL = { NBA: 'NBA', NFL: 'NFL', MLB: 'MLB', CFB: 'College Football' };
const STOCK_PHOTO = { NFL: 'assets/football.jpg', CFB: 'assets/football.jpg', MLB: 'assets/baseball.jpg', NBA: 'assets/basketball.webp' };
const PLAY_MS = 3000; // length of the simulated viewing
const MAX_CIRCLES = 3;

// ---------- storage ----------

const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch {}
  },
};

const getCircles = () => store.get('circles', []);
const getWatchlist = () => store.get('watchlist', []); // [{ key, game, addedAt, watchedAt, videoId }]

// Back to the first-run state: no watchlist, the two default circles, nothing playing.
function resetDemo() {
  stopPlayback();
  Object.assign(watchState, { selected: {}, active: null, timer: null, justWatched: null });
  for (const key of ['watchlist', 'watched', 'apiKey', 'feed']) store.remove(key);
  store.set('circles', DEMO_CIRCLES);
  updateBadge();
  render();
  showToast('Demo reset');
}

// Earlier versions kept a flat "watched" history; fold it into the watchlist as already-watched items.
function migrateHistory() {
  const old = store.get('watched', null);
  if (!old) return;
  const items = old.map((w) => {
    const game = w.game || normalizeGame({ sport: w.sport, teams: w.teams, circle: w.circle, date: '' });
    return game && { key: w.key, game, addedAt: w.watchedAt, watchedAt: w.watchedAt, videoId: w.videoId || null };
  }).filter(Boolean);
  store.set('watchlist', [...getWatchlist(), ...items]);
  store.remove('watched');
}

// Keep saved state in step with the demo circles. A saved circle with the same sports and teams as a
// demo circle takes the demo circle's current name. Saved watchlist games that are in the demo feed
// take their circle tags from it, and tags naming a circle that no longer exists are dropped.
// The cached live feed is cleared because its tags may be out of date.
function syncDemoCircleNames() {
  const circles = store.get('circles', null);
  if (!circles) return;
  const sameSetup = (a, b) => JSON.stringify([a.sports, a.teams]) === JSON.stringify([b.sports, b.teams]);
  const next = circles.map((c) => {
    const demo = DEMO_CIRCLES.find((d) => sameSetup(c, d));
    return demo ? { ...c, name: demo.name } : c;
  });
  const names = new Set(next.map((c) => c.name));
  const demoTags = new Map(parseGeminiResponse(DEMO_RESPONSE).map((g) => [gameKey(g), g.circles]));
  const list = getWatchlist();
  const fixed = list.map((w) => {
    if (w.game.circles.every((n) => names.has(n))) return w;
    const circlesFor = demoTags.get(w.key) || w.game.circles.filter((n) => names.has(n));
    return { ...w, game: { ...w.game, circles: circlesFor } };
  });
  if (JSON.stringify(next) !== JSON.stringify(circles)) { store.set('circles', next); store.remove('feed'); }
  if (JSON.stringify(fixed) !== JSON.stringify(list)) store.set('watchlist', fixed);
}

// ---------- helpers ----------

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isoDate = (d) => d.toLocaleDateString('en-CA'); // YYYY-MM-DD, local time
const nextDay = (iso) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + 1); return isoDate(d); };
const longDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
const shortDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const videoLabel = (v) => `${v.type === 'highlight' ? 'Highlights' : 'Full replay'} · ${v.duration} min`;

// Card image: the real ESPN YouTube thumbnail when there is one, otherwise a sport stock photo.
function imageFor(game, videos) {
  const yt = videos.find((v) => v.youtubeId)?.youtubeId;
  return yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : STOCK_PHOTO[game.sport] || STOCK_PHOTO.NFL;
}

const tagsHTML = (game) => game.circles.map((c) => `<span class="tag">${esc(c)}</span>`).join('');

const ICONS = {
  feed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/></svg>',
  watchlist: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z" class="fill"/></svg>',
  circles: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="9" r="3.5"/><circle cx="17" cy="10" r="2.5"/><path d="M2.5 19c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5M15 14.2c2.9-.4 5.4 1.1 6.3 4.3"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
  reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"/></svg>',
};

// ---------- feed screen ----------

// Every user sees the same fixed feed (data/demo-feed.js).
function currentFeed() {
  return { games: parseGeminiResponse(DEMO_RESPONSE), feedDate: DEMO_FEED_DATE };
}

// A game already on the watchlist (watched or not) stays off the feed.
function onWatchlist(game, videos, list) {
  const key = gameKey(game);
  const ids = new Set(videos.map((v) => v.id));
  return list.some((w) => w.key === key || (w.videoId && ids.has(w.videoId)));
}

function addToWatchlist(game) {
  const list = getWatchlist();
  if (list.some((w) => w.key === gameKey(game))) return;
  list.push({ key: gameKey(game), game, addedAt: new Date().toISOString(), watchedAt: null, videoId: null });
  store.set('watchlist', list);
}

function feedCardHTML({ game, videos, rank }) {
  const top = videos[0];
  return `
    <article class="card feed-card" data-rank="${rank}">
      <div class="media">
        <img src="${esc(imageFor(game, videos))}" alt="" loading="lazy">
        <span class="media-chip">${top ? `${ICONS.play}${esc(videoLabel(top))}` : 'No video yet'}</span>
      </div>
      <div class="body">
        <div class="tags"><span class="sport">${esc(SPORT_LABEL[game.sport] || game.sport)}</span>${tagsHTML(game)}</div>
        <h2 class="matchup">${esc(headline(game))}</h2>
        <p class="reason">${esc(game.reason)}</p>
        <button class="big add" data-add="${rank}">${ICONS.plus}<span>Add to watchlist</span></button>
      </div>
    </article>`;
}

function renderFeed(el) {
  const circles = getCircles();
  const feed = currentFeed();
  const talkDate = nextDay(feed.feedDate);
  const resetPanel = `<div class="key-panel"><button class="reset-btn" id="reset-demo">${ICONS.reset}<span>Reset demo</span></button></div>`;
  const bindReset = () => el.querySelector('#reset-demo').addEventListener('click', () => {
    if (confirm('Reset the demo? This clears your watchlist and restores the default circles.')) resetDemo();
  });

  let html = `
    <header class="hero">
      <div class="app-name">Catch-Up</div>
      <p class="tagline">Catch up on the games your friends will talk about</p>
      <p class="hero-date">${esc(longDate(talkDate))}</p>
    </header>`;

  if (!circles.length) {
    el.innerHTML = html + `<p class="empty">Add a circle on the <a href="#circles">Circles</a> tab to build your feed.</p>` + resetPanel;
    bindReset();
    return;
  }

  const list = getWatchlist();
  const cards = feed.games
    .map((game, i) => ({ game, rank: i + 1, videos: findVideos(game) }))
    .filter((c) => !onWatchlist(c.game, c.videos, list));
  if (!feed.games.length) html += `<p class="empty">Nothing from the last 24 hours for your circles.</p>`;
  else if (!cards.length) html += `<p class="empty">You're all caught up. Your picks are on the <a href="#watchlist">Watchlist</a>.</p>`;
  html += `<div class="cards">${cards.map(feedCardHTML).join('')}</div>`;
  html += resetPanel;

  el.innerHTML = html;

  bindReset();
  el.querySelectorAll('[data-add]').forEach((b) => b.addEventListener('click', () => {
    const c = cards.find((x) => x.rank === Number(b.dataset.add));
    addToWatchlist(c.game);
    updateBadge(true);
    b.disabled = true;
    b.classList.add('added');
    b.innerHTML = `${ICONS.check}<span>Added</span>`;
    const card = b.closest('.card');
    setTimeout(() => {
      card.style.height = card.offsetHeight + 'px';
      requestAnimationFrame(() => card.classList.add('leaving'));
      setTimeout(() => {
        card.remove();
        if (!el.querySelector('.feed-card')) render();
      }, 450);
    }, 700);
  }));
}

// ---------- watchlist screen ----------

// One card at a time can be active: { key, phase: 'playing' | 'ended', startedAt }.
const watchState = { selected: {}, active: null, timer: null, justWatched: null };

const fmtTime = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

function stopPlayback() {
  clearTimeout(watchState.timer);
  watchState.timer = null;
  watchState.active = null;
}

function playerHTML(item, videos, video) {
  const img = imageFor(item.game, videos);
  const active = watchState.active?.key === item.key ? watchState.active : null;

  if (!video) {
    return `<div class="media"><img src="${esc(img)}" alt="" loading="lazy"><span class="media-chip">No video yet</span></div>`;
  }
  if (active?.phase === 'playing') {
    const screen = video.youtubeId
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${esc(video.youtubeId)}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1"
           title="${esc(video.title)}" allow="autoplay; encrypted-media"></iframe>`
      : `<img class="kenburns" src="${esc(img)}" alt=""><span class="demo-label">Demo video</span>`;
    // The shield keeps taps from reaching the video, so the preview can't be skipped or scrubbed.
    // Real videos show their own YouTube time; only the demo player simulates a timer and pause icon.
    const simulated = video.youtubeId ? '' : `
      <span class="pause-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg></span>`;
    return `<div class="media player${video.youtubeId ? ' youtube' : ''}" data-player="${esc(item.key)}">
      ${screen}
      <div class="shield"></div>${simulated}
      <div class="controls">
        ${video.youtubeId ? '' : `<span class="timer">0:00 / ${fmtTime(video.duration * 60)}</span>`}
        <div class="progress"><div class="bar"></div></div>
      </div>
    </div>`;
  }
  if (active?.phase === 'ended') {
    return `<div class="media player ended">
      <img src="${esc(img)}" alt="">
      <div class="end-screen">
        <p>Nice, you're caught up on this one.</p>
        <button class="big" data-watched="${esc(item.key)}">${ICONS.check}<span>Mark as watched</span></button>
        <button class="big ghost" data-again="${esc(item.key)}">Watch again</button>
      </div>
    </div>`;
  }
  return `<button class="media playable" data-play="${esc(item.key)}" aria-label="Play ${esc(video.title)}">
    <img src="${esc(img)}" alt="" loading="lazy"><span class="play">${ICONS.play}</span>
    ${video.youtubeId ? '' : '<span class="demo-label">Demo video</span>'}</button>`;
}

function watchCardHTML(item) {
  const videos = findVideos(item.game);
  const selectedId = watchState.selected[item.key] || videos[0]?.id;
  const video = videos.find((v) => v.id === selectedId);
  const active = watchState.active?.key === item.key;
  let duration = '';
  if (video && videos.length > 1 && !active) {
    duration = `<div class="options" role="group" aria-label="Choose a video">${videos.map((v) => `
      <button class="opt" data-select="${esc(item.key)}" data-video="${v.id}" aria-pressed="${v.id === selectedId}">${esc(videoLabel(v))}</button>`).join('')}</div>`;
  } else if (video) {
    duration = `<p class="duration">${esc(videoLabel(video))}</p>`;
  }
  return `
    <article class="card watch-card${active ? ' expanded' : ''}" data-key="${esc(item.key)}">
      ${playerHTML(item, videos, video)}
      <div class="body">
        <h2 class="matchup">${esc(headline(item.game))}</h2>
        ${duration}
        ${video ? '' : `<button class="big outline" data-watched="${esc(item.key)}">${ICONS.check}<span>Mark as watched</span></button>`}
      </div>
    </article>`;
}

function watchedRowHTML(item) {
  return `
    <article class="card watched-card${watchState.justWatched === item.key ? ' arriving' : ''}">
      <img src="${esc(imageFor(item.game, findVideos(item.game)))}" alt="" loading="lazy">
      <div>
        <h3 class="matchup small">${esc(headline(item.game))}</h3>
        <p class="watched-date">Watched ${esc(shortDate(isoDate(new Date(item.watchedAt))))}</p>
        <div class="tags">${tagsHTML(item.game)}</div>
      </div>
    </article>`;
}

function showToast(text) {
  const t = document.getElementById('toast');
  t.innerHTML = `${ICONS.check}<span>${esc(text)}</span>`;
  t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove('show'), 2800);
}

function markWatched(key) {
  const list = getWatchlist();
  const item = list.find((w) => w.key === key);
  const videos = findVideos(item.game);
  item.watchedAt = new Date().toISOString();
  item.videoId = watchState.selected[key] || videos[0]?.id || null;
  store.set('watchlist', list);
  stopPlayback();
  watchState.justWatched = key;
  render();
  watchState.justWatched = null;
  document.querySelector('.watched-card.arriving')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  showToast("Watched. You're ready for tomorrow.");
}

// Drives the 3-second playing state: progress bar, timer, then the end screen.
function runPlayer(el) {
  const player = el.querySelector('.player[data-player]');
  if (!player) return;
  const key = player.dataset.player;
  const item = getWatchlist().find((w) => w.key === key);
  const videos = findVideos(item.game);
  const video = videos.find((v) => v.id === (watchState.selected[key] || videos[0]?.id));
  const total = video.duration * 60;
  const bar = player.querySelector('.bar');
  const timer = player.querySelector('.timer');
  const tick = () => {
    if (watchState.active?.key !== key || watchState.active.phase !== 'playing' || !player.isConnected) return;
    const f = Math.min(1, (performance.now() - watchState.active.startedAt) / PLAY_MS);
    bar.style.width = `${f * 100}%`;
    if (timer) timer.textContent = `${fmtTime(f * total)} / ${fmtTime(total)}`;
    if (f < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  const remaining = Math.max(0, PLAY_MS - (performance.now() - watchState.active.startedAt));
  const kb = player.querySelector('.kenburns');
  if (kb) kb.style.animationDelay = `-${PLAY_MS - remaining}ms`;
  clearTimeout(watchState.timer);
  watchState.timer = setTimeout(() => {
    if (watchState.active?.key !== key) return;
    watchState.active = { key, phase: 'ended' };
    render(); // removing the iframe stops the YouTube video
  }, remaining);
}

function renderWatchlist(el) {
  const list = getWatchlist();
  const toWatch = list.filter((w) => !w.watchedAt);
  const watched = list.filter((w) => w.watchedAt).sort((a, b) => b.watchedAt.localeCompare(a.watchedAt));

  el.innerHTML = `
    <header class="page-head"><h1>Watchlist</h1>
      <p>${toWatch.length ? `${toWatch.length} to watch before tomorrow` : 'Nothing queued'}</p></header>
    ${toWatch.length ? `<div class="cards">${toWatch.map(watchCardHTML).join('')}</div>`
      : `<p class="empty">Add games from the <a href="#feed">Feed</a> and they'll show up here.</p>`}
    ${watched.length ? `<h2 class="section-title">Watched</h2><div class="watched-list">${watched.map(watchedRowHTML).join('')}</div>` : ''}`;

  el.querySelectorAll('[data-select]').forEach((b) => b.addEventListener('click', () => {
    watchState.selected[b.dataset.select] = b.dataset.video; render();
  }));
  el.querySelectorAll('[data-play]').forEach((b) => b.addEventListener('click', () => {
    stopPlayback();
    watchState.active = { key: b.dataset.play, phase: 'playing', startedAt: performance.now() };
    render();
    el.querySelector('.watch-card.expanded')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }));
  el.querySelectorAll('[data-again]').forEach((b) => b.addEventListener('click', () => {
    stopPlayback(); render();
  }));
  el.querySelectorAll('[data-watched]').forEach((b) => b.addEventListener('click', () => {
    const card = b.closest('.watch-card');
    card.style.height = card.offsetHeight + 'px';
    requestAnimationFrame(() => card.classList.add('leaving'));
    setTimeout(() => markWatched(b.dataset.watched), 450);
  }));

  runPlayer(el);
}

// ---------- circles screen ----------

function renderCircles(el) {
  const circles = getCircles();
  let html = `
    <header class="page-head"><h1>Circles</h1>
      <p>The groups you talk sports with · ${circles.length} of ${MAX_CIRCLES}</p></header>`;
  html += circles.map((c, i) => `
    <article class="card circle">
      <div class="circle-head"><h2>${esc(c.name)}</h2><button class="link" data-remove="${i}">Remove</button></div>
      ${c.sports.map((s) => `
        <div class="sport-row">
          <span class="sport">${esc(SPORT_LABEL[s] || s)}</span>
          <div class="chips">${(c.teams[s] || []).map((t) => `<span class="chip">${esc(t)}</span>`).join('') || '<span class="chip any">Any team</span>'}</div>
        </div>`).join('')}
    </article>`).join('');

  if (circles.length < MAX_CIRCLES) {
    html += `
      <form id="add-circle" class="card form">
        <h2>Add a circle</h2>
        <label>Name <input type="text" name="name" placeholder="e.g. Dorm floor" required></label>
        ${SPORTS.map((s) => `
          <div class="sport-field">
            <label class="check"><input type="checkbox" name="sport" value="${s}"> ${esc(SPORT_LABEL[s])}</label>
            <input type="text" name="teams-${s}" placeholder="Teams, comma-separated (optional)">
          </div>`).join('')}
        <p class="error" id="circle-error"></p>
        <button class="big" type="submit">Add circle</button>
      </form>`;
  }
  el.innerHTML = html;

  el.querySelectorAll('[data-remove]').forEach((b) => b.addEventListener('click', () => {
    const next = getCircles(); next.splice(Number(b.dataset.remove), 1);
    store.set('circles', next); render();
  }));
  el.querySelector('#add-circle')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const name = String(f.get('name')).trim();
    const sports = f.getAll('sport');
    if (!name || !sports.length) {
      el.querySelector('#circle-error').textContent = 'Give the circle a name and pick at least one sport.';
      return;
    }
    const teams = {};
    for (const s of sports) teams[s] = String(f.get(`teams-${s}`) || '').split(',').map((t) => t.trim()).filter(Boolean);
    store.set('circles', [...getCircles(), { name, sports, teams }]);
    render();
  });
}

// ---------- tab bar + router ----------

function renderTabs() {
  const tabs = [['feed', 'Feed'], ['watchlist', 'Watchlist'], ['circles', 'Circles']];
  document.getElementById('tabbar').innerHTML = tabs.map(([id, label]) => `
    <a href="#${id}" data-screen="${id}">
      <span class="icon">${ICONS[id]}${id === 'watchlist' ? '<span class="badge" id="badge" hidden></span>' : ''}</span>
      <span>${label}</span>
    </a>`).join('');
}

function updateBadge(pop = false) {
  const n = getWatchlist().filter((w) => !w.watchedAt).length;
  const badge = document.getElementById('badge');
  badge.hidden = n === 0;
  badge.textContent = n;
  if (pop) { badge.classList.remove('pop'); void badge.offsetWidth; badge.classList.add('pop'); }
}

function render() {
  let screen = (location.hash || '#feed').slice(1);
  if (screen === 'history') screen = 'watchlist';
  if (!['feed', 'watchlist', 'circles'].includes(screen)) screen = 'feed';
  document.querySelectorAll('#tabbar a').forEach((a) => a.classList.toggle('active', a.dataset.screen === screen));
  for (const [name, fn] of [['feed', renderFeed], ['watchlist', renderWatchlist], ['circles', renderCircles]]) {
    const el = document.getElementById(`screen-${name}`);
    el.hidden = name !== screen;
    el.innerHTML = '';
    if (name === screen) fn(el);
  }
  updateBadge();
}

// Start with two pre-registered circles if the user has never saved any.
if (store.get('circles', null) === null) store.set('circles', DEMO_CIRCLES);
// Browsers that used the removed live mode may still hold an API key and a cached live feed.
store.remove('apiKey');
store.remove('feed');
migrateHistory();
syncDemoCircleNames();

renderTabs();
window.addEventListener('hashchange', () => { stopPlayback(); render(); window.scrollTo(0, 0); });
render();
