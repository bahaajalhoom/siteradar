import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChartLineUp,
  Code,
  FileText,
  CaretDown,
  Scan,
  Flag,
  Files,
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
        <section className={styles.homeHero}>
          <div className={styles.homeIntro}>
            <span className={styles.eyebrow}><span /> YOUR WEBSITE. IN FOCUS.</span>
            <h1>
              Your website,<br />
              <em>seen clearly.</em>
            </h1>
            <p>
              Find what’s holding your website back. Bring SEO, performance,
              and accessibility into one clear report—and know what to fix next.
            </p>
            <div className={`hero-actions ${styles.homeActions}`}>
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
          <div className={styles.productFrame}>
            <div className={styles.windowBar}><span aria-hidden="true"><i /><i /><i /></span><span><ShieldCheck size={13} /> SiteRadar / Your workspace</span><span>PRODUCT PREVIEW</span></div>
            <div className={styles.productLayout}>
              <div className={styles.productNav} aria-hidden="true">
                <strong><Scan size={22} />SiteRadar.</strong>
                <small>YOUR WORKSPACE</small>
                <span className={styles.activeNav}><Scan size={16} />Overview</span>
                <span><Flag size={16} />Issues</span>
                <span><Files size={16} />Pages</span>
                <span><ChartLineUp size={16} />Performance</span>
                <span><Code size={16} />Fix prompt</span>
                <p>See clearly.<br />Improve deliberately.</p>
              </div>
              <div className={styles.productContent}>
                <div className={styles.productTitle}><div><span>WEBSITE INTELLIGENCE</span><h2>Your next move, in focus.</h2></div><Link href="/demo">Explore report <ArrowUpRight size={15} /></Link></div>
                <div className={styles.productOverview}>
                  <div className={styles.radarVisual} aria-hidden="true"><span /><span /><span /><Scan size={30} /></div>
                  <div><span className={styles.reportTag}>FROM AUDIT TO ACTION</span><h3>Everything connects.<br />Nothing gets lost.</h3><p>Understand the issue. See the evidence.<br />Know where to start.</p></div>
                  <div className={styles.checkList}>{['Technical SEO', 'Performance', 'Accessibility', 'Content readiness'].map(label => <span key={label}><Check size={15} />{label}</span>)}</div>
                </div>
                <div className={styles.reportColumns}>
                  <div><Flag size={20} /><h3>Find what matters</h3><p>Prioritized findings, with every affected page in view.</p><span>ISSUES & EVIDENCE <ArrowRight size={14} /></span></div>
                  <div><Code size={20} /><h3>Make a clear plan</h3><p>Turn selected findings into a focused repair brief.</p><span>YOUR NEXT STEPS <ArrowRight size={14} /></span></div>
                </div>
                <div className={styles.productNote}><ShieldCheck size={14} /> Interface preview. Your audit will show your own measurements.</div>
              </div>
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
        <section className={styles.repairSection} aria-labelledby="repair-title">
          <div className={styles.repairCopy}>
            <span className={styles.eyebrow}>THE REPORT IS JUST THE START</span>
            <h2 id="repair-title">Find the issue.<br /><em>Make the next move.</em></h2>
            <p>A score tells you where you stand. The evidence tells you what to change. Take selected findings straight into a focused brief for your developer.</p>
            <ul>
              <li><Check size={18} />Affected pages and observed evidence</li>
              <li><Check size={18} />Priorities and practical recommendations</li>
              <li><Check size={18} />A repair prompt you can copy and use</li>
            </ul>
            <Link href="/docs" className={styles.lightLink}>Explore the workflow <ArrowRight size={18} /></Link>
          </div>
          <div className={styles.repairBrief}>
            <div className={styles.briefHeader}><FileText size={20} /><span>Website repair brief</span><span>WORKFLOW PREVIEW</span></div>
            <div className={styles.briefBody}>
              <span className={styles.briefLabel}>01 / OBSERVE</span>
              <h3>Start with the evidence.</h3>
              <p>Review the affected URL, the check that failed, and what was observed on the page.</p>
              <div className={styles.briefDivider} />
              <span className={styles.briefLabel}>02 / REPAIR</span>
              <h3>Give every fix a clear scope.</h3>
              <p>Select the findings that matter. Generate a brief with recommendations and verification steps.</p>
              <div className={styles.briefResult}><ShieldCheck size={20} /><span>Re-run your audit to measure the change.</span></div>
            </div>
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
        <section className={styles.faq} aria-labelledby="faq-title">
          <div><span className={styles.eyebrow}>A LITTLE MORE CLARITY</span><h2 id="faq-title">Good questions.<br />Clear answers.</h2><p>Get to know your next website audit.</p></div>
          <div className={styles.questions}>
            {[
              ['What does SiteRadar check?', 'SiteRadar checks technical SEO, page content, performance and accessibility. Each report connects findings to affected pages and includes practical recommendations.'],
              ['Is SiteRadar free?', 'Yes. The Free plan includes unlimited projects and audits. Crawl time and resource safeguards apply to keep the service available.'],
              ['Do I need to install anything on my website?', 'No. Add your public HTTPS website and choose your audit settings. You must own the website or have permission to audit it.'],
              ['Does a good score guarantee better search rankings?', 'No. An audit helps identify website improvements. Search rankings depend on many factors. Keyword position tracking requires a connected SerpApi account.'],
            ].map(([question, answer]) => <details key={question}><summary>{question}<CaretDown size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}
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
