import type {Metadata} from 'next';
import {absoluteUrl,configuredSiteUrl,founder,site} from './site';
export function publicMetadata(title:string,description:string,path:string):Metadata{
  return {title,description,keywords:[...site.keywords],alternates:{canonical:absoluteUrl(path)},authors:[{name:founder.name,url:absoluteUrl(founder.path)}],creator:founder.name,openGraph:{title,description,url:absoluteUrl(path),siteName:site.name,type:'website',locale:'en_US',images:[{url:absoluteUrl('/opengraph-image'),width:1200,height:630,alt:'SiteRadar — website audit intelligence by AhmadJalhoom'}]},twitter:{card:'summary_large_image',title,description,images:[absoluteUrl('/opengraph-image')]},robots:{index:configuredSiteUrl().public,follow:true}};
}
export function siteEntities(){
  const origin=configuredSiteUrl().url;const personId=absoluteUrl(founder.path+'#person'),orgId=absoluteUrl('/#organization'),appId=absoluteUrl('/#application');
  return {'@context':'https://schema.org','@graph':[
    {'@type':'Person','@id':personId,name:founder.name,jobTitle:founder.role,url:absoluteUrl(founder.path),sameAs:[founder.profileUrl],description:'Software engineer, founder and developer of SiteRadar.'},
    {'@type':'Organization','@id':orgId,name:site.name,url:origin,founder:{'@id':personId},logo:absoluteUrl('/icon.svg')},
    {'@type':'WebSite','@id':absoluteUrl('/#website'),name:site.name,url:origin,publisher:{'@id':orgId},creator:{'@id':personId},inLanguage:'en'},
    {'@type':'SoftwareApplication','@id':appId,name:site.name,url:origin,description:site.description,applicationCategory:'DeveloperApplication',operatingSystem:'Web',creator:{'@id':personId},author:{'@id':personId},publisher:{'@id':orgId},offers:{'@type':'Offer',price:'0',priceCurrency:'USD',description:'Free plan with unlimited projects and audits. Paid plans are coming soon.'}},
  ]};
}
export function breadcrumbSchema(items:{name:string;path:string}[]){return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:absoluteUrl(item.path)}))};}
export function serializeJsonLd(value:unknown){return JSON.stringify(value).replaceAll('<','\\u003c');}
