# Meet Shawon Website Operations Manual

**Platform:** [meetshawon.com](https://meetshawon.com)<br />
**Repository:** [Shawon1024/meetshawon-portfolio](https://github.com/Shawon1024/meetshawon-portfolio)<br />
**Owner:** Md Samsudduha Shawon<br />
**Primary contact:** contact@meetshawon.com<br />
**Document status:** Active<br />
**Last reviewed:** 25 August 2026

---

## 1. Purpose of This Manual

This is the operational and maintenance manual for the Meet Shawon portfolio and community platform. It explains how to develop, verify, deploy, operate, troubleshoot, and safely modify the website.

Use this manual when:

- returning to the project after a break;
- adding or updating portfolio content;
- publishing blog content;
- managing accounts, comments, appeals, or Drive retention;
- announcing or starting maintenance;
- diagnosing a failed build or production problem;
- handing enough context to a developer or AI assistant to make a safe change.

The root `README.md` describes the project publicly. This manual describes how to operate it.

> **Security warning:** Never put passwords, API keys, service-role keys, private tokens, recovery codes, database passwords, private user information, or secret environment-variable values in this document, Git commits, screenshots, issues, or chat messages.

---

## 2. Platform Summary

Meet Shawon is a Next.js application providing:

- a professional portfolio and responsive homepage;
- About, Skills, Projects, Certifications, Resume, Contact, Privacy, and Terms pages;
- a Supabase-backed technical blog;
- user registration, authentication, profiles, account settings, notifications, and saved content;
- reactions, comments, moderation, appeals, and administrative tools;
- newsletter double opt-in, confirmation, and unsubscribe workflows;
- Cloudflare Turnstile protection;
- a gateway to a separately hosted private Drive;
- scheduled and active maintenance modes;
- Vercel deployment, Sentry monitoring, and GitHub-based version control.

### Main production addresses

| Service | Address | Notes |
|---|---|---|
| Main platform | `https://meetshawon.com` | Canonical public website |
| `www` address | `https://www.meetshawon.com` | Redirects to the canonical domain |
| Drive | `https://drive.meetshawon.com` | Separate service/machine; excluded from main-site maintenance |
| Health check | `https://meetshawon.com/api/health` | Remains available during maintenance |
| Urgent contact | `https://meetshawon.com/contact` | Remains available during maintenance |

---

## 3. Technology and Service Responsibilities

| Service | Responsibility |
|---|---|
| Next.js / React | Application routes, server rendering, API routes, metadata, and UI |
| TypeScript | Typed application logic |
| Tailwind CSS | Styling and responsive design |
| Supabase | Authentication, profiles, posts, comments, reactions, newsletter data, and platform records |
| Vercel | Main application builds and production deployment |
| Cloudflare | DNS, Turnstile, HTTPS-related services, and Drive connectivity |
| Resend | Contact and newsletter email delivery |
| Sentry | Error and performance monitoring |
| GitHub | Source control, Dependabot, and automation |
| TrueNAS SCALE / ZFS | Self-hosted Drive storage and infrastructure |

If a feature fails, identify which service owns the failing layer before changing code.

---

## 4. Important Project Locations

The following paths are the principal operational areas. Confirm the structure with `find` or `rg --files` after major refactors.

| Path | Purpose |
|---|---|
| `src/app/page.tsx` | Homepage composition |
| `src/app/layout.tsx` | Root metadata and global layout |
| `src/app/components/Navbar.tsx` | Desktop/mobile navigation and account controls |
| `src/app/components/Footer.tsx` | Footer and newsletter placement |
| `src/app/components/SiteNotice.tsx` | Construction and scheduled-maintenance notice |
| `src/app/config/siteStatus.ts` | Central operating/maintenance-mode control |
| `src/app/maintenance/page.tsx` | Public maintenance page |
| `src/proxy.ts` | Domain routing, session refresh, and maintenance enforcement |
| `src/app/components/home/` | Homepage sections |
| `src/app/data/projects.ts` | Project card data and status |
| `src/app/blog/` | Blog listing and article pages |
| `src/app/components/blog/` | Blog cards and engagement UI |
| `src/app/admin/` | Administration pages |
| `src/app/components/admin/` | Administrative managers |
| `src/app/moderation/` | Moderation routes |
| `src/app/account/` | Account pages |
| `src/app/components/account/` | Account components |
| `src/app/api/contact/route.ts` | Contact form endpoint |
| `src/app/api/newsletter/` | Subscribe, confirm, and unsubscribe endpoints |
| `src/app/lib/newsletterTokens.ts` | Newsletter-token creation and verification |
| `src/app/lib/supabase/` | Browser/server Supabase clients |
| `src/app/sitemap.ts` | Static and published-blog sitemap entries |
| `src/app/robots.ts` | Search-engine crawler rules |
| `src/app/globals.css` | Global styling |
| `next.config.ts` | Headers, CSP, image configuration, and Next.js settings |
| `public/` | Static images, CV, certificates, icons, and project media |
| `README.md` | Public project overview |
| `docs/WEBSITE_OPERATIONS_MANUAL.md` | This manual |

### Useful discovery commands

```bash
/usr/bin/find src/app -maxdepth 4 -type f | /usr/bin/sort

/usr/bin/grep -R -n \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  "SEARCH_TEXT" \
  src
```

If `rg` is available, prefer:

```bash
rg -n "SEARCH_TEXT" src
rg --files src public
```

---

## 5. Local Development Setup

### Requirements

- macOS or another supported development system;
- Git;
- Node.js compatible with the version required by the repository;
- npm;
- access to the GitHub repository;
- a valid local `.env.local` containing development configuration.

### Confirm commands are available

```bash
command -v node
command -v npm
command -v git
node --version
npm --version
/usr/bin/git --version
echo "$PATH"
```

If `npm` or `git` unexpectedly becomes unavailable in the current terminal, try the known absolute Git path and restore the shell environment:

```bash
/usr/bin/git status --short
exec /bin/zsh -l
```

Then run `command -v npm` again. Do not reinstall packages until confirming this is not merely a `PATH` issue.

### Install dependencies

From the repository root:

```bash
npm install
```

Use the repository lockfile. Do not delete or regenerate the lockfile casually.

### Start development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

A `curl` response code of `000` normally means no server is listening, not that the route returned an application error.

### Check port 3000

```bash
/usr/sbin/lsof -nP -iTCP:3000 -sTCP:LISTEN
```

Stop a confirmed development process using its exact PID:

```bash
/bin/kill PID_NUMBER
```

Re-check the port before restarting the server.

---

## 6. Environment Variables

Local values belong in `.env.local`. Production values belong in Vercel project settings. Never commit `.env.local`.

The application has used variables in these groups:

### Public application values

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

### Server-only values

- Supabase secret/service-role credential used by privileged server routes;
- `RESEND_API_KEY`;
- `CONTACT_EMAIL`;
- `TURNSTILE_SECRET_KEY`;
- newsletter token/signing secret;
- Sentry credentials or build tokens, where configured.

> Names can evolve. Generate the authoritative list from the current code before setting up another environment.

```bash
/usr/bin/grep -RhoE \
  'process\.env\.[A-Z0-9_]+' \
  src next.config.ts sentry*.ts 2>/dev/null \
| /usr/bin/sed 's/process\.env\.//' \
| /usr/bin/sort -u
```

Also inspect bracketed or multiline environment access manually:

```bash
/usr/bin/grep -R -n \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  'process.*env' \
  src next.config.ts
```

### Local site URL

Development normally uses:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Production must use:

```env
NEXT_PUBLIC_SITE_URL=https://meetshawon.com
```

Never publish example secret values in this manual.

### Environment-change checklist

1. Change the value in the appropriate local or Vercel environment.
2. Confirm whether the variable is public or server-only.
3. Restart the local server after local changes.
4. Redeploy after production changes.
5. Test the affected feature.
6. Rotate a secret immediately if it was exposed.

---

## 7. Standard Change Workflow

### Before editing

```bash
/usr/bin/git status --short
/usr/bin/git branch --show-current
/usr/bin/git log -3 --oneline
```

Do not overwrite unrelated modified files. Existing changes may belong to unfinished work.

### After editing

```bash
npm run lint
npm run build
git diff --check
/usr/bin/git status --short
/usr/bin/git diff --stat
```

All three validation commands should pass before a production commit.

### Review the actual change

```bash
/usr/bin/git diff -- path/to/file
```

### Stage explicit files

Prefer explicit paths so unrelated work is not committed:

```bash
/usr/bin/git add path/to/file-one path/to/file-two
/usr/bin/git diff --cached --name-only
/usr/bin/git diff --cached --check
```

### Commit and push

```bash
/usr/bin/git commit -m "Describe the completed change"
/usr/bin/git push origin main
```

### Confirm completion

```bash
/usr/bin/git status --short
/usr/bin/git log -3 --oneline
```

No `git status --short` output means the working tree is clean.

> A push saying `Everything up-to-date` means there was no new commit to deploy. Untracked files and unstaged modifications are not pushed automatically.

---

## 8. Deployment and Production Verification

Pushing `main` triggers the configured Vercel deployment. Wait for deployment completion before judging production routes.

### Basic production tests

```bash
/usr/bin/curl -s -o /dev/null -w "%{http_code}\n" \
  "https://meetshawon.com/"

/usr/bin/curl -s \
  "https://meetshawon.com/api/health"

/usr/bin/curl -sI \
  "https://www.meetshawon.com" \
| /usr/bin/grep -Ei "^HTTP|^location"
```

Expected normal results:

- main site: `200`;
- health endpoint: JSON with `"status":"ok"`;
- `www`: redirect to `https://meetshawon.com/`.

### Security-header test

```bash
/usr/bin/curl -sI \
  "https://meetshawon.com" \
| /usr/bin/grep -Ei \
  "content-security-policy|strict-transport-security|x-content-type-options|x-frame-options|referrer-policy|permissions-policy|cross-origin-opener-policy"
```

The platform has used:

- Content Security Policy;
- HSTS;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- strict-origin referrer policy;
- restricted camera, microphone, and geolocation permissions;
- same-origin opener policy.

### Route smoke test

With a local server running:

```bash
for path in \
  / \
  /about \
  /skills \
  /projects \
  /certifications \
  /resume \
  /blog \
  /contact \
  /privacy \
  /terms
do
  http_code=$(
    /usr/bin/curl -s -o /dev/null -w "%{http_code}" \
      "http://localhost:3000$path"
  )
  echo "$http_code $path"
done
```

Do not expect protected routes to behave like anonymous static pages; test them with the correct role and session.

---

## 9. Website Status and Maintenance Modes

The main control file is:

```text
src/app/config/siteStatus.ts
```

Search for `WEBSITE STATUS` or `SITE_STATUS` to find it.

### Normal operation

```ts
mode: "normal",
```

Results:

- the full website is available;
- the construction notice follows `constructionNotice.enabled`;
- direct `/maintenance` requests redirect to `/`.

### Construction notice

In normal mode:

```ts
constructionNotice: {
  enabled: true,
  // ...
}
```

Change `enabled` to `false` when the refinement notice is no longer required. Edit the label and message in the same object when publishing a different general notice.

### Announce scheduled maintenance

1. Edit `src/app/config/siteStatus.ts`.
2. Set:

```ts
mode: "scheduled",
```

3. Enter the real start and expected return timestamps.
4. Update the reason, progress message, planned changes, and available services.
5. Run lint and build.
6. Commit and deploy.
7. Verify that the main site remains available and the cyan notice appears.
8. Verify `/maintenance` shows the upcoming-maintenance information.

### Date format

Use ISO timestamps with the correct UK offset:

```text
BST example: 2026-09-12T22:00:00+01:00
GMT example: 2026-12-12T22:00:00+00:00
```

The configured timezone is `Europe/London`. Confirm whether the chosen date is under BST or GMT.

### Start active maintenance

At the planned time, change:

```ts
mode: "maintenance",
```

Then validate, commit, push, and wait for deployment.

Expected behaviour:

- normal main-site pages return the maintenance experience with HTTP `503`;
- `/maintenance` is available;
- `/contact` and `/api/contact` remain available for urgent enquiries;
- `/api/health` remains available;
- newsletter endpoints return `503` and do not accept subscriptions;
- the Drive hostname remains unaffected;
- responses include no-store, retry, and no-index protections where configured;
- normal Navbar, footer, newsletter, and floating notifications are hidden.

### Finish maintenance

1. Confirm the work and essential production tests are complete.
2. Set:

```ts
mode: "normal",
```

3. Update status copy if necessary.
4. Run lint/build/diff checks.
5. Commit and deploy.
6. Verify the homepage returns `200`.
7. Verify `/maintenance` returns `307` with `location: /`.
8. Test contact, newsletter, authentication, blog, and Drive.

### Normal-mode maintenance-route check

```bash
/usr/bin/curl -s -D - -o /dev/null \
  "https://meetshawon.com/maintenance" \
| /usr/bin/grep -Ei "^HTTP|^location"
```

Expected:

```text
HTTP/2 307
location: /
```

### Maintenance emergency rule

If normal restoration fails, do not make random production changes. Keep maintenance mode active, inspect Vercel logs and the last deployment, then either fix forward or redeploy/revert to the last known-good commit.

---

## 10. Content Update Procedures

### Update homepage text or sections

Homepage composition:

```text
src/app/page.tsx
```

Homepage sections:

```text
src/app/components/home/Hero.tsx
src/app/components/home/AboutPreview.tsx
src/app/components/home/SkillsPreview.tsx
src/app/components/home/ProjectsPreview.tsx
src/app/components/home/ContactCTA.tsx
```

Shared heading:

```text
src/app/components/ui/SectionHeading.tsx
```

After edits, inspect desktop and an actual mobile phone. A desktop browser’s narrow viewport is useful but not a complete real-device test.

### Add or update a project

Primary project data:

```text
src/app/data/projects.ts
```

For a new project:

1. Add the project object with a unique slug.
2. Add a dedicated page under `src/app/projects/<slug>/page.tsx` when required.
3. Store project images under `public/projects/<slug>/`.
4. Use accurate status, technologies, highlights, and summary.
5. Add the route to `src/app/sitemap.ts` if it is not generated automatically.
6. Validate every image and link.

The cybersecurity home-lab placeholder should be replaced only when the project is operational and has genuine documentation/screenshots.

### Add a certification

1. Add the certificate PDF under `public/certificates/`.
2. Update the certification data/page.
3. Add the public Credly or issuer link.
4. Confirm the PDF opens directly.
5. Confirm issuer, title, completion date, and status are accurate.
6. Never publish certificate identifiers or personal data that should remain private.

Current public certificate assets include Cisco/NetAcad certificates for:

- Introduction to Cybersecurity;
- Operating Systems Basics;
- Computer Hardware Basics.

### Update the CV

The public CV has been served as:

```text
public/Shawon-CV.pdf
```

Procedure:

1. Update the editable source document outside the repository.
2. Export a polished PDF.
3. Replace the public PDF while preserving the expected filename unless code is also updated.
4. Open the PDF locally and verify every page visually.
5. Confirm the `/resume` download link.
6. Update the Resume page content if the CV facts changed.

Public CV rules:

- use `contact@meetshawon.com`;
- use London as the public location;
- do not display the private mobile number;
- keep qualifications, employment, dates, and project status accurate.

### Update navigation or footer links

Relevant files:

```text
src/app/components/Navbar.tsx
src/app/components/Footer.tsx
```

Check:

- desktop navigation;
- mobile menu opening, independent scrolling, closing, and logout access;
- keyboard focus;
- active-link styling;
- authenticated and anonymous states;
- footer links and social hover colours;
- duplicate calls to action.

---

## 11. Blog Operations

### Publishing workflow

Blog management routes include:

```text
/admin/posts
/admin/posts/new
/admin/posts/[id]/edit
```

Before publishing:

- confirm title and unique slug;
- add a useful excerpt;
- select category and tags;
- upload a suitable cover image and meaningful alternative text;
- validate Markdown rendering and code highlighting;
- confirm publication status and timestamp;
- preview the article on mobile and desktop;
- verify related/popular article behaviour;
- confirm the sitemap includes the published article.

### Engagement information

Blog cards display:

- view count;
- reaction count;
- comment count;
- zero when no activity exists.

The popular-article component is located at:

```text
src/app/components/blog/PopularArticles.tsx
```

If changing queries, ensure reaction and comment totals are calculated consistently and avoid per-card database-query loops.

### Blog image performance

Next.js may warn when an image becomes the Largest Contentful Paint without eager/high-priority loading. Apply eager/high priority only to the image genuinely above the fold. Do not mark every image high priority.

Inspect image use in:

```text
src/app/blog/page.tsx
src/app/components/blog/PopularArticles.tsx
```

Retest after changing layouts because the LCP element can change.

---

## 12. Accounts, Administration, and Moderation

### Access rules

- anonymous visitors must be redirected to sign-in for protected pages;
- authenticated non-admin users must not access admin pages;
- administrative actions must be protected by database policies or privileged server-side logic, not only hidden UI;
- the currently signed-in administrator must not accidentally remove essential access from their own account.

### User identity presentation

Administrative areas use:

- profile image;
- first and last name as the human-readable name;
- `@username` as the platform identifier;
- verified and role badges where relevant.

Legacy `display_name` references were removed from active admin components. Before introducing new admin identity UI, search for accidental legacy use:

```bash
rg -n \
  'display_name|displayName|Display Name|Display name' \
  src/app/admin \
  src/app/components/admin
```

### User management

Relevant areas:

```text
src/app/admin/users/page.tsx
src/app/components/admin/UserManagementManager.tsx
```

Use these for role and verification management. Confirm the target user carefully before changing permissions.

### Drive retention review

Relevant component:

```text
src/app/components/admin/DriveRetentionManager.tsx
```

The review displays profile image, human-readable name, username, Nextcloud account, dataset, quota, lifecycle state, suspension time, and retention deadline.

Before destructive Drive actions:

1. Confirm the exact website user.
2. Confirm the exact Nextcloud account and dataset.
3. Confirm lifecycle status and retention deadline.
4. Confirm backups or recovery implications.
5. Never delete storage based only on a display label.

### Appeals

Relevant areas:

```text
src/app/admin/appeals/page.tsx
src/app/components/admin/AppealReviewManager.tsx
```

Review the user, message, prior account action, and evidence before approving or rejecting. Provide a clear administrative response.

### Comment administration

Relevant areas:

```text
src/app/admin/comments/page.tsx
src/app/components/admin/AdminCommentsManager.tsx
```

Check the author, username, article, parent/reply status, content, and timestamps before deletion or moderation.

### Moderation audit

After changing moderation behaviour, test:

- admin role;
- moderator role, if configured;
- standard user;
- blocked/restricted user;
- anonymous visitor;
- appeal creation and review;
- moderation history.

---

## 13. Newsletter Operations

Newsletter components and routes include:

```text
src/app/components/newsletter/NewsletterForm.tsx
src/app/api/newsletter/subscribe/route.ts
src/app/api/newsletter/confirm/route.ts
src/app/api/newsletter/unsubscribe/route.ts
src/app/newsletter/confirmed/page.tsx
src/app/newsletter/unsubscribe/page.tsx
src/app/lib/newsletterTokens.ts
```

### Expected workflow

1. Visitor enters a valid email address.
2. Visitor gives consent.
3. Turnstile verification succeeds.
4. Subscriber is stored as pending where appropriate.
5. Resend sends a confirmation email.
6. Signed confirmation token is verified.
7. Subscriber becomes subscribed.
8. Unsubscribe link allows withdrawal.

### Test checklist

- invalid email;
- missing consent;
- missing/expired Turnstile token;
- new subscription;
- repeated pending subscription;
- confirmation success;
- already-confirmed address;
- invalid or expired confirmation link;
- unsubscribe success;
- repeated unsubscribe;
- active maintenance returns `503` for newsletter endpoints.

### Turnstile widget warning

If the browser reports that a widget cannot be found, inspect render, reset, and remove lifecycles. Store the widget ID in a ref, render once, and only reset/remove a valid current widget. Avoid duplicate global `Window.turnstile` declarations; use the shared type under `src/types/` if present.

### Newsletter privacy

Only send to confirmed subscribers. Keep consent and lifecycle timestamps accurate. Do not export or reuse subscriber addresses for unrelated purposes.

---

## 14. Contact Form Operations

Relevant files:

```text
src/app/contact/page.tsx
src/app/contact/ContactForm.tsx
src/app/contact/ContactMethods.tsx
src/app/api/contact/route.ts
```

The contact form remains available during maintenance for important enquiries.

Test:

- required fields;
- email validation;
- content length limits;
- Turnstile verification;
- successful Resend delivery;
- safe error messaging;
- abuse/rate-limit behaviour where configured;
- mobile layout;
- email, LinkedIn, and GitHub links.

Never expose Resend or Turnstile secrets to client components.

---

## 15. Supabase Operations

Supabase holds security-sensitive application data and policies. Treat database changes as production changes.

### Before changing the database

1. Record the purpose and expected effect.
2. Inspect the current table/function/policy definition.
3. Back up affected data or confirm recovery.
4. Test SQL in a safe environment where possible.
5. Avoid destructive statements without a verified target.
6. Save durable schema changes as migrations if the project uses migrations.
7. Test anonymous, user, moderator, and admin access separately.

### Key data areas

The project has used data for:

- profiles and roles;
- posts, categories, and tags;
- comments and reactions;
- bookmarks/saved articles;
- notifications and preferences;
- restrictions and appeals;
- newsletter subscribers;
- Drive account lifecycle and retention.

Generate an authoritative inventory from Supabase or repository migrations instead of relying solely on this summary.

### RLS verification

The earlier SQL error `column "row_security" does not exist` came from querying the wrong catalogue column. Do not guess PostgreSQL catalogue fields. Use Supabase’s table/policy views or documented PostgreSQL catalogue queries appropriate to the deployed version.

For every table, confirm:

- whether RLS is enabled;
- who can select, insert, update, and delete;
- whether service-role access is limited to server code;
- whether users can affect only their own records;
- whether admin/moderator policies use trustworthy role checks.

### Service-role rule

The Supabase service-role/secret key bypasses normal RLS protections. It must remain server-only and should only be used in tightly scoped routes that validate requests.

### Storage

Document and verify the current buckets directly in Supabase. Expected media categories include blog images and profile/public assets. Check:

- bucket visibility;
- upload size/type limits;
- ownership/path rules;
- delete permissions;
- stale-file cleanup;
- backup expectations.

---

## 16. Drive and Infrastructure Operations

The main website and Drive are related but operationally distinct.

### Domain behaviour

`src/proxy.ts` recognises:

- `drive.meetshawon.com`;
- `drive.localhost` for local testing where configured.

Known Drive rewrites include the Drive landing page, dashboard, and access-denied route.

### Maintenance separation

Main website maintenance must not unintentionally block the Drive hostname. Drive availability still depends on its separate machine, TrueNAS/Nextcloud services, networking, Cloudflare configuration, and power/internet availability.

### Before changing Drive integration

- confirm main-domain login and shared-cookie behaviour;
- confirm cookie domain, secure flag, same-site policy, and HTTPS;
- test authorised and unauthorised users;
- test provisioning failure handling;
- confirm dataset and Nextcloud username mapping;
- verify account suspension and retention behaviour;
- ensure the web application cannot request arbitrary storage paths.

### Infrastructure records to maintain privately

Keep a secure, non-public record of:

- TrueNAS pool and dataset layout;
- Nextcloud deployment details;
- Cloudflare tunnel/DNS configuration;
- backup schedules and destinations;
- recovery procedures;
- administrator access and recovery methods;
- device/network inventory.

Do not commit credentials or sensitive network details to this repository manual.

---

## 17. Security Operations

### Dependency review

```bash
npm outdated
npm audit
```

Do not blindly apply force upgrades. Review breaking changes, especially for Next.js, React, Supabase, authentication, Sentry, Resend, and security packages.

After dependency updates:

```bash
npm run lint
npm run build
```

Then test authentication, API routes, CSP, Turnstile, email, images, and protected routes.

### Content Security Policy

The CSP is configured in `next.config.ts`. Add a new external origin only when a real feature requires it. Keep directives as narrow as possible.

Development has conditionally omitted `upgrade-insecure-requests` so real phones on the local network can load local HTTP development assets. Production retains the upgrade directive.

After CSP changes, test both local development and production. Browser console errors often identify the blocked directive and origin.

### Secret exposure response

If a secret is exposed:

1. Revoke/rotate it immediately at the provider.
2. Update Vercel and local configuration.
3. Redeploy.
4. Inspect logs for misuse.
5. Remove it from Git history if committed; deleting it only from the latest file is insufficient.
6. Document the incident privately.

### Responsible disclosure

Treat credible security reports seriously. Preserve evidence, limit discussion of exploitable details, reproduce safely, fix, test, deploy, and acknowledge responsibly where appropriate.

---

## 18. Monitoring, Backups, and Recovery

### Routine monitoring

Check:

- Vercel deployment and function logs;
- Sentry errors and performance alerts;
- Supabase health, authentication, and database usage;
- Resend delivery/failure logs;
- Cloudflare events and Turnstile behaviour;
- GitHub Dependabot/security alerts;
- TrueNAS pool, SMART, snapshots, tasks, and capacity;
- Nextcloud service health.

### Backups

At minimum, recovery planning should cover:

- GitHub repository;
- Supabase database;
- Supabase Storage objects;
- Vercel environment-variable inventory;
- DNS and Cloudflare configuration;
- Resend/Turnstile configuration records;
- TrueNAS datasets, configuration, and snapshots;
- CV, certificates, branding, and original project media.

Do not call a backup complete until a restoration has been tested.

### Application rollback

When a deployment introduces a serious fault:

1. Enable maintenance mode if needed and if a safe deployment can be made.
2. Identify the last known-good commit:

```bash
/usr/bin/git log --oneline --decorate -10
```

3. Prefer a new revert commit rather than rewriting shared history:

```bash
/usr/bin/git revert COMMIT_HASH
/usr/bin/git push origin main
```

4. Verify the production deployment.
5. Investigate the failed change separately.

Do not use `git reset --hard` or force-push casually.

---

## 19. Common Problems and Fixes

### `command not found: npm` or `git`

- inspect `echo "$PATH"`;
- run `command -v npm` and `command -v git`;
- use `/usr/bin/git` where appropriate;
- restart the login shell with `exec /bin/zsh -l`;
- do not assume dependencies disappeared.

### `curl` returns `000`

No server is reachable. Start `npm run dev`, confirm port 3000, and retry.

### A new page returns production `404`

Check:

1. the file is tracked (`git status --short`);
2. it was staged and committed;
3. the commit was pushed;
4. the Vercel deployment completed;
5. the route appears in `npm run build` output.

### `Everything up-to-date`, but changes are missing

The files were probably not committed. `git push` sends commits, not working-tree files.

### CSS parser shows corrupted Tailwind class tokens

Inspect recently pasted class strings for corrupted characters. A malformed class such as a damaged `bg-[var(--surface)]/70` can produce generated CSS errors. Retype the entire affected class manually using plain characters, then remove the build cache only if necessary and safe.

Never add copied terminal prompts or Markdown escape characters to source code.

### Duplicate identifier

Search for repeated declarations. A component previously had two `const SITE_NOTICE` definitions. Keep one configuration object only.

### `setState` inside an effect lint error

Avoid using an effect solely to synchronously initialise state. Initialise state directly or subscribe to an external event properly.

### Conflicting global Turnstile types

Use one shared `TurnstileApi` declaration. Do not declare incompatible `Window.turnstile` types in multiple components.

### LCP image warning

Identify the actual above-the-fold image and give only that image eager/high-priority treatment. Recheck at the viewport where the warning occurs.

### Apple touch icon `404`

Confirm these assets exist when referenced:

```text
public/apple-touch-icon.png
public/apple-touch-icon-precomposed.png
```

Then test direct requests.

### Mobile local site has no CSS or navigation behaviour

Confirm the phone and computer can reach the development host and that CSP is not upgrading local HTTP requests to HTTPS. Production security behaviour must remain stricter than local development.

### Mobile navigation cannot scroll

The mobile menu must be viewport-fixed, lock background scrolling, and provide its own `overflow-y-auto` container with safe-area padding. Test after scrolling the underlying page near the bottom, then open the menu and confirm the menu—not the page—scrolls to account/logout controls.

---

## 20. Accessibility and Quality Checklist

Before major releases, check:

- keyboard navigation and visible focus;
- semantic headings in logical order;
- meaningful link/button labels;
- image alternative text;
- form labels, errors, and status announcements;
- colour contrast;
- zoom and text resizing;
- reduced-motion behaviour where applicable;
- mobile navigation and dialogs;
- loading, empty, error, and success states;
- authenticated/anonymous behaviour;
- real-phone testing;
- common desktop widths;
- broken links and missing static assets.

Use automated accessibility tools as support, not as a substitute for manual testing.

---

## 21. Routine Maintenance Schedule

### Weekly or after significant changes

- review Vercel deployment status;
- review Sentry issues;
- review failed contact/newsletter email delivery;
- review pending moderation and appeals;
- inspect Dependabot/security alerts;
- confirm the health endpoint.

### Monthly

- review dependencies without blindly upgrading;
- verify essential public routes;
- check Supabase usage and backups;
- check storage/media growth;
- review admin accounts and roles;
- inspect TrueNAS pool and snapshot health;
- review public content for outdated claims.

### Quarterly

- perform a deeper accessibility review;
- test restoration procedures;
- review RLS policies and privileged endpoints;
- audit environment-variable inventory;
- review CSP and external integrations;
- update this manual and the README;
- confirm CV, certifications, education, and project statuses.

---

## 22. Future Work Register

The following are planned operational/content improvements, not blockers to normal production use:

- publish additional technical blog articles;
- add new verified credentials and certificate PDFs;
- update the CV as experience changes;
- replace the cybersecurity home-lab placeholder when the lab is operational;
- continue Drive integration testing;
- improve Drive resilience and recovery workflows;
- expand automated tests;
- perform extended accessibility reviews;
- continue performance and security reviews;
- expand technical and infrastructure documentation.

Update this list when an item is completed, postponed, or replaced.

---

## 23. Information to Give an AI Assistant or Developer

When asking for help, provide:

1. the exact goal;
2. the current complete contents of the affected file(s), or a repository-accessible workspace;
3. the exact error output;
4. `npm run lint` and `npm run build` results;
5. relevant browser console/network output;
6. whether the problem occurs locally, in production, or both;
7. desktop/mobile/browser details;
8. `git status --short` output;
9. what was already attempted;
10. whether implementation is authorised or diagnosis only is requested.

Never provide secrets. Redact tokens, cookies, email addresses belonging to users, private IP details where inappropriate, and service-role credentials.

Useful opening context:

```text
Project: Meet Shawon portfolio/community platform
Stack: Next.js 16, TypeScript, Tailwind, Supabase, Vercel,
Cloudflare Turnstile, Resend, and Sentry
Repository: Shawon1024/meetshawon-portfolio
Current mode: normal / scheduled / maintenance
Goal: ...
Observed error: ...
Validation status: ...
Git status: ...
```

Ask for complete replacement code only when appropriate. For large files, a precise patch is usually safer than manually replacing thousands of lines.

---

## 24. Documentation Maintenance

Update this manual whenever any of the following changes:

- environment-variable names;
- deployment workflow;
- maintenance-mode behaviour;
- protected routes or roles;
- Supabase schema, functions, policies, or buckets;
- Drive architecture or lifecycle process;
- contact/newsletter email workflow;
- important file paths;
- backup or recovery procedures;
- monitoring providers;
- recurring operational responsibilities.

For meaningful documentation updates:

1. change the **Last reviewed** date;
2. describe the operational change accurately;
3. run `git diff --check`;
4. commit the documentation with the related code change or a dedicated documentation commit.

Suggested commit message:

```bash
/usr/bin/git commit -m "Add website operations manual"
```

---

## 25. Final Pre-Deployment Checklist

- [ ] The requested change is complete.
- [ ] No secrets or personal user data were added.
- [ ] `SITE_STATUS.mode` is intentional.
- [ ] `npm run lint` passes with zero errors and warnings.
- [ ] `npm run build` succeeds.
- [ ] `git diff --check` produces no output.
- [ ] The diff contains only intended files.
- [ ] Desktop layout was checked.
- [ ] Mobile layout was checked on a real phone where relevant.
- [ ] Authentication and roles were tested where relevant.
- [ ] Contact/newsletter flows were tested where relevant.
- [ ] New pages are linked and included in the sitemap when appropriate.
- [ ] Static files exist at the referenced paths.
- [ ] The commit was pushed successfully.
- [ ] Vercel deployment completed.
- [ ] Production routes and health endpoint were verified.
- [ ] Sentry/Vercel logs show no new critical issue.
- [ ] This manual was updated if operations changed.

---

**Document owner:** Md Samsudduha Shawon<br />
**Public website:** [meetshawon.com](https://meetshawon.com)<br />
**Operational contact:** [contact@meetshawon.com](mailto:contact@meetshawon.com)
