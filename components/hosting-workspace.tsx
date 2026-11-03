"use client";
import { useEffect, useState } from 'react';
import { Workspace } from './workspace';
import { apiFetch } from '@/lib/api';
import { parseWorkspaceRoute, safeReturnPath } from '@/lib/workspace-routes';
import type { Audit, User } from '@/lib/types';

export function HostingWorkspace() {
  const [location, setLocation] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const sync = () => setLocation(window.location.pathname + window.location.search);
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  useEffect(() => {
    let disposed = false;
    setReady(false);
    setError('');
    async function load() {
      try {
        const session = await apiFetch('/api/auth/session', { cache: 'no-store' });
        if (!session.ok) throw new Error('Could not load your account.');
        const account = await session.json();
        if (!account.data) {
          window.location.replace('/sign-in?next=' + encodeURIComponent(safeReturnPath(window.location.pathname + window.location.search)));
          return;
        }
        const response = await apiFetch('/api/audits', { cache: 'no-store' });
        if (!response.ok) throw new Error('Could not load your reports.');
        const data = await response.json();
        if (!disposed) { setUser(account.data); setAudits(data.data); setReady(true); }
      } catch (e) { if (!disposed) setError(e instanceof Error ? e.message : 'Could not connect.'); }
    }
    void load();
    return () => { disposed = true; };
  }, [location]);
  if (error) return <main className="public-container public-page-title"><h1>Connection interrupted.</h1><p role="alert">{error}</p><button className="btn primary" onClick={() => window.location.reload()}>Try again</button></main>;
  if (!ready || !location) return <main className="public-container public-page-title"><p role="status">Opening your workspace…</p></main>;
  const url = new URL(location, 'https://siteradar.site');
  const route = parseWorkspaceRoute(url.pathname.replace(/^\/app\/?/, '').split('/').filter(Boolean));
  if (!route) return <main className="public-container public-page-title"><h1>Page not found.</h1><a href="/app">Back to your workspace</a></main>;
  const audit = route.scope === 'audit' ? audits.find(a => a.id === route.resourceId) : route.scope === 'project' ? audits.find(a => a.projectId === route.resourceId) : undefined;
  if (route.resourceId && !audit) return <main className="public-container public-page-title"><h1>Report not found.</h1><a href="/app">Back to your workspace</a></main>;
  return <Workspace key={location} user={user!} initialAudits={audits} initialAudit={audit} route={route} initialSelected={(url.searchParams.get('issues') ?? '').split(',').filter(Boolean)} initialFilters={{ category: url.searchParams.get('category') ?? undefined, search: url.searchParams.get('search') ?? undefined }} />;
}
