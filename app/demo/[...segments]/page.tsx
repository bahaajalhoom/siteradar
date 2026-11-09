import { notFound } from 'next/navigation';
import { Workspace } from '@/components/workspace';
import { exampleAudit } from '@/lib/example';
import { viewSlugs, type WorkspaceView } from '@/lib/workspace-routes';

const routes = new Map(
  Object.entries(viewSlugs)
    .filter(([view]) => view !== 'Overview')
    .map(([view, slug]) => [view === 'Integrations' ? 'settings/integrations' : slug, view as WorkspaceView]),
);

export const metadata = { title: 'Example report | SiteRadar', robots: { index: false, follow: false } };
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...Array.from(routes.keys(), path => ({ segments: path.split('/') })),
    ...exampleAudit.findings.map(finding => ({ segments: ['issues', finding.id] })),
    ...exampleAudit.pages.map(page => ({ segments: ['pages', page.id!] })),
  ];
}

export default async function DemoView({ params }: { params: Promise<{ segments: string[] }> }) {
  const { segments } = await params;
  const view = routes.get(segments.join('/'));
  if (view) return <Workspace demo route={{ view, scope: 'workspace' }} />;
  const [section, detailId] = segments;
  if (segments.length === 2 && section === 'issues' && exampleAudit.findings.some(item => item.id === detailId))
    return <Workspace demo route={{ view: 'Issues', scope: 'workspace', detailId }} />;
  if (segments.length === 2 && section === 'pages' && exampleAudit.pages.some(item => item.id === detailId))
    return <Workspace demo route={{ view: 'Pages', scope: 'workspace', detailId }} />;
  notFound();
}
