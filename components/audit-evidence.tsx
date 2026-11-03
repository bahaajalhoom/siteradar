import type { Audit, Category } from "@/lib/types";
import { CheckCircle, FileText } from "@phosphor-icons/react";

export function PositiveSignals({ audit, category }: { audit: Audit; category: Category }) {
  const positives = (audit.positives ?? []).filter((signal) => signal.category === category);
  if (!positives.length)
    return <p className="muted">No positive signals were recorded for this category.</p>;
  return (
    <div className="evidence-positive-list">
      {positives.map((signal) => {
        const evidence = signal.evidence.split("\n").filter(Boolean)[0] ?? "Observed on the checked pages.";
        return (
          <article className="evidence-positive" key={signal.rule}>
            <CheckCircle size={20} weight="fill" />
            <div>
              <strong>{signal.title}</strong>
              <span>{signal.pages.length} page{signal.pages.length === 1 ? "" : "s"} checked</span>
              <p>{evidence}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function DiscoveryFiles({ audit, paths }: { audit: Audit; paths: string[] }) {
  const resources = (audit.resources ?? []).filter((resource) => paths.includes(resource.path));
  return (
    <div className="category-discovery-files">
      <div className="evidence-subheading">
        <FileText size={19} />
        <div><strong>Discovery files</strong><span>Fetched content and detected issues are included in this report. Content previews show up to 20,000 characters.</span></div>
      </div>
      {resources.length ? resources.map((resource) => (
        <details className="evidence-file" key={resource.path}>
          <summary>
            <span>{resource.path}</span>
            <em className={resource.available ? "available" : "missing"}>
              {resource.available ? `HTTP ${resource.status}` : resource.status === 404 ? "Not found" : "Unavailable"}
            </em>
          </summary>
          {resource.available && <pre>{resource.content || "No content returned."}</pre>}
        </details>
      )) : <p className="muted">These files will appear after the worker checks the origin.</p>}
    </div>
  );
}
