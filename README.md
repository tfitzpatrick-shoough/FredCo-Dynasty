# Frederick Dynasty League HQ — Netlify Automation v2

For the existing site: https://fredco-dynasty2024.netlify.app/
Repository: https://github.com/tfitzpatrick-shoough/FredCo-Dynasty
Original 2026 league ID: 1312450168351641600

## One-time installation (recommended: existing GitHub repo + existing Netlify site)

1. Extract this ZIP. Upload its contents (not the outer ZIP or a containing folder) to the ROOT of the `FredCo-Dynasty` GitHub repository, using Add file > Upload files. The repository root should contain `netlify.toml`, `package.json`, `lib/`, `netlify/`, `public/`, and `tests/`. Keep the folder structure. Commit to `main`. Existing legacy root `index.html` and `FDL_HQ_2026.html` may remain; Netlify publishes only `public/`.
2. Sign in to Netlify and open the EXISTING `fredco-dynasty2024` project. In Project configuration > Developer settings > Continuous deployment > Repository, select Link repository, authorize GitHub, choose `tfitzpatrick-shoough/FredCo-Dynasty`, and use branch `main`. Do not create a second site. GitHub Pages/Actions is not used for the actual hosting or scheduled jobs; Netlify reads the repository and runs its own builds. If already linked, skip the linking step.
3. Accept the settings in `netlify.toml`: base directory blank/root; build command `npm test && npm run build`; publish directory `public`; functions directory `netlify/functions`. Node 22. No API keys or environment variables required. Deploy the production branch. Netlify must install the dependency in `package.json`.
4. In Netlify's Functions view, confirm `sync` and `refresh-players` have Scheduled badges and `league-data`, `live`, and `report` exist. Select `sync` and click Run now. Check the log for `Synced 2026 Week ...` (actual week depends on Sleeper). Check the website's Data & Rules > Automatic updates for a verified Eastern timestamp. `refresh-players` can also be run now to check player DB retrieval. The first live player refresh can be picked up on the next sync. A manual sync does not publish a weekly edition outside the publication/retry window.
5. Next Tuesday at 8 AM Eastern, after completed data is verified, the Newsroom will list the generated report. The example preview is separate and not a published edition. If delayed, the scheduler retries every 15 minutes during the Tuesday window, and Wednesday/Thursday if necessary. In case of failure, inspect the function logs; the last verified data remains unchanged.

## Alternative if you do not want GitHub

Install Node.js 22 LTS and use the Netlify CLI on the extracted project directory. Run `npm install`, `npm test`, then `npx netlify-cli login`, `npx netlify-cli link` (choose the EXISTING site), and `npx netlify-cli deploy --prod --dir=public --functions=netlify/functions`. The repository connection is optional. A static drag-and-drop upload of only index.html cannot deploy this automation. Do not upload credentials or a .netlify/state.json file to a public repository.

## Automatic operating schedule

- Netlify `sync`: every 15 minutes September–January, hourly February–August except the report/retry window. Retrieves official league settings, owners, rosters, matchup results, draft selections, trades, waiver/free-agent movement, FAAB and future picks. Recomputes standings and validates roster totals and ownership; rejects mismatched regular-season data. Existing archive trade IDs and prior movement legs are retained if an API response appears incomplete.
- Public browser: checks server snapshot at opening and every 5 minutes while visible. The scoreboard checks provisional scores every 60 seconds on HQ/Scoreboard while visible. Provisional scores are separate from verified final standings. Live data depends on Sleeper availability; a scheduled game can show zero until points are posted. The site uses the original embedded archive offline.
- Player lookup: daily at 11:00 UTC, the next sync uses the updated compact player lookup. New rookies may not be known until Sleeper adds their records.
- Weekly report: the 8 AM America/New_York Tuesday slot, automatically accounting for EST/EDT. If Sleeper is delayed or temporarily inaccessible, the next 15-minute run during the Tuesday/Wednesday/Thursday publication window retries. Only final verified weeks are eligible. If older weeks were missed, they are backfilled from the verified data and labeled with the actual generation timestamp. Starts after the original Week 11 2026 archive. Reports are generated without a paid AI key; the statistical and editorial text is deterministic/template-based. Each edition is archived as printable HTML with a Print / Save as PDF button. The original four PDF editions remain unchanged in the Newsroom. A new PDF file is not automatically stored; members can print/save the HTML edition as a PDF.
- League history: weekly JSON snapshots stored with immutable report keys in Netlify Blobs. Postseason uses Sleeper's official championship and consolation brackets for final games (weeks 15–17). Regular-season standings stop at week 14. Renewal discovery follows a new league ID only if Sleeper's `previous_league_id` links to the finished league and the existing 12-roster owner identities and format are consistent. Format changes, manager replacements on renewal, unusual playoff formats or missing schedule/bracket data can require a manual review. This does not manufacture data for future games.

## Technical and operational limitations

- Actual Sleeper endpoints were inaccessible in the development environment; real Netlify deployment/authenticated storage and schedule executions have not been verified. Unit tests use supplied league records and synthetic future-week/renewal responses, not fabricated production results. Chromium tests use mocked API responses. Confirm the initial `Run now` after deployment.
- Netlify schedules are best-effort, not real-time guarantees. The timestamp is the time the report was actually generated. Score corrections after publication update HQ, not the immutable edition.
- Netlify hosting, functions, bandwidth and Blobs are subject to your plan's credits and usage quotas. Monitor Usage & billing. A free plan is not a guarantee of unlimited updates. This design avoids making a paid production redeploy for each data change; the scheduled function writes data to Blobs instead. If usage is high, increase polling intervals in `netlify.toml` and the browser script.
- The published site and its data endpoints are publicly accessible. Anyone who can open the site can see the published league data and editorial reports. Sleeper is read-only, so nothing can change your fantasy league from this website.
- No external AI service used. Weekly reports are statistically grounded templates, not individually written long-form AI journalism. Independent rookie-prospect scouting, external market-value projections and bespoke editorial newspaper art still require additional data or an editorial process.
- Backup JSON stored in Netlify Blobs is not a substitute for a separate offsite backup. You can export a full snapshot in Data & Rules.

## Included tests

`npm test`: seven tests for archive reconciliation, EST/EDT timing, completed-week refresh, rejection of invalid roster totals, provisional live feed, historical playoff completion, verified renewal discovery. `npm run build`: function syntax checks. Browser: all 13 sections tested with a mocked W12 snapshot, live W13 box scores, report links, offline and error fallback, and mobile overflow. No live production secrets included.
