import { UiText } from '@/components/ui-language';
import { PublicHeader, PublicFooter } from "@/components/public-shell";
import { DocsBrowser } from "@/components/docs-browser";
import {publicMetadata, siteEntities} from '@/lib/seo';
import {absoluteUrl} from '@/lib/site';
import {JsonLd} from '@/components/json-ld';
import {docs} from '@/lib/docs';
export const metadata = publicMetadata('Documentation | SiteRadar','Learn how to audit websites, understand Lighthouse metrics, track keywords, manage projects and turn findings into repair prompts.','/docs');
export default function Docs() {
  const entities=siteEntities();
  return (
    <div className="public-site">
      <PublicHeader active="docs" />
      <JsonLd data={{
        ...entities,
        '@graph': [
          ...entities['@graph'],
          {
            '@type': 'CollectionPage',
            '@id': absoluteUrl('/docs/#webpage'),
            name: 'Documentation | SiteRadar',
            url: absoluteUrl('/docs/'),
            isPartOf: {'@id': absoluteUrl('/#website')},
            about: {'@id': absoluteUrl('/#application')},
            inLanguage: 'en',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: docs.map((doc, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: doc.title,
                url: absoluteUrl(`/docs/${doc.slug}/`),
              })),
            },
          },
        ],
      }} />
      <main className="public-container docs-home">
        <div className="public-page-title">
          <span className="public-eyebrow">THE SITERADAR FIELD GUIDE</span>
          <h1><UiText text={"A little guidance."} /><br /><UiText text={"A clearer way forward."} /></h1>
          <p>
            <UiText text={"Set up your projects, understand the measurements, and turn findings into fixes."} />
          </p>
        </div>
        <DocsBrowser />
      </main>
      <PublicFooter />
    </div>
  );
}
