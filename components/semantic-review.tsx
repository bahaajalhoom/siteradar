import { UiText } from '@/components/ui-language';
import type { Audit } from '@/lib/types';

export function SemanticReviewPanel({audit}:{audit:Audit}) {
  const review=audit.semanticReview;
  if(!review)return null;
  return <section className="panel report-panel" aria-label="AI content review">
    <div className="section-heading"><div><h2><UiText text={"AI content & keyword review"} /></h2><p>Ollama · {review.model} · Editorial suggestions for human review</p></div></div>
    {review.status!=='completed'?<p className="muted">{review.status==='disabled'?'AI review is disabled.':'AI review could not complete. Technical measurements are preserved; run again to retry.'}</p>:<>
      <p>{review.summary}</p>
      <p className="muted">Sampled {review.sources?.length??0} sources. Reviewed {review.keywords?.length??0} of {review.totalKeywords??audit.config.keywords.length} keywords (maximum four per audit). No search volume or rankings are inferred.</p>
      <div className="evidence-positive-list">
        {review.keywords?.map(item=><article key={item.phrase} className="evidence-positive"><div>
          <strong>{item.phrase} <span className="small-chip">{item.fit}</span></strong><p>{item.reason}</p>
          {item.suggestion&&<p><strong><UiText text={"Suggested next step"} /></strong> {item.suggestion}</p>}
          <details className="evidence-file"><summary><UiText text={"Source evidence"} /></summary><pre>{item.quote}</pre><p className="muted">{review.sources?.find(s=>s.id===item.source)?.url}</p></details>
        </div></article>)}
      </div>
      {!!review.rejectedItems&&<p className="muted">{review.rejectedItems} AI suggestions were omitted because their citations could not be verified.</p>}
    </>}
  </section>;
}
