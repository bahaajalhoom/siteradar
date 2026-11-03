"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeSlash, SpinnerGap } from "@phosphor-icons/react";
import {safeReturnPath} from '@/lib/workspace-routes';
import {apiFetch} from '@/lib/api';
export function AuthForm({ signup,returnTo='/app' }: { signup: boolean;returnTo?:string }) {
  const router = useRouter();
  const [error, setError] = useState(""),
    [pending, setPending] = useState(false),
    [visible, setVisible] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const r = await apiFetch(`/api/auth/${signup ? "sign-up" : "sign-in"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signup ? f.get("name") : undefined,
          email: f.get("email"),
          password: f.get("password"),
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      router.replace(safeReturnPath(returnTo));
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not connect. Please try again.",
      );
      setPending(false);
    }
  }
  return (
    <form onSubmit={submit} className="auth-form">
      {signup && (
        <label>
          Your name
          <input
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder="Your full name"
          />
        </label>
      )}
      <label>
        Email address
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="you@company.com"
        />
      </label>
      <label>
        Password
        <div className="password-input">
          <input
            name="password"
            type={visible ? "text" : "password"}
            required
            minLength={10}
            maxLength={128}
            autoComplete={signup ? "new-password" : "current-password"}
            placeholder={signup ? "At least 10 characters" : "Your password"}
          />
          <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeSlash size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </label>
      {signup && (
        <>
          <p className="auth-hint">
            Use at least 10 characters. Your password is securely hashed.
          </p>
        </>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="btn primary full" disabled={pending}>
        {pending ? (
          <>
            <SpinnerGap className="spin" size={19} />
            Please wait…
          </>
        ) : (
          <>
            {signup ? "Create free account" : "Log in"}
            <ArrowRight size={18} />
          </>
        )}
      </button>
      <p className="auth-switch">
        {signup ? "Already have an account?" : "New to SiteRadar?"}{" "}
        <Link href={(signup ? "/sign-in" : "/sign-up")+`?next=${encodeURIComponent(safeReturnPath(returnTo))}`}>
          {signup ? "Log in" : "Create a free account"}
        </Link>
      </p>
    </form>
  );
}
