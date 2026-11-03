import Link from "next/link";
import {
  Scan,
  ShieldCheck,
  Check,
  ArrowLeft,
} from "@phosphor-icons/react/dist/ssr";
import { AuthForm } from "./auth-form";
export function AuthPage({ signup,returnTo }: { signup: boolean;returnTo?:string }) {
  return (
    <main className="auth-page">
      <section className="auth-story">
        <Link href="/" className="public-brand">
          <Scan size={31} />
          SiteRadar.
        </Link>
        <div>
          <span className="public-eyebrow">YOUR WEBSITE. IN FOCUS.</span>
          <h1>
            Every website has
            <br />a next step.
          </h1>
          <p>Find yours with evidence you can act on.</p>
          <ul>
            <li>
              <Check size={19} />
              Save your projects once.
            </li>
            <li>
              <Check size={19} />
              Measure what actually matters.
            </li>
            <li>
              <Check size={19} />
              Turn findings into a repair plan.
            </li>
          </ul>
        </div>
        <span>
          <ShieldCheck size={18} />
          Free includes unlimited projects and audits.
        </span>
      </section>
      <section className="auth-panel">
        <Link href="/" className="auth-back">
          <ArrowLeft size={17} />
          Back to SiteRadar
        </Link>
        <div>
          <span className="public-eyebrow">{signup ? 'LET’S GET STARTED' : 'YOUR WORKSPACE AWAITS'}</span>
          <h2>{signup ? "A clearer picture starts here." : "Welcome back."}</h2>
          <p>
            {signup
              ? "Create your free workspace. No credit card."
              : "Your projects, reports, and next steps are waiting."}
          </p>
          <AuthForm signup={signup} returnTo={returnTo}/>
        </div>
        <p className="auth-local-note">
          Built for clearer decisions. Created by AhmadJalhoom.
        </p>
      </section>
    </main>
  );
}
