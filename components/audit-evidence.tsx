import type { Audit, Category } from "@/lib/types";
import { CheckCircle, FileText, MagnifyingGlass, ShieldCheck } from "@phosphor-icons/react";

const positiveCategories = new Set(["SEO", "GEO readiness"]);

export function PositiveSignals({ audit, category }: { audit: Audit; category?: Category }) {
  const positives = (audit.positives ?? []).filter((signal) =>
    category ? signal.category === category : positiveCategories.has(signal.category),
  );
  return positives.length ? (
    <div className="evidence-positive-list">
      {positives.map((signal) => (
        <article className="evidence-positive" key={signal.rule}>
          <CheckCircle size={20} weight="fill" />
          <div>
            <strong>{signal.title}</strong>
            <span>{signal.category}</span>
            <p>{signal.evidence}</p>
          </div>
        </article>
      ))}
    </div>
  ) : (
    <p className="muted">No positive signals were recorded for this category.</p>
  );
}

export function AuditEvidence({ audit }: { audit: Audit }) {
  const positives = (audit.positives ?? []).filter((signal) =>
    positiveCategories.has(signal.category),
  );
  const resources = audit.resources ?? [];
  const firstPage = audit.pages[0];
  const contentPhrases = firstPage
    ? [...new Set([firstPage.title, ...firstPage.h1].filter(Boolean))]
    : [];

  return (
    <section className="audit-evidence" aria-label="Audit evidence">
      <div className="section-heading audit-evidence-heading">
        <div>
          <span className="public-eyebrow">PROOF, NOT PROMISES</span>
          <h2>What’s working</h2>
          <p>Positive signals observed in the pages we checked.</p>
        </div>
        <ShieldCheck size={28} />
      </div>
      <div className="audit-evidence-columns">
        <PositiveSignals audit={{ ...audit, positives }} />
        <div className="evidence-files">
          <div className="evidence-subheading">
            <FileText size={19} />
            <div><strong>Discovery files</strong><span>Fetched from the site root</span></div>
          </div>
          {resources.length ? resources.map((resource) => (
            <details className="evidence-file" key={resource.path} open={resource.available && resource.path === "/robots.txt"}>
              <summary>
                <span>{resource.path}</span>
                <em className={resource.available ? "available" : "missing"}>
                  {resource.available ? `HTTP ${resource.status}` : resource.status === 404 ? "Not found" : "Unavailable"}
                </em>
              </summary>
              <pre>{resource.content || "No content returned."}</pre>
            </details>
          )) : <p className="muted">Discovery files will appear after the worker checks the origin.</p>}
        </div>
      </div>
      <div className="evidence-keywords">
        <div className="evidence-subheading">
          <MagnifyingGlass size={19} />
          <div>
            <strong>Keywords found in the page</strong>
            <span>{audit.config.keywordSource === "extracted" ? "Extracted from the title and H1 headings" : "Saved for this audit"}</span>
          </div>
        </div>
        <div className="keyword-evidence-list">
          {(audit.config.keywords.length ? audit.config.keywords : contentPhrases).map((keyword) => (
            <span key={keyword}>{keyword}</span>
          ))}
          {!audit.config.keywords.length && !contentPhrases.length && <span className="muted">No keyword phrases observed yet.</span>}
        </div>
      </div>
    </section>
  );
}
