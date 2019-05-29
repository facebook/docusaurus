/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable prefer-arrow-callback */
(function scrollSpy() {
  const OFFSET = 10;
  let timer;
  let headingsCache;
  const findHeadings = function findHeadings() {
    return headingsCache || document.querySelectorAll('.toc-headings > li > a');
  };
  const onScroll = function onScroll() {
    if (timer) {
      // throttle
      return;
    }
    timer = setTimeout(function() {
      timer = null;
      let found = false;
      const headings = findHeadings();
      for (let i = 0; i < headings.length; i++) {
        // if !found and i is the last element, highlight the last
        let current = !found;
        if (!found && i < headings.length - 1) {
          const next = headings[i + 1].href.split('#')[1];
          const nextHeader = document.getElementById(next);
          const top = nextHeader.getBoundingClientRect().top;
          // The following tests whether top + scrollTop
          // (the top of the header) is greater than scrollTop
          // (where scrollTop = window.pageYOffset, the top of
          // the window), with OFFSET pixels of slop.
          current = top > OFFSET;
        }
        if (current) {
          found = true;
          headings[i].classList.add('active');
        } else {
          headings[i].classList.remove('active');
        }
      }
    }, 100);
  };
  document.addEventListener('scroll', onScroll);
  document.addEventListener('resize', onScroll);
  document.addEventListener('DOMContentLoaded', function() {
    // Cache the headings once the page has fully loaded.
    headingsCache = findHeadings();
    onScroll();
    // Find the active nav item in the sidebar
    const item = document.getElementsByClassName('navListItemActive')[0];
    if (!item) {
      return;
    }
    const bounding = item.getBoundingClientRect();
    if (
      bounding.top >= 0 &&
      bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    ) {
      // Already visible.  Do nothing.
    } else {
      // Not visible.  Scroll sidebar.
      item.scrollIntoView({block: 'center', inline: 'nearest'});
      // eslint-disable-next-line no-multi-assign
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  });
})();
