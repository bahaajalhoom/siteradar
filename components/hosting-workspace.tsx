"use client";
import { UiText } from '@/components/ui-language';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
    const controller = new AbortController();
    async function load() {
      try {
        const session = await apiFetch('/api/auth/session', { cache: 'no-store', signal: controller.signal });
        if (!session.ok) throw new Error('Could not load your account.');
        const account = await session.json();
        if (controller.signal.aborted) return;
        if (!account.data) {
          window.location.replace('/sign-in?next=' + encodeURIComponent(safeReturnPath(window.location.pathname + window.location.search)));
          return;
        }
        const response = await apiFetch('/api/audits', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Could not load your reports.');
        const data = await response.json();
        if (!controller.signal.aborted) { setUser(account.data); setAudits(data.data); setReady(true); }
      } catch (e) { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Could not connect.'); }
    }
    void load();
    return () => controller.abort();
  }, []);
  const rememberAudit = useCallback((audit: Audit) => {
    setAudits(current => [audit, ...current.filter(item => item.id !== audit.id)]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }, []);
  const { route, selected, filters } = useMemo(() => {
    const url = new URL(location || '/app', 'https://siteradar.site');
    return {
      route: parseWorkspaceRoute(url.pathname.replace(/^\/app\/?/, '').split('/').filter(Boolean)),
      selected: (url.searchParams.get('issues') ?? '').split(',').filter(Boolean),
      filters: { category: url.searchParams.get('category') ?? undefined, search: url.searchParams.get('search') ?? undefined },
    };
  }, [location]);
  if (error) return <main className="public-container public-page-title"><h1><UiText text={"Connection interrupted."} /></h1><p role="alert">{error}</p><button className="btn primary" onClick={() => window.location.reload()}><UiText text={"Try again"} /></button></main>;
  if (!ready || !location) return <main className="public-container public-page-title"><p role="status"><UiText text={"Opening your workspace…"} /></p></main>;
  if (!route) return <main className="public-container public-page-title"><h1><UiText text={"Page not found."} /></h1><a href="/app"><UiText text={"Back to your workspace"} /></a></main>;
  const audit = route.scope === 'audit' ? audits.find(a => a.id === route.resourceId) : route.scope === 'project' ? audits.find(a => a.projectId === route.resourceId) : undefined;
  if (route.resourceId && !audit) return <main className="public-container public-page-title"><h1><UiText text={"Report not found."} /></h1><a href="/app"><UiText text={"Back to your workspace"} /></a></main>;
  return <Workspace key={audit?.id ?? 'workspace'} user={user!} initialAudits={audits} initialAudit={audit} route={route} initialSelected={selected} initialFilters={filters} onAuditUpdate={rememberAudit} onHistoryUpdate={setAudits} />;
}
