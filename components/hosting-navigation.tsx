"use client";
import type { AnchorHTMLAttributes, MouseEvent } from 'react';

export function navigateHosting(href: string) {
  if (href === '/app' || href.startsWith('/app/')) {
    window.history.pushState(null, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo(0, 0);
  } else window.location.assign(href);
}
export function useHostingRouter() { return { push: navigateHosting }; }
export default function HostingLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  function click(event: MouseEvent<HTMLAnchorElement>) {
    props.onClick?.(event);
    if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !props.target && props.href?.startsWith('/app')) {
      event.preventDefault();
      navigateHosting(props.href);
    }
  }
  return <a {...props} onClick={click} />;
}
