export const founder={name:'AhmadJalhoom',role:'Software Engineer',path:'/about/ahmadjalhoom',profileUrl:'https://taqat.work/en/talents/2122'} as const;
export const site={name:'SiteRadar',description:'SiteRadar is a website audit product founded and developed by software engineer AhmadJalhoom, covering SEO, Lighthouse performance, accessibility, and content readiness.',keywords:['SiteRadar','SEO audit','website audit','Lighthouse performance','GEO readiness','AhmadJalhoom','AhmadJalhoom SiteRadar founder','SiteRadar founder and developer','AhmadJalhoom software engineer']} as const;
export function configuredSiteUrl(raw=process.env.APP_BASE_URL){
  const url=new URL(raw||(process.env.NODE_ENV==='production'?'https://siteradar.site':'http://127.0.0.1:3000'));
  if(!['https:','http:'].includes(url.protocol)||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw new Error('APP_BASE_URL must be the website origin, for example https://your-domain.com.');
  const local=['127.0.0.1','localhost','[::1]'].includes(url.hostname);
  if(!local&&url.protocol!=='https:')throw new Error('A public APP_BASE_URL must use HTTPS.');
  return {url:url.origin,public:!local};
}
export function absoluteUrl(path:string){return new URL(path,configuredSiteUrl().url).href;}
