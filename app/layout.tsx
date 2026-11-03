import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import "./product.css";
import "./public-refresh.css";
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
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
