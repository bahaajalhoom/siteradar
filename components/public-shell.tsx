import Link from "next/link";
import { ArrowUpRight, Scan } from "@phosphor-icons/react/dist/ssr";
import {currentUser} from '@/server/auth';
import {PublicAccount} from './public-account';
export async function PublicHeader({ active }: { active?: string }) {
  const user=await currentUser();
  return (
    <header className="public-header">
      <Link href="/" className="public-brand">
        <Scan size={30} weight="bold" />
        SiteRadar<span>.</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/#how-it-works">How it works</Link>
        <Link
          href="/pricing"
          aria-current={active === "pricing" ? "page" : undefined}
        >
          Pricing
        </Link>
        <Link
          href="/docs"
          aria-current={active === "docs" ? "page" : undefined}
        >
          Docs
        </Link>
        <Link href="/about" aria-current={active==='about'?'page':undefined}>About</Link>
      </nav>
      <PublicAccount initialUser={user}/>
    </header>
  );
}
export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div>
        <Link href="/" className="public-brand">
          <Scan size={23} />
          SiteRadar.
        </Link>
        <p>See clearly. Improve deliberately.</p>
        <p>Founded and developed by <Link href="/about/ahmadjalhoom">engineer AhmadJalhoom</Link>.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/pricing">Pricing</Link>
        <Link href="/docs">Documentation</Link>
        <Link prefetch={false} href="/demo">Example report</Link>
        <Link prefetch={false} href="/app">Your workspace</Link>
        <Link href="/about">About SiteRadar</Link>
      </nav>
      <span>© {new Date().getFullYear()} SiteRadar</span>
    </footer>
  );
}
