import Link from 'next/link';
import {ArrowRight,ArrowUpRight,Code} from '@phosphor-icons/react/dist/ssr';
import {PublicHeader,PublicFooter} from '@/components/public-shell';
import {JsonLd} from '@/components/json-ld';
import {publicMetadata,siteEntities,breadcrumbSchema} from '@/lib/seo';
import {absoluteUrl,founder} from '@/lib/site';

export const metadata=publicMetadata('AhmadJalhoom — Founder & Developer of SiteRadar','AhmadJalhoom is the founder and developer of SiteRadar (siteradar.site), a website auditing product for SEO, performance, accessibility and content readiness.',founder.path);

export default function Founder(){
  return <div className="public-site">
    <PublicHeader active="about"/>
    <JsonLd data={siteEntities()}/>
    <JsonLd data={{'@context':'https://schema.org','@type':'ProfilePage','@id':absoluteUrl(founder.path+'#profile'),url:absoluteUrl(founder.path),name:'AhmadJalhoom — founder and developer of SiteRadar',mainEntity:{'@id':absoluteUrl(founder.path+'#person')},mentions:{'@id':absoluteUrl('/#application')}}}/>
    <JsonLd data={breadcrumbSchema([{name:'Home',path:'/'},{name:'About SiteRadar',path:'/about'},{name:'AhmadJalhoom',path:founder.path}])}/>
    <main className="public-container founder-page">
      <div className="founder-identity"><span className="founder-monogram" aria-hidden="true">AJ</span><div><h1>AhmadJalhoom</h1><p>Software Engineer · Founder & developer of SiteRadar</p></div></div>
      <article className="founder-bio">
        <h2>AhmadJalhoom, founder of SiteRadar.</h2>
        <p>AhmadJalhoom is a software engineer and the founder and developer of <Link href="/">SiteRadar</Link>, the website auditing product at <a href="https://siteradar.site/">siteradar.site</a>. He created SiteRadar to bring website audit evidence and practical repair steps into the same workflow.</p>
        <p lang="ar" dir="rtl">AhmadJalhoom هو مهندس برمجيات ومؤسس ومطوّر مشروع SiteRadar، منصة فحص المواقع التي تجمع نتائج SEO والأداء وإمكانية الوصول مع أدلة وتوصيات للإصلاح.</p>
        <h2>What is AhmadJalhoom’s SiteRadar project?</h2>
        <p>SiteRadar combines technical SEO observations, real browser checks, Lighthouse performance measurements, automated accessibility findings, contextual keyword tracking and repair-prompt generation. Each report connects findings to the pages checked.</p>
        <p>See Ahmad’s professional profile on <a href={founder.profileUrl} target="_blank" rel="noreferrer">Taqat <ArrowUpRight size={15} aria-hidden="true" /></a>.</p>
        <div className="founder-project"><Code size={28}/><div><h3>SiteRadar</h3><p>Website audit intelligence. See clearly. Improve deliberately.</p><span>Founded and developed by AhmadJalhoom</span></div><Link className="btn primary" href="/">Explore SiteRadar<ArrowRight size={17}/></Link></div>
        <Link href="/about" className="text-link">More about SiteRadar<ArrowRight size={17}/></Link>
      </article>
    </main>
    <PublicFooter/>
  </div>;
}
