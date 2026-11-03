import { PublicHeader, PublicFooter } from "@/components/public-shell";
import { DocsBrowser } from "@/components/docs-browser";
import {publicMetadata} from '@/lib/seo';
export const metadata = publicMetadata('Documentation | SiteRadar','Learn how to audit websites, understand Lighthouse metrics, track keywords, manage projects and turn findings into repair prompts.','/docs');
export default function Docs() {
  return (
    <div className="public-site">
      <PublicHeader active="docs" />
      <main className="public-container docs-home">
        <div className="public-page-title">
          <span className="public-eyebrow">THE SITERADAR FIELD GUIDE</span>
          <h1>A little guidance.<br />A clearer way forward.</h1>
          <p>
            Set up your projects, understand the measurements, and turn findings
            into fixes.
          </p>
        </div>
        <DocsBrowser />
      </main>
      <PublicFooter />
    </div>
  );
}
