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
      let activeNavFound = false;
      const headings = findHeadings(); // toc nav anchors
      for (let i = 0; i < headings.length; i++) {
        // headings[i] is current element
        // if an element is already active, then current element is not active
        // if no element is already active, then current element is active
        let currNavActive = !activeNavFound;
        // if current element is active and it is not the last nav item
        // this loop decides if current active element should stay active or not
        if (currNavActive && i < headings.length - 1) {
          // find the next toc nav item
          const next = headings[i + 1].href.split('#')[1];
          // find the corresponding page header
          const nextHeader = document.getElementById(next);
          // get top offset (relative to viewport) of next page header
          const top = nextHeader.getBoundingClientRect().top;
          // if next header is offset more than 10 pixels from top (it is far) (top > OFFSET)
          // set/keep the current nav element to active
          currNavActive = top > OFFSET;
        }

        if (currNavActive) {
          // if the current nav element is active
          activeNavFound = true;
          headings[i].classList.add('active');
        } else {
          // if the current nav element is not active
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
  });
})();
