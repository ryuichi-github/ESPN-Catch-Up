// Pure helpers: normalizing LLM games, team lookup, and matching games to sample videos.
import { TEAMS } from './data/teams.js';
import { VIDEOS } from './data/videos.js';

const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9& ]/g, ' ').replace(/\s+/g, ' ').trim();

// Exact full-name or alias match within a sport. "Texas" never matches "Texas A&M Aggies".
export function findTeam(name, sport) {
  const n = norm(name);
  return TEAMS.find((t) => t.sport === sport && (norm(t.name) === n || t.aliases.some((a) => norm(a) === n))) || null;
}

const canonical = (name, sport) => (findTeam(name, sport)?.name ?? norm(name)).toLowerCase();

export function teamInfo(name, sport) {
  const t = findTeam(name, sport);
  if (t) return t;
  const words = String(name).trim().split(/\s+/);
  return { name, short: sport === 'CFB' ? name : words[words.length - 1], abbr: words.map((w) => w[0]).join('').slice(0, 4).toUpperCase(), color: '#4A4A4A', text: '#FFFFFF' };
}

// Accepts the current schema ({teams:[{name,score}], circles:[]}) and the older one ({teams:[string], circle}).
export function normalizeGame(g) {
  if (!g || !Array.isArray(g.teams) || g.teams.length < 2) return null;
  const teams = g.teams.map((t) => (typeof t === 'string' ? { name: t, score: null } : { name: t.name, score: Number.isFinite(t.score) ? t.score : null }));
  const circles = Array.isArray(g.circles) ? g.circles : g.circle ? [g.circle] : [];
  return { sport: g.sport, date: g.date || '', teams, circles, reason: g.reason || '' };
}

// Parse a raw Gemini generateContent response into normalized games.
export function parseGeminiResponse(data) {
  const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
  const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  let parsed;
  try { parsed = JSON.parse(json); } catch { throw new Error('Could not parse LLM response: ' + text.slice(0, 300)); }
  return (parsed.games || []).map(normalizeGame).filter(Boolean);
}

export function headline(game) {
  const teams = [...game.teams];
  const scored = teams.every((t) => t.score !== null);
  if (scored) teams.sort((a, b) => b.score - a.score);
  const label = (t) => teamInfo(t.name, game.sport).short;
  return scored
    ? teams.map((t) => `${label(t)} ${t.score}`).join(', ')
    : teams.map(label).join(' vs. ');
}

export const gameKey = (game) => [game.sport, ...game.teams.map((t) => canonical(t.name, game.sport)).sort(), game.date].join('|');

const addDays = (iso, n) => {
  const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

// Same sport, same two teams by full name, published on the game date or the day after.
export function findVideos(game) {
  const want = game.teams.map((t) => canonical(t.name, game.sport)).sort().join('|');
  return VIDEOS
    .filter((v) => v.sport === game.sport)
    .filter((v) => v.teams.map((t) => canonical(t, v.sport)).sort().join('|') === want)
    .filter((v) => !game.date || (v.published >= game.date && v.published <= addDays(game.date, 1)))
    .sort((a, b) => (a.type === b.type ? 0 : a.type === 'highlight' ? -1 : 1));
}
