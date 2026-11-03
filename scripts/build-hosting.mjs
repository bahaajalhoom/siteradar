// Build a frontend-only static export without packaging the API or local data.
import { mkdtemp, cp, mkdir, readFile, writeFile, symlink, rename } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
const root = process.cwd();
const stage = await mkdtemp(join(tmpdir(), 'siteradar-hosting-'));
for (const name of ['app', 'components', 'lib', 'server', 'public', 'scripts', 'package.json', 'tsconfig.json', 'next-env.d.ts', 'postcss.config.mjs']) {
  try {
    await cp(resolve(root, name), join(stage, name), { recursive: true, filter: path => !path.includes('/app/api') && !path.includes('/app/app') && !path.endsWith('.test.ts') });
  } catch (e) { if (e.code !== 'ENOENT') throw e; }
}
await symlink(resolve(root, 'node_modules'), join(stage, 'node_modules'), 'dir');
await writeFile(join(stage, 'next.config.ts'), `export default { output: 'export', trailingSlash: true, images: { unoptimized: true }, turbopack: { root: ${JSON.stringify(stage)} } };\n`);
for (const name of ['app/robots.ts', 'app/sitemap.ts', 'app/opengraph-image.tsx']) {
  const path = join(stage, name);
  await writeFile(path, `export const dynamic = 'force-static';\n` + await readFile(path, 'utf8'));
}
for (const name of ['components/public-shell.tsx', 'components/landing.tsx', 'app/pricing/page.tsx']) {
  const path = join(stage, name);
  const content = (await readFile(path, 'utf8')).replace(/import\s*\{currentUser\}\s*from\s*['"]@\/server\/auth['"];?/, '').replace(/await currentUser\(\)/g, 'null');
  await writeFile(path, content);
}
await mkdir(join(stage, 'app/app'), { recursive: true });
await writeFile(join(stage, 'app/app/page.tsx'), `import {HostingWorkspace} from '@/components/hosting-workspace'; export const metadata={title:'Your workspace | SiteRadar',robots:{index:false,follow:false}}; export default function Page(){return <HostingWorkspace/>;}\n`);
for (const page of ['sign-in', 'sign-up']) {
  await writeFile(join(stage, `app/${page}/page.tsx`), `import {AuthPage} from '@/components/auth-page'; export const metadata={title:${JSON.stringify(page === 'sign-in' ? 'Log in | SiteRadar' : 'Create account | SiteRadar')},robots:{index:false,follow:false}}; export default function Page(){return <AuthPage signup={${page === 'sign-up'}}/>;}\n`);
}
const workspace = join(stage, 'components/workspace.tsx');
await writeFile(workspace, (await readFile(workspace, 'utf8')).replace('import Link from "next/link";', 'import Link from "./hosting-navigation";').replace('import {useRouter} from "next/navigation";', 'import {useHostingRouter as useRouter} from "./hosting-navigation";'));
const auth = join(stage, 'components/auth-form.tsx');
await writeFile(auth, (await readFile(auth, 'utf8')).replace('router.replace(safeReturnPath(returnTo));', 'window.location.assign(safeReturnPath(new URLSearchParams(window.location.search).get("next") || returnTo));').replace('router.refresh();', ''));
const result = spawnSync(process.execPath, ['scripts/next.mjs', 'build', '--webpack'], { cwd: stage, stdio: 'inherit', env: { ...process.env, APP_BASE_URL: 'https://siteradar.site', NEXT_PUBLIC_API_URL: 'https://api-siteradar.apps.taqat.academy' } });
if (result.status !== 0) process.exit(result.status || 1);
await mkdir(resolve(root, '.firebase'), { recursive: true });
const output = resolve(root, '.firebase/export');
try { await rename(output, output + '.previous-' + Date.now()); } catch (e) { if (e.code !== 'ENOENT') throw e; }
await cp(join(stage, 'out'), output, { recursive: true });
console.log('Firebase Hosting frontend built: .firebase/export');
