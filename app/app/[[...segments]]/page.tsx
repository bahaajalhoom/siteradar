import { notFound,redirect } from 'next/navigation';
import { parseWorkspaceRoute } from '@/lib/workspace-routes';
import { Workspace } from '@/components/workspace';
type Props={params:Promise<{segments?:string[]}>};
export async function generateMetadata({params}:Props){const route=parseWorkspaceRoute((await params).segments??[]);return {title:route?.view??'Page not found'};}
export default async function WorkspacePage({params}:Props){
  const segments=(await params).segments??[];const route=parseWorkspaceRoute(segments);if(!route)notFound();
  if(!segments.length)redirect('/app/projects');
  return <Workspace initialAudits={[]} route={route}/>;
}
