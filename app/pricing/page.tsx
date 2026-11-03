import Link from "next/link";
import { Check, ArrowRight, Info, ShieldCheck, CaretDown } from "@phosphor-icons/react/dist/ssr";
import { PublicHeader, PublicFooter } from "@/components/public-shell";
import {publicMetadata} from '@/lib/seo';
import {currentUser} from '@/server/auth';
export const metadata = publicMetadata('Pricing | SiteRadar','Free includes unlimited projects, audits and saved reports. Basic, Pro and Max are coming soon. No payment is collected.','/pricing');
export default async function Pricing() {
  const user=await currentUser();
  return (
    <div className="public-site">
      <PublicHeader active="pricing" />
      <main className="public-container pricing-page">
        <div className="public-page-title">
          <span className="public-eyebrow">SIMPLE BY DESIGN</span>
          <h1>
            Your next improvement.
            <br />
            Starts for free.
          </h1>
          <p>One workspace for your websites, findings, and next steps. No subscription. No credit card.</p>
        </div>
        <div className="pricing-grid">
            <article className="price-plan available-plan">
              <div className="plan-heading">
                <h2>Free</h2>
                <span className="small-chip">
                  AVAILABLE NOW
                </span>
              </div>
              <div className="plan-price">
                    <strong>$0</strong>
                    <span>/ no subscription</span>
              </div>
              <p>
                The tools to understand your website and make a clear plan.
              </p>
                <Link className="btn primary full" href={user?'/app':'/sign-up'}>
                  {user?'Open your Free workspace':'Start with Free'}
                  <ArrowRight size={17} />
                </Link>
              <ul>
                {[
                      "Unlimited projects",
                      "Unlimited audits and history",
                      "Unlimited saved keywords",
                      "Lighthouse performance checks",
                      "SEO & accessibility findings",
                      "CSV, JSON, and repair prompts",
                      "No credit card required",
                    ].map((f) => (
                  <li key={f}>
                    <Check size={16} />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          <aside className="pricing-included">
            <ShieldCheck size={32} />
            <span className="public-eyebrow">MORE CLARITY. LESS FRICTION.</span>
            <h2>Everything you need<br />to get moving.</h2>
            <p>Save a project, run an audit, and return to the evidence whenever you need it.</p>
            <div><strong>Keep your progress in view</strong><p>Saved reports and repeat audits help you compare changes over time.</p></div>
            <div><strong>Bring the findings to your team</strong><p>Export your report or create a repair prompt with affected pages and practical recommendations.</p></div>
            <Link href="/docs/getting-started">See how to get started <ArrowRight size={17} /></Link>
          </aside>
        </div>
        <div className="pricing-note">
          <Info size={21} />
          <p>
            <strong>No hidden upgrade gate.</strong> Free has no plan quotas.
            Individual crawls use configurable time and resource safeguards.
            External search-data providers may charge separately; connecting one
            is optional.
          </p>
        </div>
        <div className="pricing-faq">
          <span className="public-eyebrow">THE DETAILS, MADE SIMPLE</span>
          <h2>Good to know.</h2>
          <details>
            <summary>How does the Free plan work?<CaretDown size={18} /></summary>
            <p>
              Free currently includes unlimited projects and audits, subject to crawl time and resource safeguards. There are no paid upgrades to buy today.
            </p>
          </details>
          <details>
            <summary>Do I need a search-provider account?<CaretDown size={18} /></summary>
            <p>
              Only for live keyword positions and search competitors. Website
              audits, performance, accessibility, exports, and repair prompts
              work without it.
            </p>
          </details>
          <details>
            <summary>Can I audit my site again?<CaretDown size={18} /></summary>
            <p>
              Yes. Open the saved project and choose Run again. Your URL,
              market, device, and keywords are remembered.
            </p>
          </details>
        </div>
        <div className="future-plans"><span className="public-eyebrow">LOOKING AHEAD</span><h2>Basic, Pro & Max</h2><p>More plans are in development. Features and pricing will be announced when they’re ready.</p><span className="small-chip">COMING SOON · NO PAYMENT COLLECTED</span></div>
      </main>
      <PublicFooter />
    </div>
  );
}
