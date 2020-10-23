/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useState} from 'react';

function useTOCHighlight(
  linkClassName: string,
  linkActiveClassName: string,
  topOffset: number,
): void {
  const [lastActiveLink, setLastActiveLink] = useState<HTMLAnchorElement>(
    undefined!,
  );

  useEffect(() => {
    function setActiveLink() {
      function getActiveHeaderAnchor(): Element | null {
        const headersAnchors: Element[] = Array.from(
          document.getElementsByClassName('anchor'),
        );

        const firstAnchorUnderViewportTop = headersAnchors.find((anchor) => {
          const {top} = anchor.getBoundingClientRect();
          return top >= topOffset;
        });

        if (firstAnchorUnderViewportTop) {
          // If first anchor in viewport is under a certain threshold, we consider it's not the active anchor.
          // In such case, the active anchor is the previous one (if it exists), that may be above the viewport
          if (
            firstAnchorUnderViewportTop.getBoundingClientRect().top >= topOffset
          ) {
            const previousAnchor =
              headersAnchors[
                headersAnchors.indexOf(firstAnchorUnderViewportTop) - 1
              ];
            return previousAnchor ?? firstAnchorUnderViewportTop;
          }
          // If the anchor is at the top of the viewport, we consider it's the first anchor
          else {
            return firstAnchorUnderViewportTop;
          }
        }
        // no anchor under viewport top? (ie we are at the bottom of the page)
        else {
          // highlight the last anchor found
          return headersAnchors[headersAnchors.length - 1];
        }
      }

      const activeHeaderAnchor = getActiveHeaderAnchor();

      if (activeHeaderAnchor) {
        let index = 0;
        let itemHighlighted = false;

        // @ts-expect-error: Must be <a> tags.
        const links: HTMLCollectionOf<HTMLAnchorElement> = document.getElementsByClassName(
          linkClassName,
        );
        while (index < links.length && !itemHighlighted) {
          const link = links[index];
          const {href} = link;
          const anchorValue = decodeURIComponent(
            href.substring(href.indexOf('#') + 1),
          );

          if (activeHeaderAnchor.id === anchorValue) {
            if (lastActiveLink) {
              lastActiveLink.classList.remove(linkActiveClassName);
            }
            link.classList.add(linkActiveClassName);
            setLastActiveLink(link);
            itemHighlighted = true;
          }

          index += 1;
        }
      }
    }

    document.addEventListener('scroll', setActiveLink);
    document.addEventListener('resize', setActiveLink);

    setActiveLink();

    return () => {
      document.removeEventListener('scroll', setActiveLink);
      document.removeEventListener('resize', setActiveLink);
    };
  });
}

export default useTOCHighlight;
