import type { Metadata } from "next";
import "./globals.css";
import "./product.css";
import "./public-refresh.css";
import "./locale.css";
import "./report-details.css";
import { UiLanguageProvider } from '@/components/ui-language';
import {publicMetadata} from '@/lib/seo';
import {configuredSiteUrl,site} from '@/lib/site';
export const metadata: Metadata = {
  ...publicMetadata('SiteRadar — Website audits by AhmadJalhoom',site.description,'/'),
  metadataBase:new URL(configuredSiteUrl().url),
  applicationName:'SiteRadar',category:'technology',
  verification:process.env.GOOGLE_SITE_VERIFICATION?{google:process.env.GOOGLE_SITE_VERIFICATION}:undefined,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UiLanguageProvider>{children}</UiLanguageProvider>
      </body>
    </html>
  );
}
