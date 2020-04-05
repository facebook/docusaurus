/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useState} from 'react';

function useTOCHighlight(linkClassName, linkActiveClassName, topOffset) {
  const [lastActiveLink, setLastActiveLink] = useState(undefined);

  useEffect(() => {
    let headersAnchors = [];
    let links = [];

    function setActiveLink() {
      function getActiveHeaderAnchor() {
        let index = 0;
        let activeHeaderAnchor = null;

        headersAnchors = document.getElementsByClassName('anchor');
        while (index < headersAnchors.length && !activeHeaderAnchor) {
          const headerAnchor = headersAnchors[index];
          const {top} = headerAnchor.getBoundingClientRect();

          if (top >= 0 && top <= topOffset) {
            activeHeaderAnchor = headerAnchor;
          }

          index += 1;
        }

        return activeHeaderAnchor;
      }

      const activeHeaderAnchor = getActiveHeaderAnchor();

      if (activeHeaderAnchor) {
        let index = 0;
        let itemHighlighted = false;

        links = document.getElementsByClassName(linkClassName);
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
