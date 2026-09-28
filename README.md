# Catch-Up (prototype)

Static browser app. No backend: state lives in `localStorage`.

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

All paths are relative, so the site can be deployed as-is to GitHub Pages.

In production, an LLM with web search would generate the feed daily using `docs/system-prompt.md`. The prototype uses a fixed feed so every tester has the same experience. "Reset demo" at the bottom of the Feed tab restores the first-run state (empty watchlist, default circles).

- `docs/system-prompt.md`: the system prompt the production feed would use. It is documentation only; the app does not load it.
- `data/demo-feed.js`: the fixed feed shown to every user: 24 games from the weekend of Sat, Sep 26, 2026, ranked by how likely they are to come up. It also holds the two default circles.
- `data/videos.js`: sample videos. `youtubeId` points to a real YouTube highlight: ESPN's own upload where one exists, otherwise the official league, team or conference channel. Videos without one use the demo player.
- `data/teams.js`: full team names and aliases, used for exact-name matching.
- `match.js`: parses the LLM response and matches games to videos.
- `app.js`: the Feed, Watchlist and Circles tabs.

External requests: YouTube thumbnails and embeds for the videos that have a `youtubeId`.

## Photo credits (`assets/`)

- `football.jpg`: "Fitton Field, Holy Cross football stadium, Worcester MA" by Quintin Soloviev, CC BY 4.0, via Wikimedia Commons
- `baseball.jpg`: "Baseball diamond marines", public domain, via Wikimedia Commons
- `basketball.webp`: "Small basketball arena 1" by Wikideas1, CC0, via Wikimedia Commons
