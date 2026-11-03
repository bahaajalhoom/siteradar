"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {workspaceHref,type WorkspaceRoute,type WorkspaceView} from "@/lib/workspace-routes";
import {PageDetails,FindingDetails} from "./resource-details";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowSquareOut,
  ArrowUpRight,
  ArrowsClockwise,
  Bell,
  CaretDown,
  CaretRight,
  ChartLineUp,
  ChartPieSlice,
  Check,
  CheckCircle,
  Clock,
  Code,
  Copy,
  DownloadSimple,
  FileText,
  Flag,
  FolderSimple,
  GearSix,
  GlobeHemisphereWest,
  Info,
  Lightbulb,
  List,
  MagnifyingGlass,
  Monitor,
  Plus,
  Question,
  Scan,
  SignOut,
  ShieldCheck,
  SlidersHorizontal,
  SpinnerGap,
  SquaresFour,
  Target,
  TrendUp,
  Warning,
  X,
  type Icon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { exampleAudit, exampleKeywords } from "@/lib/example";
import {
  repairPrompt,
  type Audit,
  type Finding,
  type User,
  type AuditConfig,
  type Project,
} from "@/lib/types";
import { ScoreRing } from "./score-ring";
import { HealthChart } from "./project-chart";
import { NewAudit } from "./new-audit";
import { IntegrationsPanel } from "./integrations-panel";
import { PerformancePanel } from "./performance-panel";
import { LiveKeywords } from "./live-keywords";
import { LiveCompetitors } from "./live-competitors";
import {apiFetch} from "@/lib/api";

