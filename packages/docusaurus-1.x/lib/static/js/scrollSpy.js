/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

(function scrollSpy() {
  const OFFSET = 10;
  let timer;
  let headingsCache;
  const findHeadings = () =>
    headingsCache || document.querySelectorAll('.toc-headings > li > a');
  const onScroll = () => {
    if (timer) {
      // throttle
      return;
    }
    timer = setTimeout(() => {
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
          headings[i].className = 'active';
        } else {
          headings[i].className = '';
        }
      }
    }, 100);
  };
  document.addEventListener('scroll', onScroll);
  document.addEventListener('resize', onScroll);
  document.addEventListener('DOMContentLoaded', () => {
    // Cache the headings once the page has fully loaded.
    headingsCache = findHeadings();
    onScroll();
  });
})();
