import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PublicHeader, PublicFooter } from "@/components/public-shell";
import { docs } from "@/lib/docs";
import {publicMetadata,breadcrumbSchema} from '@/lib/seo';
import {JsonLd} from '@/components/json-ld';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=docs.find(d=>d.slug===slug);return article?publicMetadata(`${article.title} | SiteRadar Docs`,article.description,`/docs/${slug}`):{title:'Article not found',robots:{index:false,follow:false}};}
export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }));
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = docs.findIndex((d) => d.slug === slug);
  const d = docs[index];
  if (!d) notFound();
  return (
    <div className="public-site">
      <PublicHeader active="docs" />
      <JsonLd data={breadcrumbSchema([{name:'Home',path:'/'},{name:'Documentation',path:'/docs'},{name:d.title,path:`/docs/${d.slug}`}])}/>
      <main className="public-container docs-layout">
        <aside className="docs-sidebar">
          <Link href="/docs">
            <ArrowLeft size={16} />
            All documentation
          </Link>
          <nav aria-label="Documentation topics">
            {docs.map((a) => (
              <Link
                key={a.slug}
                href={`/docs/${a.slug}`}
                aria-current={a.slug === slug ? "page" : undefined}
              >
                {a.title}
              </Link>
            ))}
          </nav>
          <Link href="/app" className="btn primary">
            Open workspace
            <ArrowRight size={16} />
          </Link>
        </aside>
        <article className="docs-article">
          <span className="public-eyebrow">SITERADAR DOCUMENTATION / {String(index + 1).padStart(2, '0')}</span>
          <h1>{d.title}</h1>
          <p className="article-description">{d.description}</p>
          <nav className="article-toc" aria-label="On this page">
            <strong>In this guide</strong>
            {d.sections.map((s, i) => (
              <a href={`#section-${i}`} key={s.title}>
                {s.title}
              </a>
            ))}
          </nav>
          {d.sections.map((s, i) => (
            <section id={`section-${i}`} key={s.title}>
              <h2>{s.title}</h2>
              <p>{s.body}</p>
            </section>
          ))}
          {docs[index + 1] && (
            <Link className="docs-next" href={`/docs/${docs[index + 1].slug}`}>
              <span>
                Next article<strong>{docs[index + 1].title}</strong>
              </span>
              <ArrowRight size={22} />
            </Link>
          )}
        </article>
      </main>
      <PublicFooter />
    </div>
  );
}
