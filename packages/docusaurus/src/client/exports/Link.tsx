/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  type ComponentType,
} from 'react';
import {NavLink, Link as RRLink} from 'react-router-dom';
import {applyTrailingSlash} from '@docusaurus/utils-common';
import useDocusaurusContext from './useDocusaurusContext';
import isInternalUrl from './isInternalUrl';
import ExecutionEnvironment from './ExecutionEnvironment';
import {useLinksCollector} from '../LinksCollector';
import {useBaseUrlUtils} from './useBaseUrl';
import type {Props} from '@docusaurus/Link';

// TODO all this wouldn't be necessary if we used ReactRouter basename feature
// We don't automatically add base urls to all links,
// only the "safe" ones, starting with / (like /docs/introduction)
// this is because useBaseUrl() actually transforms relative links
// like "introduction" to "/baseUrl/introduction" => bad behavior to fix
const shouldAddBaseUrlAutomatically = (to: string) => to.startsWith('/');

function Link(
  {
    isNavLink,
    to,
    href,
    activeClassName,
    isActive,
    'data-noBrokenLinkCheck': noBrokenLinkCheck,
    autoAddBaseUrl = true,
    ...props
  }: Props,
  forwardedRef: React.ForwardedRef<HTMLAnchorElement>,
): JSX.Element {
  const {
    siteConfig: {trailingSlash, baseUrl},
  } = useDocusaurusContext();
  const {withBaseUrl} = useBaseUrlUtils();
  const linksCollector = useLinksCollector();
  const innerRef = useRef<HTMLAnchorElement | null>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  // IMPORTANT: using to or href should not change anything
  // For example, MDX links will ALWAYS give us the href props
  // Using one prop or the other should not be used to distinguish
  // internal links (/docs/myDoc) from external links (https://github.com)
  const targetLinkUnprefixed = to || href;

  function maybeAddBaseUrl(str: string) {
    return autoAddBaseUrl && shouldAddBaseUrlAutomatically(str)
      ? withBaseUrl(str)
      : str;
  }

  const isInternal = isInternalUrl(targetLinkUnprefixed);

  // pathname:// is a special "protocol" we use to tell Docusaurus link
  // that a link is not "internal" and that we shouldn't use history.push()
  // this is not ideal but a good enough escape hatch for now
  // see https://github.com/facebook/docusaurus/issues/3309
  // note: we want baseUrl to be appended (see issue for details)
  // TODO read routes and automatically detect internal/external links?
  const targetLinkWithoutPathnameProtocol = targetLinkUnprefixed?.replace(
    'pathname://',
    '',
  );

  // TODO we should use ReactRouter basename feature instead!
  // Automatically apply base url in links that start with /
  let targetLink =
    typeof targetLinkWithoutPathnameProtocol !== 'undefined'
      ? maybeAddBaseUrl(targetLinkWithoutPathnameProtocol)
      : undefined;

  if (targetLink && isInternal) {
    targetLink = applyTrailingSlash(targetLink, {trailingSlash, baseUrl});
  }

  const preloaded = useRef(false);
  const LinkComponent = (isNavLink ? NavLink : RRLink) as ComponentType<Props>;

  const IOSupported = ExecutionEnvironment.canUseIntersectionObserver;

  const ioRef = useRef<IntersectionObserver>();

  const handleRef = (el: HTMLAnchorElement | null) => {
    innerRef.current = el;

    if (IOSupported && el && isInternal) {
      // If IO supported and element reference found, set up Observer.
      ioRef.current = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (el === entry.target) {
            // If element is in viewport, stop observing and run callback.
            // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              ioRef.current!.unobserve(el);
              ioRef.current!.disconnect();
              if (targetLink != null) {
                window.docusaurus.prefetch(targetLink);
              }
            }
          }
        });
      });
      // Add element to the observer.
      ioRef.current.observe(el);
    }
  };

  const onInteractionEnter = () => {
    if (!preloaded.current && targetLink != null) {
      window.docusaurus.preload(targetLink);
      preloaded.current = true;
    }
  };

  useEffect(() => {
    // If IO is not supported. We prefetch by default (only once).
    if (!IOSupported && isInternal) {
      if (targetLink != null) {
        window.docusaurus.prefetch(targetLink);
      }
    }

    // When unmounting, stop intersection observer from watching.
    return () => {
      if (IOSupported && ioRef.current) {
        ioRef.current.disconnect();
      }
    };
  }, [ioRef, targetLink, IOSupported, isInternal]);

  const isAnchorLink = targetLink?.startsWith('#') ?? false;
  const isRegularHtmlLink = !targetLink || !isInternal || isAnchorLink;

  if (!isRegularHtmlLink && !noBrokenLinkCheck) {
    linksCollector.collectLink(targetLink!);
  }

  return isRegularHtmlLink ? (
    // eslint-disable-next-line jsx-a11y/anchor-has-content, @docusaurus/no-html-links
    <a
      ref={innerRef}
      href={targetLink}
      {...(targetLinkUnprefixed &&
        !isInternal && {target: '_blank', rel: 'noopener noreferrer'})}
      {...props}
    />
  ) : (
    <LinkComponent
      {...props}
      onMouseEnter={onInteractionEnter}
      onTouchStart={onInteractionEnter}
      innerRef={handleRef}
      to={targetLink}
      // Avoid "React does not recognize the `activeClassName` prop on a DOM
      // element"
      {...(isNavLink && {isActive, activeClassName})}
    />
  );
}

export default React.forwardRef(Link);
