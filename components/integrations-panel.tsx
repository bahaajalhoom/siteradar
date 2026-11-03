"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Monitor,
  MagnifyingGlass,
  ShieldCheck,
  GlobeHemisphereWest,
  ArrowRight,
  SpinnerGap,
} from "@phosphor-icons/react";
import {apiFetch} from "@/lib/api";
export function IntegrationsPanel({ demo = false }: { demo?: boolean }) {
  const [connected, setConnected] = useState(false),
    [key, setKey] = useState(""),
    [pending, setPending] = useState(false),
    [loaded, setLoaded] = useState(demo),
    [error, setError] = useState("");
  async function load() {
    try {
      const r = await apiFetch("/api/integrations");
      if (!r.ok) throw new Error();
      setConnected((await r.json()).data.serpapi);
      setError("");
    } catch {
      setError("Could not load provider status. Try again.");
    } finally {
      setLoaded(true);
    }
  }
  useEffect(() => {
    if (!demo) void load();
  }, [demo]);
  async function save(e?: FormEvent, disconnect = false) {
    e?.preventDefault();
    if (demo) {
      window.location.href = "/sign-up";
      return;
    }
    setPending(true);
    try {
      const r = await apiFetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "serpapi",
          key: disconnect ? "" : key,
        }),
      });
      if (!r.ok) throw new Error();
      setKey("");
      setConnected(!disconnect);
      toast.success(
        disconnect
          ? "Search provider disconnected."
          : "Key saved securely. Run your project again to collect rankings.",
      );
    } catch {
      toast.error("Could not save. Try again.");
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="panel report-panel">
      <div className="section-heading">
        <div>
          <h2>Your measurement tools</h2>
          <p>
            Website measurements work without external keys. Search rankings are
            optional.
          </p>
        </div>
        <ShieldCheck size={23} />
      </div>
      <div className="integration-list">
        {[
          {
            name: "Rendered-page crawler",
            desc: "Public HTTPS pages in isolated Chromium, with robots.txt and a protected network boundary.",
            icon: GlobeHemisphereWest,
          },
          {
            name: "Lighthouse performance",
            desc: "Real mobile or desktop homepage lab scores, LCP, CLS, TBT, FCP, and Speed Index.",
            icon: Monitor,
          },
          {
            name: "Automated accessibility",
            desc: "axe violations and a Lighthouse homepage accessibility score. Human review remains necessary.",
            icon: ShieldCheck,
          },
        ].map((x) => (
          <div className="integration-row" key={x.name}>
            <span className="integration-icon">
              <x.icon size={25} />
            </span>
            <div>
              <h3>{x.name}</h3>
              <p>{x.desc}</p>
            </div>
            <span className="status-pill">
              <i />
              Included
            </span>
          </div>
        ))}
        <div className="integration-row">
          <span className="integration-icon">
            <MagnifyingGlass size={25} />
          </span>
          <div>
            <h3>SerpApi · Google search results</h3>
            <p>
              Keyword positions and search competitors, measured for the
              selected market, language, and device.
            </p>
          </div>
          <span className={`status-pill ${connected ? "" : "unavailable"}`}>
            <i />
            {!loaded
              ? "Checking…"
              : connected
                ? "Key saved"
                : "Optional · not connected"}
          </span>
        </div>
      </div>
      {error && (
        <p className="form-error">
          {error}
          <button className="text-link" onClick={load}>
            Retry
          </button>
        </p>
      )}
      <form className="provider-form" onSubmit={save}>
        <h3>
          {connected
            ? "Manage your search connection"
            : "Connect search rankings when you’re ready"}
        </h3>
        <p>
          No account yet? Your audits still work. Create a{" "}
          <a
            href="https://serpapi.com/users/sign_up"
            target="_blank"
            rel="noreferrer"
          >
            SerpApi account
          </a>
          , get your key, and paste it here. Provider charges are separate from
          the unlimited Free plan.
        </p>
        <label>
          SerpApi API key
          <input
            type="password"
            autoComplete="off"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={
              connected ? "Enter a replacement key" : "Paste your API key"
            }
            required
            maxLength={512}
          />
        </label>
        <button className="btn primary" disabled={pending}>
          {pending ? <SpinnerGap className="spin" size={17} /> : null}
          {demo
            ? "Create account to connect"
            : connected
              ? "Replace key"
              : "Save secure connection"}
        </button>
        {connected && (
          <button
            className="btn"
            type="button"
            onClick={() => save(undefined, true)}
            disabled={pending}
          >
            Disconnect
          </button>
        )}
        <p className="auth-hint">
          Encrypted on the server. Never included in reports or returned to the
          browser. Run again after connecting to measure keyword positions.
        </p>
        <Link className="text-link" href="/docs/search-rankings">
          Read the setup guide
          <ArrowRight size={16} />
        </Link>
      </form>
    </section>
  );
}
