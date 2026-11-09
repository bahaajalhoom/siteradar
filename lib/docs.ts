export const docs = [
  {
    slug: "getting-started",
    title: "Getting started",
    description: "From a saved website to your first useful report.",
    sections: [
      {
        title: "Create your workspace",
        body: "Create a free account with your name, email, and a password of at least 10 characters. Sign in at /sign-in. Your session persists so you do not need to sign in for every visit.",
      },
      {
        title: "Your own workspace",
        body: "Your account keeps your projects and audit reports together. Sign in with the same account to return to your saved work.",
      },
      {
        title: "Run your first audit",
        body: "Choose New website, enter the canonical HTTPS URL, and set your country, language, device, and crawl scope. Add keywords or let SiteRadar suggest phrases from your actual page titles and headings. Confirm permission and start the audit.",
      },
      {
        title: "Continue where you left off",
        body: "Your latest project opens automatically. Use Run again to repeat the saved configuration, or Scan settings to change it. Project switching shows the latest scan for each website; Audit history keeps previous runs.",
      },
    ],
  },
  {
    slug: "projects-and-audits",
    title: "Projects & repeat audits",
    description: "Save the setup once. Keep the evidence over time.",
    sections: [
      {
        title: "What a project remembers",
        body: "A project stores its website origin and latest scan configuration: target market, language, device, crawl scope, and keywords. Each audit is a separate timestamped snapshot.",
      },
      {
        title: "Run again",
        body: "The Run again action queues a new audit using the current project configuration. No URL entry is required. If a scan is already running for that project, SiteRadar opens that scan instead of creating a duplicate.",
      },
      {
        title: "Scope and cancellation",
        body: "Only authorized public HTTPS pages are crawled. Robots.txt is respected, and off-origin navigation is blocked. Cancel stops additional work and preserves collected observations. An in-flight browser check may take a moment to close.",
      },
      {
        title: "Unlimited Free",
        body: "Free has no quotas on projects, audit runs, saved keywords, or report history. All-pages crawls still have configurable technical resource and time safeguards, shown as crawl safety bounds rather than paid-plan limits.",
      },
    ],
  },
  {
    slug: "measurements",
    title: "Scores & performance",
    description: "Understand what was measured, where, and how.",
    sections: [
      {
        title: "Audit score",
        body: "The audit score is the mean of available category scores. SEO and technical checks use the fetched or rendered pages; content readiness uses structural rules. Performance and automated accessibility use the homepage browser measurement when it succeeds. Missing sources are excluded and disclosed. This is a heuristic, not a prediction of search rankings.",
      },
      {
        title: "Real lab performance",
        body: "Chromium and Lighthouse measure the project homepage with your chosen mobile or desktop profile. The report displays the performance score, Largest Contentful Paint (LCP), Total Blocking Time (TBT), Cumulative Layout Shift (CLS), First Contentful Paint (FCP), and Speed Index. These are lab measurements, not real-user CrUX data. TBT is not INP.",
      },
      {
        title: "Accessibility",
        body: "axe checks the rendered homepage for automated violations. Lighthouse supplies an automated accessibility score. Both can find real issues; neither proves complete WCAG compliance. Keyboard, reading order, content quality, and assistive-technology behavior may need human review.",
      },
      {
        title: "Comparing scans",
        body: "The chart uses real completed audit snapshots for the same website and device. One scan is shown as one observed point. Repeated scans build a timeline. Changing device or measurement coverage can affect comparability.",
      },
      {
        title: "Content readiness versus AI visibility",
        body: "GEO readiness checks content organization and structured entities. It does not measure mentions in ChatGPT or another answer engine. No external AI-visibility claim is made without an observed answer-provider result.",
      },
    ],
  },
  {
    slug: "search-rankings",
    title: "Keywords & search rankings",
    description: "No absolute ranks. Every observation has a context.",
    sections: [
      {
        title: "Save your keywords",
        body: "Open Scan settings to edit keywords, then run the audit. Without manually entered keywords, SiteRadar extracts initial phrases from the actual page title and headings. Review these suggestions; they are not keyword-volume research.",
      },
      {
        title: "Check your Google visibility",
        body: "Open Keywords and choose Search on Google to check a phrase in your browser. SiteRadar measures positions automatically when a shared search service is configured, or you can connect your own provider account under Integrations.",
      },
      {
        title: "What is recorded",
        body: "Every query records its phrase, country, language, device, provider, timestamp, returned organic results, and matching domain. Average position uses only successful matching observations. “Not in returned results” only refers to the actual observed result depth.",
      },
      {
        title: "When no provider is connected",
        body: "Saved keywords stay visible with direct Google search links. Browser results depend on your search settings and location. A score of 100 in the SEO audit is possible even when the site is absent from the first 30 results for a keyword.",
      },
      {
        title: "Provider costs and limits",
        body: "Automatic checks can request up to three pages per keyword and record up to 30 organic positions. Shared service checks cover up to four saved keywords per audit. Your optional SerpApi integration uses your provider credits. Partial checks show their actual depth.",
      },
      {
        title: "Search competitors",
        body: "Competitors are grouped from the domains returned for the same queries. The comparison shows shared-query appearances and average observed result position. It does not invent competitor SEO scores or claim to know why Google ranked a page.",
      },
    ],
  },
  {
    slug: "reports-and-prompts",
    title: "Reports & repair prompts",
    description: "Keep the evidence connected to the work.",
    sections: [
      {
        title: "Investigate a finding",
        body: "Open an issue to see its rule, severity, evidence, affected URLs, and suggested next step. Filter by category, severity, or URL to focus on a page or a class of issues.",
      },
      {
        title: "Build a repair prompt",
        body: "Select findings and open Fix prompt. The Markdown brief includes those specific findings, URLs, evidence, and verification instructions. Leave all unchecked to include the full report. No source files are invented; your coding agent is asked to inspect the repository first.",
      },
      {
        title: "Export a report",
        body: "JSON contains the full audit snapshot. CSV contains findings and affected URLs, with spreadsheet-formula protection. PDF opens your browser’s print dialog for the current report view; choose Save as PDF.",
      },
      {
        title: "Verify your changes",
        body: "After applying fixes, choose Run again. Compare observations and lab measurements against a scan with the same device. A fix is not marked as verified until new evidence supports it.",
      },
    ],
  },
  {
    slug: "account-and-security",
    title: "Account & security",
    description: "How account access and local data are protected.",
    sections: [
      {
        title: "Account isolation",
        body: "Each account can read and manage only its own projects and audit reports. Sessions use random tokens stored as hashes on the server. Session cookies are HttpOnly and SameSite; HTTPS deployments also use Secure cookies.",
      },
      {
        title: "Passwords and integrations",
        body: "Passwords are salted and hashed with scrypt. Search-provider keys use AES-256-GCM encryption with a server-side key stored outside tracked source files. Password reset and email verification are not available in this local edition.",
      },
      {
        title: "Public destinations only",
        body: "The collector rejects private, loopback, link-local, metadata, and reserved addresses. HTTP redirects repeat DNS validation. Browser traffic passes through a local proxy that resolves, validates, and pins public destinations before connecting.",
      },
      {
        title: "Storage and deployment",
        body: "Accounts, sessions, projects, and reports are stored in the local SQLite database. Keep this local installation bound to loopback. Public production hosting needs HTTPS, backups, operational monitoring, and a deployment security review.",
      },
    ],
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    description: "Clear reasons and practical next steps.",
    sections: [
      {
        title: "A scan is queued",
        body: "The separate Node worker must be running. Start the app with npm run dev or npm start; both start the web server and worker. Queued runs survive a restart.",
      },
      {
        title: "A score is unavailable",
        body: "Open the report’s measurement notice. A browser or Lighthouse failure reports its actual error. The remaining collected findings are preserved. Run again to retry; a missing measurement is never presented as a zero score.",
      },
      {
        title: "A URL redirects outside scope",
        body: "Use the final canonical origin, including the correct www or non-www version. Off-origin navigation is blocked so an audit cannot silently expand its authorized scope.",
      },
      {
        title: "Robots.txt blocks the scan",
        body: "Review your site’s crawl policy. SiteRadar does not bypass robots rules, login walls, CAPTCHAs, or access protection.",
      },
      {
        title: "No keyword position appears",
        body: "Open a saved keyword on Google or run another audit when automatic search is available. The Keywords view shows each query’s observed depth and provider errors. Search position depends on the keyword and context.",
      },
    ],
  },
];
