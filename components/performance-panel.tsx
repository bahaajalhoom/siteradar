import { UiText } from '@/components/ui-language';
import type { Audit } from "@/lib/types";
import { Info, ArrowSquareOut } from "@phosphor-icons/react";
export function PerformancePanel({ audit }: { audit: Audit }) {
  const p = audit.performance;
  if (!p)
    return audit.measurementError ? (
      <div className="measurement-note">
        <Info size={19} />
        <div>
          <strong><UiText text={"Performance measurement needs another attempt."} /></strong>
          <p>{audit.measurementError}</p>
          <span>
            <UiText text={"Run again to retry. Collected page findings are preserved."} />
          </span>
        </div>
      </div>
    ) : null;
  const ms = (v: number | null) =>
    v === null ? "—" : `${(v / 1000).toFixed(2)} s`;
  const metrics = [
    {
      label: "Largest Contentful Paint",
      value: ms(p.lcp),
      name: "LCP",
      good: p.lcp !== null && p.lcp <= 2500,
    },
    {
      label: "Total Blocking Time",
      value: p.tbt === null ? "—" : `${Math.round(p.tbt)} ms`,
      name: "TBT · lab responsiveness",
      good: p.tbt !== null && p.tbt <= 200,
    },
    {
      label: "Layout Shift",
      value: p.cls?.toFixed(3) ?? "—",
      name: "CLS",
      good: p.cls !== null && p.cls <= 0.1,
    },
    {
      label: "First Contentful Paint",
      value: ms(p.fcp),
      name: "FCP",
      good: p.fcp !== null && p.fcp <= 1800,
    },
    {
      label: "Speed Index",
      value: ms(p.speedIndex),
      name: "Visual loading",
      good: p.speedIndex !== null && p.speedIndex <= 3400,
    },
  ];
  return (
    <section className="panel performance-panel">
      <div className="section-heading">
        <div>
          <h2><UiText text={"Performance, measured."} /></h2>
          <p>
            Lighthouse · {p.device} · Homepage lab test ·{" "}
            {new Date(p.measuredAt).toLocaleString("en-GB", {
              timeZone: "Asia/Jerusalem",
            })}
          </p>
        </div>
        <a className="text-link" href="/docs/measurements">
          <UiText text={"About these metrics"} />
          <ArrowSquareOut size={15} />
        </a>
      </div>
      <div className="performance-metrics">
        {metrics.map((m) => (
          <div key={m.label}>
            <span><UiText text={m.label}/></span>
            <strong className={m.good ? "positive" : "amber-text"}>
              {m.value}
            </strong>
            <small><UiText text={m.name}/></small>
          </div>
        ))}
      </div>
      <p className="muted" style={{ marginTop: 20 }}>
        <UiText text={"Lab observations, not real-user data. TBT is not INP. Individual runs vary with device profile and network conditions."} />
      </p>
      {p.warnings.length > 0 && (
        <details style={{ marginTop: 15, fontSize: 13 }}>
          <summary><UiText text={"Lighthouse measurement notes"} /></summary>
          {p.warnings.map((w, i) => (
            <p key={i}>{w}</p>
          ))}
        </details>
      )}
    </section>
  );
}
