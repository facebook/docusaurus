/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useState} from 'react';

function useTableOfContentHighlight(
  tableOfContentLinkClassName,
  tableOfContentLinkActiveClassName,
  topOffset,
) {
  const [
    lastActiveTableOfContentLink,
    setLastActiveTableOfContentLink,
  ] = useState(undefined);

  useEffect(() => {
    let headersAnchor = [];
    let tableOfContentLinks = [];

    function getActiveHeaderAnchor() {
      const TOP_OFFSET = topOffset;
      let index = 0;
      let activeHeaderAnchor;
      headersAnchor = document.querySelectorAll('a.anchor');
      while (index < headersAnchor.length && !activeHeaderAnchor) {
        const headerAnchor = headersAnchor[index];
        const {top} = headerAnchor.getBoundingClientRect();
        if (top >= 0 && top <= TOP_OFFSET) {
          activeHeaderAnchor = headerAnchor;
        }
        index += 1;
      }
      return activeHeaderAnchor;
    }

    function highlightTableOfContentLink(tableOfContentLink) {
      if (lastActiveTableOfContentLink) {
        lastActiveTableOfContentLink.classList.remove(
          tableOfContentLinkActiveClassName,
        );
      }
      tableOfContentLink.classList.add(tableOfContentLinkActiveClassName);
      setLastActiveTableOfContentLink(tableOfContentLink);
    }

    function getAnchorValue(tableOfContentLink) {
      const splittedUrl = tableOfContentLink.href
        ? decodeURIComponent(tableOfContentLink.href).split('#')
        : [];
      return splittedUrl.length > 1 ? splittedUrl[1] : '';
    }

    function setActiveTableOfContentLink() {
      const activeHeaderAnchor = getActiveHeaderAnchor();
      if (activeHeaderAnchor) {
        let index = 0;
        let itemHighlighted = false;
        tableOfContentLinks = document.querySelectorAll(
          `.${tableOfContentLinkClassName}`,
        );
        while (index < tableOfContentLinks.length && !itemHighlighted) {
          const tableOfContentLink = tableOfContentLinks[index];
          const anchorValue = getAnchorValue(tableOfContentLink);
          if (activeHeaderAnchor.id === anchorValue) {
            highlightTableOfContentLink(tableOfContentLink);
            itemHighlighted = true;
          }
          index += 1;
        }
      }
    }

    document.addEventListener('scroll', setActiveTableOfContentLink);
    document.addEventListener('resize', setActiveTableOfContentLink);

    setActiveTableOfContentLink();

    return () => {
      document.removeEventListener('scroll', setActiveTableOfContentLink);
      document.removeEventListener('resize', setActiveTableOfContentLink);
    };
  });
}

export default useTableOfContentHighlight;
