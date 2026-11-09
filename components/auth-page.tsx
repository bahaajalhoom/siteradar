import { LanguageSwitch, UiText } from '@/components/ui-language';
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
      <LanguageSwitch />
      <section className="auth-story">
        <Link href="/" className="public-brand">
          <Scan size={31} />
          SiteRadar.
        </Link>
        <div>
          <span className="public-eyebrow"><UiText text={"YOUR WEBSITE. IN FOCUS."} /></span>
          <h1>
            <UiText text={"Every website has"} />
            <br /><UiText text={"a next step."} />
          </h1>
          <p><UiText text={"Find yours with evidence you can act on."} /></p>
          <ul>
            <li>
              <Check size={19} />
              <UiText text={"Save your projects once."} />
            </li>
            <li>
              <Check size={19} />
              <UiText text={"Measure what actually matters."} />
            </li>
            <li>
              <Check size={19} />
              <UiText text={"Turn findings into a repair plan."} />
            </li>
          </ul>
        </div>
        <span>
          <ShieldCheck size={18} />
          <UiText text={"Free includes unlimited projects and audits."} />
        </span>
      </section>
      <section className="auth-panel">
        <Link href="/" className="auth-back">
          <ArrowLeft size={17} />
          <UiText text={"Back to SiteRadar"} />
        </Link>
        <div>
          <span className="public-eyebrow">{signup ? <UiText text={"LET’S GET STARTED"} /> : <UiText text={"YOUR WORKSPACE AWAITS"} />}</span>
          <h2>{signup ? <UiText text={"A clearer picture starts here."} /> : <UiText text={"Welcome back."} />}</h2>
          <p>
            {signup
              ? <UiText text={"Create your free workspace. No credit card."} />
              : <UiText text={"Your projects, reports, and next steps are waiting."} />}
          </p>
          <AuthForm signup={signup} returnTo={returnTo}/>
        </div>
        <p className="auth-local-note">
          <UiText text={"Built for clearer decisions. Created by AhmadJalhoom."} />
        </p>
      </section>
    </main>
  );
}
