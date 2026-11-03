import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChartLineUp,
  Code,
  GlobeHemisphereWest,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { PublicHeader, PublicFooter } from "./public-shell";
import {currentUser} from '@/server/auth';
import styles from './landing.module.css';
export async function Landing() {
  const user=await currentUser();
  return (
    <div className={`public-site ${styles.landing}`}>
      <PublicHeader />
      <main>
        <section className="landing-hero public-container">
          <div className="hero-copy">
            <span className={styles.eyebrow}><span /> YOUR WEBSITE. IN FOCUS.</span>
            <h1>
              A clearer picture.<br />
              <em>A better website.</em>
            </h1>
            <p>
              Find what’s holding your website back. Bring SEO, performance,
              and accessibility into one clear report—and know what to fix next.
            </p>
            <div className="hero-actions">
              <Link href={user?'/app':'/sign-up'} className="btn primary">
                {user?'Open your workspace':'Audit your website'}
                <ArrowRight size={19} />
              </Link>
              <Link href="/demo" className="hero-secondary">
                Explore a report
                <ArrowUpRight size={17} />
              </Link>
            </div>
            <span className="hero-plan">
              <Check size={16} />
              Free. Unlimited projects and audits. No credit card.
            </span>
          </div>
          <div className="hero-report">
            <div className="preview-top">
              <span>
                <GlobeHemisphereWest size={18} />
                Website overview
              </span>
              <span className="small-chip">ILLUSTRATIVE REPORT</span>
            </div>
            <div className="preview-score">
              <div className="preview-dial">
                <strong>74</strong>
                <span>audit score / 100</span>
              </div>
              <div>
                <span className="badge medium">Room to improve</span>
                <h2>
                  A clearer picture.
                  <br />A focused next step.
                </h2>
                <p>Every finding connects back to a page.</p>
              </div>
            </div>
            <div className="preview-bars">
              {[
                ["SEO", 78],
                ["Performance", 68],
                ["Accessibility", 92],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <i>
                    <b style={{ width: `${value}%` }} />
                  </i>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <div className="preview-finding">
              <span className="finding-number">01</span>
              <div>
                <strong>Make your main content easier to find</strong>
                <span>SEO · Page-level evidence · Clear repair steps</span>
              </div>
              <ArrowUpRight size={18} />
            </div>
            <div className="preview-foot">
              <ShieldCheck size={15} />
              Example data. Your report uses actual measurements.
            </div>
          </div>
        </section>
        <div className={styles.coverage} aria-label="Audit capabilities">
          <span>ONE WORKSPACE. EVERY ANGLE.</span>
          {['Technical SEO', 'Lighthouse performance', 'Accessibility', 'Content readiness'].map(label => <span key={label}><Check size={16} aria-hidden="true" />{label}</span>)}
        </div>
        <section id="how-it-works" className="how-section">
          <div className="public-container">
            <div className="section-intro">
              <div>
              <span className={styles.eyebrow}>FROM INSIGHT TO ACTION</span>
              <h2>
                Less interpreting reports.
                <br />
                More improving your site.
              </h2>
              </div>
              <p>
                From a URL to a practical repair plan, without losing the
                details that matter.
              </p>
            </div>
            <div className="how-steps">
              {[
                {
                  title: "Your site. Your context.",
                  text: "Save your website once. Choose a device, language, and market. Your project remembers them for the next audit.",
                },
                {
                  title: "Find the actual friction.",
                  text: "Rendered-page checks, Lighthouse performance, and automated accessibility findings, attached to the pages we check.",
                },
                {
                  title: "Know what to do next.",
                  text: "Review prioritized issues, export a report, or turn selected findings into a repair prompt for your developer.",
                },
              ].map((s, i) => (
                <article key={s.title}>
                  <span>
                    0{i + 1} / {["CONNECT", "MEASURE", "IMPROVE"][i]}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="capability-section public-container">
          <div className="section-intro">
            <div>
            <span className={styles.eyebrow}>BUILT FOR THE BIGGER PICTURE</span>
            <h2>
              Search health,
              <br />
              from more than one angle.
            </h2>
            </div>
            <Link className="text-link" href="/docs/measurements">
              Understand the measurements
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="capability-list">
            {[
              {
                icon: GlobeHemisphereWest,
                title: "Can search understand your pages?",
                text: "Metadata, headings, canonical URLs, index directives, structured data, and the content your browser renders.",
              },
              {
                icon: ChartLineUp,
                title: "Does the experience hold up?",
                text: "Lighthouse lab scores and timing metrics for your chosen device, plus automated accessibility checks.",
              },
              {
                icon: Code,
                title: "Can you turn findings into fixes?",
                text: "A specific repair brief with observed evidence, affected URLs, and instructions to verify the result.",
              },
            ].map((c) => (
              <article key={c.title}>
                <c.icon size={26} />
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
                <Check size={20} />
              </article>
            ))}
          </div>
        </section>
        <section className="honesty-section public-container">
          <ShieldCheck size={35} />
          <div>
            <h2>Useful numbers. Clear boundaries.</h2>
            <p>
              Lab performance is labeled as lab data. Content readiness isn’t a
              claim of AI visibility. Search rankings use a connected SerpApi
              account, with country, language, device, and measurement time
              attached.
            </p>
            <Link href="/docs/search-rankings">
              How keyword tracking works
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
        <section className="public-cta public-container">
          <div>
            <span className={styles.eyebrow}>YOUR NEXT MOVE</span>
            <h2>
              Your next improvement
              <br />
              starts with a clearer view.
            </h2>
            <p>Free includes unlimited projects, audits, and saved reports.</p>
          </div>
            <Link href={user?'/app':'/sign-up'} className="btn primary">
              {user?'Continue to your workspace':'Create your free account'}
            <ArrowRight size={19} />
          </Link>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
