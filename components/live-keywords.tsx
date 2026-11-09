import type { Audit } from "@/lib/types";
import { SemanticReviewPanel } from './semantic-review';
import { MagnifyingGlass, ArrowRight, ArrowSquareOut, GearSix } from "@phosphor-icons/react";
export function LiveKeywords({
  audit,
  onConnect,
  onEdit,
}: {
  audit: Audit;
  onConnect: () => void;
  onEdit: () => void;
}) {
  const checked = audit.rankings?.filter((r) => !r.error) ?? [];
  const found = checked.filter((r) => r.position !== null);
  return (
    <>
      <SemanticReviewPanel audit={audit}/>
      <div className="section-heading">
        <div>
          <h2>Google search visibility</h2>
          <p>
            Google · {audit.config.country} · {audit.config.language} ·{" "}
            {audit.config.device}
          </p>
        </div>
        <button className="btn" onClick={onEdit}>
          <GearSix size={17} />
          Edit keywords
        </button>
      </div>
      <p className="muted">Your SEO audit score measures checks on your website. Search visibility measures where a site appeared for a specific keyword, market, and device.</p>
      {checked.length > 0 && (
        <div className="measurement-note">
          <MagnifyingGlass size={21} />
          <div>
            <strong>
              {found.length
                ? `SerpApi returned your website for ${found.length} of ${checked.length} checked keywords.`
                : `SerpApi did not return ${new URL(audit.url).hostname} in this snapshot.`}
            </strong>
            <p>
              This is the provider’s search snapshot, which can differ from your
              own Google search. Expand a row to inspect the exact results used.
              An absent match is not proof that your website has no rank or is
              not indexed.
            </p>
          </div>
        </div>
      )}
      {audit.rankingStatus !== "ready" && (
        <div className="measurement-note">
          <MagnifyingGlass size={21} />
          <div>
            <strong>
              {audit.rankingStatus === "failed"
                ? "The search provider needs attention."
                : "Check any keyword on Google."}
            </strong>
            <p>
              {audit.rankingStatus === "failed"
                ? "Check your provider key and credits, then run the project again."
                : "Use the Google links below to see the results in your browser. Automatic positions appear when SiteRadar’s search service or your optional integration is available."}
            </p>
            <button className="text-link" onClick={onConnect}>
              Optional search integration
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Keyword</th>
              <th>Observed position</th>
              <th>Observed depth</th>
              <th>Result / status</th>
            </tr>
          </thead>
          <tbody>
            {audit.config.keywords.map((phrase) => {
              const r = audit.rankings?.find((x) => x.phrase === phrase);
              return (
                <tr key={phrase}>
                  <td>
                    <strong>{phrase}</strong>
                    <a className="table-sub text-link" href={`https://www.google.com/search?${new URLSearchParams({q:phrase})}`} target="_blank" rel="noreferrer">
                      Search on Google <ArrowSquareOut size={14} />
                    </a>
                  </td>
                  <td>
                    {r?.position ? (
                      <span className="rank-position">{r.position}</span>
                    ) : r?.error ? (
                      "Check failed"
                    ) : r ? (
                      "Not in returned results"
                    ) : (
                      "Not measured"
                    )}
                    {r && !r.error && (
                      <details className="serp-evidence">
                        <summary>
                          View provider results ({r.results.length})
                        </summary>
                        <div className="serp-context">
                          <p>
                            Checked:{" "}
                            {new Date(r.checkedAt).toLocaleString("en-GB", {
                              timeZone: "Asia/Jerusalem",
                            })}{" "}
                            · SerpApi
                          </p>
                          <p>
                            Requested market: {audit.config.country} ·{" "}
                            {audit.config.language} · {audit.config.device}
                          </p>
                          <p>
                            Provider location:{" "}
                            {r.context?.locationUsed ??
                              "Not recorded in this older snapshot"}
                          </p>
                          {r.context?.queryDisplayed && (
                            <p>Displayed query: {r.context.queryDisplayed}</p>
                          )}
                          {r.context?.spellingSuggestion && (
                            <p>
                              Google spelling suggestion:{" "}
                              {r.context.spellingSuggestion}
                            </p>
                          )}
                          {r.context?.resultState && (
                            <p>Query handling: {r.context.resultState}</p>
                          )}
                        </div>
                        <ol className="serp-result-list">
                          {r.results.map((result, i) => (
                            <li key={`${result.position}-${i}`}>
                              <strong>
                                {result.position}. {result.title}
                              </strong>
                              {/^https?:\/\//i.test(result.url) ? (
                                <a
                                  href={result.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {result.url}
                                </a>
                              ) : (
                                <span>{result.url}</span>
                              )}
                            </li>
                          ))}
                        </ol>
                      </details>
                    )}
                  </td>
                  <td>
                    {r && !r.error ? `${r.searched} organic results` : "—"}
                  </td>
                  <td>
                    {r?.error ? (
                      <span className="negative">{r.error}</span>
                    ) : r?.url ? (
                      <>
                        <span className="table-sub">{r.url}</span>
                        <span className="table-sub">
                          {new Date(r.checkedAt).toLocaleString("en-GB", {
                            timeZone: "Asia/Jerusalem",
                          })}{" "}
                          · SerpApi
                        </span>
                      </>
                    ) : r && !r.error ? (
                      `Not in ${r.searched} returned results`
                    ) : (
                      "Open Google to check manually"
                    )}
                    {r?.coverageNote && <span className="table-sub">{r.coverageNote}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!audit.config.keywords.length && (
        <div className="empty-state">
          <MagnifyingGlass size={30} />
          <h3>Add the phrases your customers search for.</h3>
          <p>Scan settings remembers them for every future run.</p>
          <button className="btn" onClick={onEdit}>
            Add keywords
          </button>
        </div>
      )}
    </>
  );
}
