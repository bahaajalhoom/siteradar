import type { Audit } from "@/lib/types";
import { ChartPieSlice, ArrowRight } from "@phosphor-icons/react";
export function LiveCompetitors({
  audit,
  onConnect,
}: {
  audit: Audit;
  onConnect: () => void;
}) {
  const map = new Map<
    string,
    { domain: string; appearances: number; positions: number[] }
  >();
  const own = new URL(audit.url).hostname.replace(/^www\./, "");
  for (const rank of audit.rankings ?? []) {
    if (rank.error) continue;
    const seen = new Set<string>();
    for (const r of rank.results) {
      if (r.domain === own || r.domain.endsWith(`.${own}`)) continue;
      if (seen.has(r.domain)) continue;
      seen.add(r.domain);
      const c = map.get(r.domain) ?? {
        domain: r.domain,
        appearances: 0,
        positions: [],
      };
      c.appearances++;
      c.positions.push(r.position);
      map.set(r.domain, c);
    }
  }
  const competitors = [...map.values()]
    .sort((a, b) => b.appearances - a.appearances)
    .slice(0, 20);
  return competitors.length ? (
    <>
      <div className="measurement-note">
        <ChartPieSlice size={20} />
        <p>
          Observed domains from the same keyword queries. Search competitors may
          include publishers and directories.
        </p>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Domain</th>
              <th>Query appearances</th>
              <th>Average position</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c) => (
              <tr key={c.domain}>
                <td>
                  <strong>{c.domain}</strong>
                </td>
                <td>{c.appearances}</td>
                <td>
                  {(
                    c.positions.reduce((a, b) => a + b, 0) / c.positions.length
                  ).toFixed(1)}
                </td>
                <td>SerpApi · Google</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <div className="empty-state">
      <ChartPieSlice size={35} />
      <h3>Your comparison starts with shared search results.</h3>
      <p>
        Competitor comparisons use automatic search snapshots for the same keywords and market.
        Open Keywords to explore the results directly on Google.
      </p>
      <button className="btn" onClick={onConnect}>
        Set up search results
        <ArrowRight size={17} />
      </button>
    </div>
  );
}