type View=WorkspaceView;
const EMPTY_AUDITS:Audit[]=[];
const EMPTY_SELECTION:string[]=[];
const reportNav: { name: View; icon: Icon }[] = [
  { name: "Overview", icon: SquaresFour },
  { name: "Issues", icon: Flag },
  { name: "Pages", icon: FileText },
  { name: "Performance", icon: ChartLineUp },
  { name: "Keywords", icon: MagnifyingGlass },
  { name: "Competitors", icon: ChartPieSlice },
  { name: "Fix prompt", icon: Code },
];
const titles: Record<View, string> = {
  Projects: "Your websites, all in one place.",
  Performance: "Your page speed, measured.",
  Overview: "Your website, in focus.",
  Issues: "Find the fixes that matter.",
  Pages: "Every page. A clearer picture.",
  Keywords: "Know where you stand.",
  Competitors: "See who shares your search.",
  "Fix prompt": "From findings to fixes.",
  "Audit history": "Every scan, on the record.",
  Integrations: "Connect your evidence.",
  Settings: "Your workspace, your way.",
};
function Badge({ severity }: { severity: string }) {
  return (
    <span className={`badge ${severity.toLowerCase()}`}>
      <span />
      {severity}
    </span>
  );
}
function saveFile(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const emptyAudit: Audit = {
  ...exampleAudit,
  id: "empty",
  name: "Your workspace",
  url: "https://your-website.com",
  synthetic: false,
  pages: [],
  findings: [],
  scores: [],
  score: null,
  config: {
    ...exampleAudit.config,
    url: "https://your-website.com",
    keywords: [],
  },
};
export function Workspace({
  user,
  initialAudits = EMPTY_AUDITS,
  demo = false,
  initialAudit,
  route,
  savedProjects=[],
  initialSelected=EMPTY_SELECTION,
  initialFilters,
}: {
  user?: User;
  initialAudits?: Audit[];
  demo?: boolean;
  initialAudit?:Audit;
  route?:WorkspaceRoute;
  savedProjects?:Project[];
  initialSelected?:string[];
  initialFilters?:{category?:string;search?:string};
}) {
  const router=useRouter();
  const currentRoute=route??{view:demo?'Overview':'Projects',scope:'workspace'} as WorkspaceRoute;
  const view=currentRoute.view;
  const [audit, setAudit] = useState<Audit>(initialAudit??(demo?exampleAudit:initialAudits[0]??emptyAudit)),
    [history, setHistory] = useState<Audit[]>(initialAudits),
    [scanConfig, setScanConfig] = useState<AuditConfig | undefined>(),
    [rerunning, setRerunning] = useState(false),
    [newOpen, setNewOpen] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false),
    [projectOpen, setProjectOpen] = useState(false),
    [helpOpen, setHelpOpen] = useState(false),
    [exportOpen, setExportOpen] = useState(false),
    [notifications, setNotifications] = useState(false),
    [selected, setSelected] = useState<string[]>(initialSelected),
    [search, setSearch] = useState(initialFilters?.search??""),
    [severity, setSeverity] = useState("All severities"),
    [category, setCategory] = useState(initialFilters?.category??"All categories"),
    [period, setPeriod] = useState("30 days"),
    [loadingHistory, setLoadingHistory] = useState(false),
    [historyError, setHistoryError] = useState(""),
    [workspaceName, setWorkspaceName] = useState("Studio workspace");
  const refreshHistory = useCallback(async () => {
    if (demo) return;
    try {
      const r = await apiFetch("/api/audits");
      if (!r.ok) throw new Error("Could not load saved scans.");
      const json = await r.json();
      setHistory(json.data);
      if (json.data[0]) setAudit((current) => current.id === "empty" ? json.data[0] : current);
      setHistoryError("");
    } catch (e) {
      setHistoryError(e instanceof Error ? e.message : "Unable to load scans.");
    } finally {
      setLoadingHistory(false);
    }
  }, [demo]);
  useEffect(() => {
    void refreshHistory();
    try {
      setWorkspaceName(
        localStorage.getItem(`siteradar-workspace-${user?.id ?? "demo"}`) ||
          "Studio workspace",
      );
    } catch {
      /* Browser storage is optional. */
    }
  }, [refreshHistory]);
  useEffect(()=>{if(initialAudit)setAudit(initialAudit);setHistory(initialAudits);},[initialAudit,initialAudits]);
  useEffect(()=>{if(view==='Fix prompt')setSelected(initialSelected);setSearch(initialFilters?.search??'');setCategory(initialFilters?.category??'All categories');setSeverity('All severities');},[view,initialSelected,initialFilters]);
  useEffect(() => {
    if (audit.synthetic || !["queued", "running"].includes(audit.status))
      return;
    let disposed = false;
    const timer = setInterval(async () => {
      try {
        const r = await apiFetch(`/api/audits/${audit.id}`);
        if (!r.ok) throw new Error();
        const json = await r.json();
        if (!disposed) {
          setAudit(json.data);
          if (!["queued", "running"].includes(json.data.status)) {
            void refreshHistory();
            toast(
              json.data.status === "completed"
                ? "Your report is ready."
                : "Scan stopped. See the activity log for details.",
            );
          }
        }
      } catch {
        if (!disposed)
          toast.error("Progress connection interrupted. Retrying…", {
            id: "progress",
          });
      }
    }, 2000);
    return () => {
      disposed = true;
      clearInterval(timer);
    };
  }, [audit.id, audit.status, audit.synthetic, refreshHistory]);
  function hrefFor(next:View,options?:{selectedIds?:string[];category?:string;search?:string}){
    let href=workspaceHref(next,{auditId:audit.id==='empty'?undefined:audit.id,projectId:audit.projectId,scope:currentRoute.scope});
    if(demo){const slug=next==='Overview'?'':next==='Projects'?'projects':next==='Integrations'?'settings/integrations':next==='Settings'?'settings':({Issues:'issues',Pages:'pages',Performance:'performance',Keywords:'keywords',Competitors:'competitors','Fix prompt':'fix-prompt','Audit history':'audits'} as Partial<Record<View,string>>)[next];href='/demo'+(slug?'/'+slug:'');}
    const query=new URLSearchParams();const ids=options?.selectedIds??selected;
    if(next==='Fix prompt'&&ids.length)query.set('issues',ids.join(','));
    if(options?.category)query.set('category',options.category);
    if(options?.search)query.set('search',options.search);
    return href+(query.size?'?'+query.toString():'');
  }
  function navigate(next:View,options?:{selectedIds?:string[];category?:string;search?:string}){setMobileOpen(false);setProjectOpen(false);router.push(hrefFor(next,options));}
  function chooseAudit(a:Audit,scope:'audit'|'project'='audit'){setProjectOpen(false);setMobileOpen(false);setSelected([]);router.push(demo?'/demo':workspaceHref('Overview',{auditId:a.id,projectId:a.projectId,scope}));}
  function openFinding(f:Finding){router.push(hrefFor('Issues')+'/'+encodeURIComponent(f.id));}
  function created(a: Audit) {
    setAudit(a);
    chooseAudit(a);
    void refreshHistory();
  }
  const filtered = useMemo(
    () =>
      audit.findings.filter(
        (f) =>
          (severity === "All severities" || f.severity === severity) &&
          (category === "All categories" || f.category === category) &&
          `${f.title} ${f.rule} ${f.pages.join(" ")}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [audit.findings, severity, category, search],
  );
  const openIssues = audit.findings.length;
  const critical = audit.findings.filter(
    (f) => f.severity === "Critical",
  ).length;
  const host = new URL(audit.url).hostname;
  const prompt = repairPrompt(audit, selected);
  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success("Repair prompt copied.");
    } catch {
      toast.error("Clipboard access unavailable. Download the prompt instead.");
    }
  }
  function exportReport(format: string) {
    if (format === "PDF") {
      window.print();
    } else if (format === "JSON") {
      saveFile(
        `siteradar-${audit.id}.json`,
        JSON.stringify(audit, null, 2),
        "application/json",
      );
    } else {
      const cell = (x: string) =>
        `"${(/^[=+@\-\t\r]/.test(x) ? "'" : "") + x.replaceAll('"', '""')}"`;
      const rows = [
        [
          "Rule",
          "Severity",
          "Category",
          "Finding",
          "Pages",
          "Evidence",
          "Recommendation",
        ],
        ...audit.findings.map((f) => [
          f.rule,
          f.severity,
          f.category,
          f.title,
          f.pages.join("; "),
          f.evidence,
          f.recommendation,
        ]),
      ];
      saveFile(
        `siteradar-${audit.id}.csv`,
        rows.map((row) => row.map(cell).join(",")).join("\r\n"),
        "text/csv;charset=utf-8",
      );
    }
    setExportOpen(false);
    toast.success(
      format === "PDF"
        ? "Print dialog opened. Choose Save as PDF."
        : `${format} report downloaded.`,
    );
  }
  async function cancel() {
    try {
      const r = await apiFetch(`/api/audits/${audit.id}`, { method: "PATCH" });
      const json = await r.json();
      if (!r.ok) throw new Error();
      setAudit(json.data);
      void refreshHistory();
    } catch {
      toast.error("Could not cancel. Try again.");
    }
  }
  function toggleFinding(id: string) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  }
  const active = ["queued", "running"].includes(audit.status);
  const projects = [
    ...new Map(
      [...history].reverse().map((a) => [new URL(a.url).origin, a]),
    ).values(),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const observedRanks =
    audit.rankings?.filter((r) => !r.error && r.position !== null) ?? [];
  const averageRank = observedRanks.length
    ? (
        observedRanks.reduce((sum, r) => sum + r.position!, 0) /
        observedRanks.length
      ).toFixed(1)
    : null;
  function newWebsite() {
    if (demo) {
      window.location.href = "/sign-up";
      return;
    }
    setScanConfig(undefined);
    setNewOpen(true);
  }
  function configure() {
    if (demo) {
      window.location.href = "/sign-up";
      return;
    }
    setScanConfig(audit.config);
    setNewOpen(true);
  }
  async function runAgain() {
    if (demo) {
      window.location.href = "/sign-up";
      return;
    }
    setRerunning(true);
    try {
      const r = await apiFetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(audit.config),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      created(data.data);
      toast.success("Audit started with your saved settings.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start audit.");
    } finally {
      setRerunning(false);
    }
  }
  async function signOut() {
    try {
      const r = await apiFetch("/api/auth/sign-out", { method: "POST" });
      if (!r.ok) throw new Error();
      window.location.href = "/sign-in";
    } catch {
      toast.error("Could not sign out. Try again.");
    }
  }
  const findingDetail=currentRoute.view==='Issues'&&currentRoute.detailId?audit.findings.find(f=>f.id===currentRoute.detailId):undefined;
  const pageDetail=currentRoute.view==='Pages'&&currentRoute.detailId?audit.pages.find(p=>p.id===currentRoute.detailId):undefined;
  if (audit.id === "empty"&&view!=="Settings"&&view!=="Integrations")
    return (
      <div className="public-site">
        <header className="public-header">
          <Link className="public-brand" href="/">
            <Scan size={28} />
            SiteRadar.
          </Link>
          <nav>
            <Link href="/pricing">Free · Unlimited</Link>
            <Link href="/docs">Docs</Link>
          </nav>
          <button className="btn" onClick={signOut}>
            Sign out
          </button>
        </header>
        <main className="public-container">
          <div className="workspace-empty">
            <GlobeHemisphereWest size={46} />
            <h1>Welcome, {user?.name.split(" ")[0] ?? "there"}.</h1>
            <p>
              Add your website once. We’ll remember it, collect real
              measurements, and build a clear plan for what to improve.
            </p>
            <button className="btn primary" onClick={newWebsite}>
              <Plus size={19} />
              Add your first website
            </button>
            <p>
              <Link href="/demo">Explore an example report</Link> ·{" "}
              <Link href="/docs/getting-started">
                Read the getting-started guide
              </Link> · <Link href="/app/settings/integrations">Set up integrations</Link>
            </p>
          </div>
        </main>
        <NewAudit
          open={newOpen}
          onOpenChange={setNewOpen}
          onCreated={created}
        />
      </div>
    );
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Skip to report
      </a>
      {mobileOpen && (
        <button
          className="sidebar-scrim"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`}>
        <a
          className="brand"
          href={demo ? "/" : "/app"}
          aria-label="SiteRadar home"
        >
          <span className="brand-symbol">
            <Scan size={27} weight="bold" />
            <i />
          </span>
          <span>
            SiteRadar<span className="brand-dot">.</span>
          </span>
        </a>
        <div className="sidebar-workspace-name">{workspaceName}</div>
        <div className="workspace-picker">
          <span className="workspace-avatar">S</span>
          <div>
            <strong>{workspaceName}</strong>
            <span>Personal workspace</span>
          </div>
          <CaretDown size={14} />
        </div>
        <div className="nav-caption">WORKSPACE</div>
        <button
          className={`nav-item ${view==='Projects'?'active':''}`}
          onClick={() => navigate("Projects")}
        >
          <FolderSimple size={19} />
          All projects
          <span className="nav-count">{demo ? 1 : projects.length}</span>
        </button>
        <div className="nav-caption project-caption">
          CURRENT PROJECT
          <span className="tiny-status" />
        </div>
        <button
          className="sidebar-project"
          onClick={() => setProjectOpen(!projectOpen)}
        >
          <span className="project-letter">
            {audit.synthetic ? "f" : host[0].toUpperCase()}
          </span>
          <span>{audit.name}</span>
          <CaretDown size={13} />
        </button>
        <nav aria-label="Report navigation">
          {reportNav.map(({ name, icon: Icon }) => (
            <Link
              key={name}
              className={`nav-item ${view === name ? "active" : ""}`}
              href={hrefFor(name)} aria-current={view===name?'page':undefined}
            >
              <Icon size={19} weight={view === name ? "fill" : "regular"} />
              <span>{name}</span>
              {name === "Issues" && (
                <span className="nav-count issue-count">{openIssues}</span>
              )}
            </Link>
          ))}
          <div className="nav-separator" />
          <button
            className={`nav-item ${view === "Audit history" ? "active" : ""}`}
            onClick={() => navigate("Audit history")}
          >
            <Clock size={19} />
            Audit history
          </button>
          <button
            className={`nav-item ${view === "Integrations" ? "active" : ""}`}
            onClick={() => navigate("Integrations")}
          >
            <SlidersHorizontal size={19} />
            Integrations
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-orbit">
              <Target size={21} />
            </span>
            <strong>A clearer path to growth.</strong>
            <p>
              Less guesswork.
              <br />
              More things worth fixing.
            </p>
            <button onClick={newWebsite}>
              Run a new audit
              <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="sidebar-utility">
            <Link href="/docs">
              <Question size={16} />
              Docs
            </Link>
            <Link href="/pricing">
              Free · Unlimited
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <button
            className={`nav-item ${view === "Settings" ? "active" : ""}`}
            onClick={() => navigate("Settings")}
          >
            <GearSix size={19} />
            Settings
          </button>
          <div className="profile">
            <span className="avatar">SR</span>
            <div>
              <strong>{user?.name ?? "Example visitor"}</strong>
              <span>
                {demo ? "Example workspace" : "Free plan · Unlimited"}
              </span>
            </div>
            {user && (
              <button
                className="icon-btn"
                onClick={signOut}
                aria-label="Sign out"
              >
                <SignOut size={19} />
              </button>
            )}
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumbs">
            <button
              className="icon-btn mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <List size={22} />
            </button>
            <span className="breadcrumb-root">Workspace</span>
            <CaretRight size={12} />
            <button onClick={() => setProjectOpen(!projectOpen)}>
              {audit.name}
            </button>
            <CaretRight size={12} />
            <strong>{view}</strong>
          </div>
          <div className="topbar-right">
            <span className="local-indicator">
              <i />
              Local workspace
            </span>
            <button
              className={`icon-btn ${notifications ? "pressed" : ""}`}
              aria-label="Notifications"
              onClick={() => setNotifications(!notifications)}
            >
              <Bell size={20} />
              <span className="notification-dot" />
            </button>
            <span className="avatar small">SR</span>
          </div>
          {notifications && (
            <div className="notification-popover">
              <h3>Workspace activity</h3>
              <p>
                {audit.synthetic
                  ? "You’re viewing the example report. Run an audit to collect your own evidence."
                  : audit.events.at(-1)?.message}
              </p>
              <button
                className="text-link"
                onClick={() => {
                  navigate("Audit history");
                  setNotifications(false);
                }}
              >
                View audit history
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </header>
        {projectOpen && (
          <div className="project-popover">
            <div className="popover-heading">
              Switch project
              <button
                className="icon-btn"
                onClick={() => setProjectOpen(false)}
                aria-label="Close projects"
              >
                <X size={16} />
              </button>
            </div>
            {demo && (
              <button onClick={() => chooseAudit(exampleAudit)}>
                <span className="project-letter">f</span>
                <span>
                  Form & Field<small>Example project</small>
                </span>
                {audit.synthetic && <Check size={16} />}
              </button>
            )}
            {projects.map((a) => (
              <Link className="project-choice" key={a.id} href={demo?'/demo':workspaceHref('Overview',{projectId:a.projectId,auditId:a.id,scope:'project'})}>
                <GlobeHemisphereWest size={20} />
                <span>
                  {a.name}
                  <small>
                    {a.status} ·{" "}
                    {new Date(a.createdAt).toLocaleDateString("en-GB", {
                      timeZone: "Asia/Jerusalem",
                    })}
                  </small>
                </span>
              </Link>
            ))}
            <button
              className="add-project"
              onClick={() => {
                setProjectOpen(false);
                newWebsite();
              }}
            >
              <Plus size={18} />
              Audit a new website
            </button>
          </div>
        )}
        <main id="main" className="main-content">
          {demo && (
            <div className="demo-banner">
              You’re exploring an illustrative report.{" "}
              <Link href="/sign-up">Create your free workspace</Link>
            </div>
          )}
          <div className="page-heading">
            <div>
              <h1>{titles[view]}</h1>
              <p>
                {view === "Overview"
                  ? "A complete picture of your search health. A clear idea of what’s next."
                  : view === "Issues"
                    ? "Prioritized findings, backed by page-level evidence."
                    : view === "Fix prompt"
                      ? "A practical repair brief, built from the issues you choose."
                      : view === "Integrations"
                        ? "Keep external measurements connected to their source."
                        : "Search intelligence you can trace back to the evidence."}
              </p>
            </div>
            <div className="heading-actions">
              <div className="export-wrap">
                <button
                  className="btn"
                  onClick={() => setExportOpen(!exportOpen)} disabled={audit.id==='empty'}
                >
                  <DownloadSimple size={16} />
                  Export report
                  <CaretDown size={12} />
                </button>
                {exportOpen && (
                  <div className="export-menu">
                    {["PDF", "CSV", "JSON"].map((f) => (
                      <button key={f} onClick={() => exportReport(f)}>
                        Export {f}
                        {f === "PDF" && <small>Print to PDF</small>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {!demo && audit.id!=='empty' && (
                <>
                  <button className="btn" onClick={configure}>
                    <GearSix size={17} />
                    Scan settings
                  </button>
                  <button
                    className="btn primary"
                    onClick={runAgain}
                    disabled={active || rerunning}
                  >
                    <ArrowsClockwise
                      size={17}
                      className={rerunning ? "spin" : ""}
                    />
                    Run again
                  </button>
                </>
              )}
              <button className="btn" onClick={newWebsite}>
                <Plus size={17} />
                New website
              </button>
            </div>
          </div>
          {audit.id!=='empty'&&<div className="project-strip">
            <div className="site-identity">
              <span className="site-mark">
                {audit.synthetic ? "f" : host[0].toUpperCase()}
                <span />
              </span>
              <div>
                <strong>
                  {host}
                  <ArrowSquareOut size={12} />
                </strong>
                <span>
                  {audit.synthetic
                    ? "Design-led objects for everyday work"
                    : audit.url}
                </span>
              </div>
            </div>
            <div className="scan-context">
              <span>
                <GlobeHemisphereWest size={14} />
                {audit.config.country}
              </span>
              <span>
                <Monitor size={14} />
                {audit.config.device}
              </span>
              <span>
                <Clock size={14} />
                {audit.synthetic
                  ? "Nov 3, 2026 · 09:44"
                  : new Date(audit.createdAt).toLocaleString("en-GB", {
                      timeZone: "Asia/Jerusalem",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
              </span>
              <span className={`status-pill ${active ? "pending" : ""}`}>
                <i />
                {active
                  ? "Scan in progress"
                  : audit.status === "completed"
                    ? "Audit complete"
                    : audit.status}
              </span>
            </div>
          </div>}
          {audit.id!=='empty'&&(audit.synthetic ? (
            <div className="example-label">
              <Info size={14} />
              <span>
                Example workspace{" "}
                <span className="example-detail">
                  · Explore a sample report. All measurements are illustrative.
                </span>
              </span>
              <button onClick={newWebsite}>
                Audit your website
                <ArrowRight size={13} />
              </button>
            </div>
          ) : (
            <div className="example-label live-label">
              <ShieldCheck size={15} />
              <span>
                {audit.performance
                  ? "Rendered-page audit · Lighthouse and axe measured on the homepage"
                  : active
                    ? "Audit in progress · measurements will appear as checks finish"
                    : "Page observations collected · run again to add current browser measurements"}
              </span>
              <button onClick={() => navigate("Integrations")}>
                View capabilities
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
          {(active ||
            audit.status === "failed" ||
            audit.status === "cancelled") && (
            <section className="progress-panel">
              <div className="section-heading">
                <h2>
                  {active ? (
                    <>
                      <SpinnerGap className="spin" size={18} />{" "}
                      {audit.status === "queued"
                        ? "Your scan is queued"
                        : "Collecting page evidence"}
                    </>
                  ) : audit.status === "failed" ? (
                    "The scan needs your attention"
                  ) : (
                    "Scan cancelled"
                  )}
                </h2>
                {active ? (
                  <button className="btn" onClick={cancel}>
                    Cancel scan
                  </button>
                ) : (
                  <button
                    className="btn"
                    onClick={runAgain}
                    disabled={rerunning}
                  >
                    Retry saved settings
                  </button>
                )}
              </div>
              <p>{audit.error ?? audit.events.at(-1)?.message}</p>
              <div className="event-log">
                {audit.events.slice(-5).map((e, i) => (
                  <div key={i}>
                    <time>
                      {new Date(e.time).toLocaleTimeString("en-GB", {
                        timeZone: "Asia/Jerusalem",
                      })}
                    </time>
                    <span>{e.message}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          {view === "Projects" && (
            <section className="panel report-panel">
              <div className="section-heading">
                <h2>Saved websites</h2>
                <button className="btn primary" onClick={newWebsite}>
                  <Plus size={18} />
                  Add website
                </button>
              </div>
              <div className="project-summary-list">
                {(demo ? [exampleAudit] : projects).map((a) => (
                  <Link className="project-choice" key={a.id} href={demo?'/demo':workspaceHref('Overview',{projectId:a.projectId,auditId:a.id,scope:'project'})}>
                    <GlobeHemisphereWest size={26} />
                    <div>
                      <strong>{a.name}</strong>
                      <span>
                        {a.pages.length} pages · {a.findings.length} findings ·{" "}
                        {a.status}
                      </span>
                      <span>
                        Last audit:{" "}
                        {new Date(a.createdAt).toLocaleDateString("en-GB", {
                          timeZone: "Asia/Jerusalem",
                        })}
                      </span>
                    </div>
                    <ArrowRight size={20} />
                  </Link>
                ))}
              </div>
            </section>
          )}
          {view === "Performance" && (
            <>
              <PerformancePanel audit={audit} />
              {!audit.performance && (
                <section className="panel report-panel">
                  <Empty
                    icon={Monitor}
                    text={
                      active
                        ? "Measuring the homepage…"
                        : "Measure your site’s actual performance."
                    }
                    detail="Run this project with its saved configuration. Lighthouse will measure the homepage using your selected device."
                  />
                  <button
                    className="btn primary"
                    onClick={runAgain}
                    disabled={active || rerunning}
                  >
                    <ArrowsClockwise size={18} />
                    Run performance audit
                  </button>
                </section>
              )}
            </>
          )}
          {view === "Overview" && (
            <>
              <section className="overview-summary">
                <div className="health-summary">
                  <div className="section-heading">
                    <h2>
                      Site health
                      <Info size={14} />
                    </h2>
                    <span className="quiet-label">OVERALL SCORE</span>
                  </div>
                  <div className="health-main">
                    <ScoreRing score={audit.score} />
                    <div className="health-description">
                      <span className="badge healthy">
                        <span />
                        {audit.synthetic
                          ? "Good foundation"
                          : audit.score !== null
                            ? "Measured audit"
                            : "Collecting evidence"}
                      </span>
                      <h3>
                        {audit.synthetic ? (
                          <>
                            Good. Let’s make
                            <br />
                            it great.
                          </>
                        ) : (
                          <>
                            {audit.score !== null
                              ? audit.score >= 80
                                ? "A strong foundation."
                                : "A focused path forward."
                              : "Your audit is taking shape."}
                          </>
                        )}
                      </h3>
                      <p>
                        {audit.synthetic
                          ? "Your site is doing a lot right. A few focused fixes can take it further."
                          : audit.score !== null
                            ? "Based on the available checks in this report. Open any finding to see its evidence."
                            : "Your actual scores will appear as checks finish."}
                      </p>
                      {audit.synthetic && (
                        <span className="positive">
                          <TrendUp size={15} />
                          12 points<span>vs. previous example</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="health-footer">
                    <span>
                      <i className="legend-dot green" />
                      0–49 Needs attention
                    </span>
                    <span>
                      <i className="legend-dot lime" />
                      50–79 Good
                    </span>
                    <span>
                      <i className="legend-dot deep" />
                      80–100 Great
                    </span>
                  </div>
                </div>
                <div className="trend-summary">
                  <div className="section-heading">
                    <div>
                      <h2>
                        {audit.synthetic
                          ? "Moving in the right direction"
                          : "Your audit history"}
                      </h2>
                      <p>
                        {audit.synthetic
                          ? "Small improvements. Compounding results."
                          : "Real measurements from this website and device."}
                      </p>
                    </div>
                    <select
                      className="compact-select"
                      aria-label="Health trend period"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      <option>30 days</option>
                      <option>14 days</option>
                      <option>7 days</option>
                    </select>
                  </div>
                  <HealthChart
                    period={period}
                    audit={audit}
                    history={history}
                  />
                  <div className="chart-legend">
                    <span>
                      <i className="legend-line" />
                      Audit score
                    </span>
                    <span>
                      <i className="legend-line pale" />
                      SEO score
                    </span>
                    <span className="synthetic-note">
                      {audit.synthetic ? "Example trend" : "Observed snapshots"}
                    </span>
                  </div>
                </div>
              </section>
              <section className="metric-strip" aria-label="Audit summary">
                <Metric
                  label="Pages crawled"
                  value={String(audit.pages.length)}
                  detail={
                    audit.synthetic
                      ? "12 example pages shown"
                      : audit.config.maxPages
                        ? `of ${audit.config.maxPages} selected pages`
                        : "All-pages crawl"
                  }
                  icon={FileText}
                />
                <Metric
                  label="Open issues"
                  value={String(openIssues)}
                  detail={`${critical} critical · ${audit.findings.filter((f) => f.severity === "High").length} high priority`}
                  icon={Flag}
                  warning
                />
                <Metric
                  label="Tracked keywords"
                  value={String(audit.config.keywords.length)}
                  detail={
                    audit.synthetic
                      ? "2 in the top 10"
                      : audit.rankingStatus === "ready"
                        ? "Observed search results"
                        : "Saved for search tracking"
                  }
                  icon={MagnifyingGlass}
                />
                <Metric
                  label="Average position"
                  value={
                    audit.synthetic ? "16.6" : (averageRank ?? "Not connected")
                  }
                  detail={
                    audit.synthetic
                      ? "↑ 4.2 positions · example"
                      : audit.rankingStatus === "ready"
                        ? "Matched keywords only"
                        : "Connect search in Integrations"
                  }
                  icon={TrendUp}
                />
              </section>
              {!audit.synthetic && <PerformancePanel audit={audit} />}
              <section className="category-section">
                <div className="section-heading">
                  <h2>
                    The bigger picture
                    <span className="heading-note">
                      Five perspectives. One healthier website.
                    </span>
                  </h2>
                  <button
                    className="text-link"
                    onClick={() => navigate("Issues")}
                  >
                    Explore all findings
                    <ArrowRight size={14} />
                  </button>
                </div>
                <div className="category-grid">
                  {(audit.scores.length
                    ? audit.scores
                    : exampleAudit.scores.map((s) => ({
                        ...s,
                        value: null,
                        note: "Waiting for scan",
                      }))
                  ).map((s, i) => (
                    <button
                      className="category-item"
                      key={s.category}
                      onClick={() => {
                        if(s.category==='Performance')navigate('Performance');else navigate("Issues",{category:s.category});
                      }}
                    >
                      <div className="category-label">
                        <span>
                          {s.category === "GEO readiness" ? "GEO" : s.category}
                        </span>
                        {i === 1 ? (
                          <span className="small-chip">AI readiness</span>
                        ) : (
                          <ArrowUpRight size={15} />
                        )}
                      </div>
                      <div className="category-score">
                        <strong
                          className={
                            s.value !== null && s.value < 70 ? "amber-text" : ""
                          }
                        >
                          {s.value ?? "—"}
                        </strong>
                        <span>/ 100</span>
                        <MiniBars value={s.value} />
                      </div>
                      <div className="category-track">
                        <span
                          style={{ width: `${s.value ?? 0}%` }}
                          className={
                            s.value !== null && s.value < 70 ? "amber" : ""
                          }
                        />
                      </div>
                      <p>
                        <i
                          className={
                            s.value !== null && s.value < 70 ? "amber-dot" : ""
                          }
                        />
                        {s.note}
                      </p>
                    </button>
                  ))}
                </div>
              </section>
              <div className="bottom-grid">
                <section className="priorities panel">
                  <div className="section-heading">
                    <div>
                      <h2>
                        Start here
                        <span className="count-chip">
                          {audit.findings.length}
                        </span>
                      </h2>
                      <p>The fixes most likely to move the needle.</p>
                    </div>
                    <button
                      className="text-link"
                      onClick={() => navigate("Issues")}
                    >
                      View all issues
                      <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="priority-list">
                    {audit.findings.slice(0, 4).map((f, i) => (
                      <button
                        className="priority-row"
                        key={f.id}
                        onClick={() => openFinding(f)}
                      >
                        <span
                          className={`priority-indicator ${f.severity.toLowerCase()}`}
                        >
                          {i === 0 && f.severity === "Critical" ? (
                            <Warning size={18} />
                          ) : (
                            <Flag size={17} />
                          )}
                        </span>
                        <div>
                          <strong>{f.title}</strong>
                          <span>
                            {f.pages.length} pages affected
                            <span className="dot-separator">·</span>
                            {f.category}
                            <span className="dot-separator">·</span>
                            {f.effort}
                          </span>
                        </div>
                        <Badge severity={f.severity} />
                        <CaretRight size={14} />
                      </button>
                    ))}
                    {!audit.findings.length && (
                      <div className="empty-state">
                        <CheckCircle size={28} />
                        <p>
                          {active
                            ? "Findings will appear as pages are analyzed."
                            : "No findings in this report."}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
                <section className="next-step">
                  <div className="next-step-icon">
                    <Code size={24} />
                    <span className="small-cross">+</span>
                  </div>
                  <span className="small-chip">FROM INSIGHT TO ACTION</span>
                  <h2>
                    A report is a start.
                    <br />A fix is progress.
                  </h2>
                  <p>
                    Turn your audit findings into a focused repair prompt for
                    your developer or coding agent.
                  </p>
                  <button
                    className="btn primary"
                    onClick={() => navigate("Fix prompt")}
                  >
                    Build your fix prompt
                    <ArrowRight size={16} />
                  </button>
                  <div className="next-step-foot">
                    <CheckCircle size={13} />
                    Specific to your site. Grounded in evidence.
                  </div>
                </section>
              </div>
            </>
          )}
          {findingDetail&&<FindingDetails audit={audit} finding={findingDetail} backHref={hrefFor('Issues')} pagesHref={hrefFor('Pages')} onAdd={()=>navigate('Fix prompt',{selectedIds:[...new Set([...selected,findingDetail.id])]})}/>}
          {pageDetail&&<PageDetails audit={audit} page={pageDetail} backHref={hrefFor('Pages')} issuesHref={hrefFor('Issues')}/>}
          {view === "Issues" && !findingDetail && (
            <section className="panel report-panel">
              <div className="section-heading">
                <h2>
                  All findings
                  <span className="count-chip">{filtered.length}</span>
                </h2>
                <button
                  className="btn"
                  disabled={!filtered.length}
                  onClick={() => {
                    navigate("Fix prompt",{selectedIds:filtered.map(f=>f.id)});
                  }}
                >
                  <Code size={16} />
                  Build prompt from results
                </button>
              </div>
              <div className="filters">
                <Search
                  value={search}
                  onChange={setSearch}
                  placeholder="Search findings or page URLs…"
                />
                <select
                  aria-label="Filter severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  {["All severities", "Critical", "High", "Medium", "Low"].map(
                    (s) => (
                      <option key={s}>{s}</option>
                    ),
                  )}
                </select>
                <select
                  aria-label="Filter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {[
                    "All categories",
                    "SEO",
                    "GEO readiness",
                    "Performance",
                    "Accessibility",
                    "Technical",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="findings-table">
                {filtered.map((f) => (
                  <div className="finding-row" key={f.id}>
                    <input
                      type="checkbox"
                      checked={selected.includes(f.id)}
                      onChange={() => toggleFinding(f.id)}
                      aria-label={`Add ${f.title} to repair prompt`}
                    />
                    <button
                      className="finding-title"
                      onClick={() => openFinding(f)}
                    >
                      <span className="rule-id">{f.rule}</span>
                      <strong>{f.title}</strong>
                      <span>
                        {f.pages.length} pages · {f.category} · {f.kind}
                      </span>
                    </button>
                    <Badge severity={f.severity} />
                    <button
                      className="icon-btn"
                      aria-label={`View ${f.title}`}
                      onClick={() => openFinding(f)}
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                ))}
              </div>
              {!filtered.length && (
                <Empty text="No findings match these filters." />
              )}
            </section>
          )}
          {view === "Pages" && !pageDetail && (
            <section className="panel report-panel">
              <div className="section-heading">
                <h2>
                  Crawled pages
                  <span className="count-chip">{audit.pages.length}</span>
                </h2>
                <span className="muted">
                  {audit.synthetic
                    ? "12 example pages shown"
                    : "Rendered HTML when available · see measurement notes"}
                </span>
              </div>
              <div className="filters">
                <Search
                  value={search}
                  onChange={setSearch}
                  placeholder="Search page URL or title…"
                />
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>HTTP</th>
                      <th>Index directive</th>
                      <th>Words</th>
                      <th>Findings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audit.pages
                      .filter((p) =>
                        (p.url + p.title)
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                      )
                      .map((p) => (
                        <tr key={p.url}>
                          <td>
                            <Link className="page-detail-link" href={hrefFor('Pages')+'/'+encodeURIComponent(p.id??'unknown')}><strong>{p.title || "Untitled page"}</strong></Link>
                            <span className="table-sub">
                              {new URL(p.url).pathname}
                            </span>
                          </td>
                          <td>
                            <span
                              className={
                                p.status === 200 ? "positive" : "amber-text"
                              }
                            >
                              {p.status}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-text ${p.indexable ? "" : "amber-text"}`}
                            >
                              <i />
                              {p.indexable
                                ? "No meta noindex"
                                : "Excluded / error"}
                            </span>
                          </td>
                          <td>{p.words.toLocaleString("en-GB")}</td>
                          <td>
                            <button
                              className="issue-link"
                              onClick={() => {
                                navigate("Issues",{search:p.url});
                              }}
                            >
                              {p.issues} findings
                              <ArrowUpRight size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!audit.pages.length && (
                <Empty text="Pages will appear after the worker fetches your website." />
              )}
            </section>
          )}
          {view === "Keywords" && (
            <section className="panel report-panel">
              <div className="section-heading">
                <div>
                  <h2>Keyword rankings</h2>
                  <p>
                    Google · {audit.config.country} · {audit.config.language} ·{" "}
                    {audit.config.device}
                  </p>
                </div>
                <span className="small-chip">
                  {audit.synthetic
                    ? "SYNTHETIC EXAMPLE"
                    : audit.rankingStatus === "ready"
                      ? "SERPAPI · OBSERVED"
                      : "SAVED KEYWORDS"}
                </span>
              </div>
              {audit.synthetic ? (
                <>
                  <div className="filters">
                    <Search
                      value={search}
                      onChange={setSearch}
                      placeholder="Search keywords…"
                    />
                    <span className="muted">
                      Example check · Nov 3, 2026, 09:44 Jerusalem
                    </span>
                  </div>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Keyword</th>
                          <th>Position</th>
                          <th>Change</th>
                          <th>Monthly volume</th>
                          <th>Ranking page</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exampleKeywords
                          .filter((k) =>
                            k.phrase.includes(search.toLowerCase()),
                          )
                          .map((k) => (
                            <tr key={k.phrase}>
                              <td>
                                <strong>{k.phrase}</strong>
                              </td>
                              <td>
                                <span className="rank-position">
                                  {k.position}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={
                                    k.change > 0 ? "positive" : "negative"
                                  }
                                >
                                  {k.change > 0 ? (
                                    <ArrowUpRight size={14} />
                                  ) : (
                                    <ArrowDownRight size={14} />
                                  )}{" "}
                                  {Math.abs(k.change)}
                                </span>
                              </td>
                              <td>{k.volume}</td>
                              <td className="mono small-text">{k.page}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <LiveKeywords
                    audit={audit}
                    onConnect={() => navigate("Integrations")}
                    onEdit={configure}
                  />
                </>
              )}
            </section>
          )}
          {view === "Competitors" && (
            <section className="panel report-panel">
              <div className="section-heading">
                <div>
                  <h2>Your search neighborhood</h2>
                  <p>Domains appearing for the same search intent.</p>
                </div>
                <span className="small-chip">
                  {audit.synthetic
                    ? "EXAMPLE COMPARISON"
                    : audit.rankings?.some(
                          (r) => !r.error && r.results.length > 0,
                        )
                      ? "SERPAPI · OBSERVED"
                      : "NO SEARCH RESULTS YET"}
                </span>
              </div>
              {audit.synthetic ? (
                <>
                  <div className="competitor-insight">
                    <Lightbulb size={21} />
                    <p>
                      <strong>There’s room to own your niche.</strong> In this
                      example, focused product pages compete better than broad
                      collection pages. Verify this with live results before
                      changing your strategy.
                    </p>
                  </div>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Domain</th>
                          <th>Shared keywords</th>
                          <th>Average position</th>
                          <th>SEO score</th>
                          <th>Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            name: "Form & Field",
                            host: "formandfield.example",
                            keywords: 5,
                            rank: 16.6,
                            score: 78,
                          },
                          {
                            name: "Grovemade",
                            host: "grovemade.example",
                            keywords: 4,
                            rank: 5.2,
                            score: 91,
                          },
                          {
                            name: "Ugmonk",
                            host: "ugmonk.example",
                            keywords: 3,
                            rank: 8.4,
                            score: 86,
                          },
                          {
                            name: "Orbitkey",
                            host: "orbitkey.example",
                            keywords: 3,
                            rank: 11.8,
                            score: 82,
                          },
                        ].map((c, i) => (
                          <tr key={c.host}>
                            <td>
                              <strong>
                                {c.name}
                                {i === 0 && (
                                  <span className="you-label">YOU</span>
                                )}
                              </strong>
                              <span className="table-sub">{c.host}</span>
                            </td>
                            <td>{c.keywords}</td>
                            <td>{c.rank}</td>
                            <td>
                              <div className="inline-score">
                                {c.score}
                                <span>
                                  <i style={{ width: `${c.score}%` }} />
                                </span>
                              </div>
                            </td>
                            <td className="muted">Synthetic fixture</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <LiveCompetitors
                  audit={audit}
                  onConnect={() => navigate("Integrations")}
                />
              )}
            </section>
          )}
          {view === "Fix prompt" && (
            <div className="prompt-layout">
              <section className="panel prompt-options">
                <h2>Choose your focus</h2>
                <p>
                  Select findings to include. Leave all unchecked to include the
                  full report.
                </p>
                <div className="prompt-selection">
                  {audit.findings.map((f) => (
                    <label key={f.id}>
                      <input
                        type="checkbox"
                        checked={selected.includes(f.id)}
                        onChange={() => toggleFinding(f.id)}
                      />
                      <span>
                        <strong>{f.title}</strong>
                        <small>
                          {f.rule} · {f.severity}
                        </small>
                      </span>
                    </label>
                  ))}
                </div>
                <div className="notice">
                  <ShieldCheck size={20} />
                  <p>
                    The prompt asks your developer to inspect the repository,
                    preserve your design, and verify every fix.
                  </p>
                </div>
              </section>
              <section className="panel prompt-preview">
                <div className="section-heading">
                  <h2>
                    <Code size={18} />
                    Your repair brief
                  </h2>
                  <span className="small-chip">MARKDOWN</span>
                </div>
                <pre>{prompt}</pre>
                <div className="prompt-actions">
                  <button
                    className="btn"
                    onClick={() =>
                      saveFile(
                        "siteradar-repair-prompt.md",
                        prompt,
                        "text/markdown",
                      )
                    }
                  >
                    <DownloadSimple size={16} />
                    Download .md
                  </button>
                  <button className="btn primary" onClick={copyPrompt}>
                    <Copy size={16} />
                    Copy prompt
                  </button>
                </div>
              </section>
            </div>
          )}
          {view === "Audit history" && (
            <section className="panel report-panel">
              <div className="section-heading">
                <h2>Saved scans</h2>
                <button className="btn" onClick={refreshHistory}>
                  <ArrowsClockwise size={15} />
                  Refresh
                </button>
              </div>
              {loadingHistory ? (
                <Empty icon={SpinnerGap} text="Loading saved scans…" />
              ) : historyError ? (
                <div className="empty-state">
                  <p>{historyError}</p>
                  <button className="btn" onClick={refreshHistory}>
                    Retry
                  </button>
                </div>
              ) : history.length ? (
                <div className="history-list">
                  {history.map((a) => (
                    <Link className="history-choice" key={a.id} href={demo?'/demo':workspaceHref('Overview',{auditId:a.id,scope:'audit'})}>
                      <span className="history-icon">
                        <GlobeHemisphereWest size={23} />
                      </span>
                      <div>
                        <strong>{a.name}</strong>
                        <span>
                          {new Date(a.createdAt).toLocaleString("en-GB", {
                            timeZone: "Asia/Jerusalem",
                          })}{" "}
                          · {a.pages.length} pages · {a.findings.length}{" "}
                          findings
                        </span>
                      </div>
                      <span
                        className={`status-pill ${["running", "queued"].includes(a.status) ? "pending" : ""}`}
                      >
                        <i />
                        {a.status}
                      </span>
                      <ArrowRight size={17} />
                    </Link>
                  ))}
                </div>
              ) : (
                <Empty
                  icon={Clock}
                  text="Your audit history starts here."
                  detail="Run your first scan. Reports and evidence are saved in your account."
                />
              )}
              <Link className="example-history" href="/demo">
                <FileText size={19} />
                <span>Explore the Form & Field example report</span>
                <ArrowRight size={15} />
              </Link>
            </section>
          )}
          {view === "Integrations" && <IntegrationsPanel demo={demo} />}
          {view === "Settings" && (
            <>
              <Settings
                initialName={workspaceName}
                onSave={setWorkspaceName}
                storageKey={`siteradar-workspace-${user?.id ?? "demo"}`}
              />
              <div className="account-actions">
                <Link className="btn" href="/pricing">
                  Free · Unlimited plan
                </Link>
                <Link className="btn" href="/docs/account-and-security">
                  Account & security
                </Link>
                {user && (
                  <button className="btn" onClick={signOut}>
                    <SignOut size={17} />
                    Sign out
                  </button>
                )}
              </div>
            </>
          )}
          <footer className="page-footer">
            <span>
              <span className="footer-mark">
                <Scan size={14} />
              </span>
              See clearly. Improve deliberately.
            </span>
            <span>
              {audit.synthetic
                ? "Example report · No live measurements"
                : `Report ${audit.id.slice(0, 8)} · Saved locally`}
              <span className="footer-dot">·</span>
              <button onClick={() => setHelpOpen(true)}>
                How scoring works
                <ArrowUpRight size={12} />
              </button>
            </span>
          </footer>
        </main>
      </div>
      <NewAudit
        open={newOpen}
        onOpenChange={setNewOpen}
        onCreated={created}
        initialConfig={scanConfig}
      />
      <Dialog.Root open={helpOpen} onOpenChange={setHelpOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Close
              className="icon-btn modal-close"
              aria-label="Close help"
            >
              <X size={20} />
            </Dialog.Close>
            <Dialog.Title>Evidence before advice.</Dialog.Title>
            <Dialog.Description>
              How to read a SiteRadar report.
            </Dialog.Description>
            <div className="help-content">
              <h3>Example vs. live reports</h3>
              <p>
                The Form & Field workspace is a synthetic example. Live reports
                contain observations from fetched HTML and never inherit example
                measurements.
              </p>
              <h3>What the scores mean</h3>
              <p>
                Local category scores are rule-based heuristics: 100 minus
                severity-weighted findings per fetched page (critical 25, high
                14, medium 7, low 3). They are not search rankings or proof of
                compliance. The audit score is the average of available category
                scores. Lighthouse measures performance and automated
                accessibility on the homepage when the browser check succeeds.
              </p>
              <h3>Content readiness isn’t AI visibility</h3>
              <p>
                GEO readiness checks structure and entity signals. It does not
                measure whether an AI engine mentions or cites your brand.
              </p>
              <h3>Your workspace is local</h3>
              <p>
                Reports are saved to your account on this server. Sessions
                protect access to your projects. Free is unlimited; paid plans
                are coming soon. Sharing and scheduled scans are not available.
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
function Metric({
  label,
  value,
  detail,
  icon: Icon,
  warning,
}: {
  label: string;
  value: string;
  detail: string;
  icon: Icon;
  warning?: boolean;
}) {
  return (
    <div className="metric">
      <div>
        <span>{label}</span>
        <Icon size={17} />
      </div>
      <strong className={value.length > 6 ? "metric-text" : ""}>
        {value}
        {warning && (
          <span className="metric-warning">
            <Warning size={13} />
          </span>
        )}
      </strong>
      <p className={detail.startsWith("↑") ? "positive" : ""}>{detail}</p>
    </div>
  );
}
function MiniBars({ value }: { value: number | null }) {
  return (
    <span className="mini-bars" aria-hidden="true">
      {[22, 35, 27, 44, 37, 53, 46, 64, 58, 75, 66, 84].map((h, i) => (
        <i
          key={i}
          style={{
            height: `${h}%`,
            opacity: value === null ? 0.15 : i < (value / 100) * 12 ? 1 : 0.2,
          }}
        />
      ))}
    </span>
  );
}
function Search({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="search-input">
      <MagnifyingGlass size={17} />
      <input
        aria-label={placeholder}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button aria-label="Clear search" onClick={() => onChange("")}>
          <X size={14} />
        </button>
      )}
    </label>
  );
}
function Empty({
  text,
  detail,
  icon: Icon = FileText,
}: {
  text: string;
  detail?: string;
  icon?: Icon;
}) {
  return (
    <div className="empty-state">
      <Icon size={34} />
      <h3>{text}</h3>
      {detail && <p>{detail}</p>}
    </div>
  );
}
function Settings({
  initialName,
  onSave,
  storageKey,
}: {
  initialName: string;
  onSave: (name: string) => void;
  storageKey: string;
}) {
  const [name, setName] = useState(initialName);
  return (
    <section className="panel settings-panel">
      <h2>Workspace preferences</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            localStorage.setItem(storageKey, name.trim());
            onSave(name.trim());
            toast.success("Workspace name saved on this device.");
          } catch {
            toast.error(
              "Browser storage is unavailable. Preferences could not be saved.",
            );
          }
        }}
      >
        <label>
          Workspace name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={60}
          />
        </label>
        <label>
          Storage location
          <input value="data/siteradar.sqlite" readOnly />
        </label>
        <div className="notice">
          <ShieldCheck size={19} />
          <p>
            Your workspace uses an unlimited Free account. Saved projects and
            reports are private to your account.
          </p>
        </div>
        <button className="btn primary">
          Save preferences
          <Check size={16} />
        </button>
      </form>
    </section>
  );
}
