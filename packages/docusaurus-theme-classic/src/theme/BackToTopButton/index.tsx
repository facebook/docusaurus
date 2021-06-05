/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import clsx from 'clsx';
import useScrollPosition from '@theme/hooks/useScrollPosition';

import styles from './styles.module.css';

const threshold = 300;

function smoothScrollToTop() {
  const currentScroll = document.documentElement.scrollTop;

  if (currentScroll > 0) {
    requestAnimationFrame(smoothScrollToTop);

    window.scrollTo(0, Math.floor(currentScroll * 0.85));
  }
}

function BackToTopButton(): JSX.Element {
  const [show, setShow] = useState(false);

  useScrollPosition(({scrollY: scrollTop}, {scrollY: lastScrollTop}) => {
    if (scrollTop < threshold) {
      setShow(false);
      return;
    }

    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    if (lastScrollTop && scrollTop >= lastScrollTop) {
      setShow(false);
    } else if (scrollTop + windowHeight < documentHeight) {
      setShow(true);
    }
  }, []);

  return (
    <button
      className={clsx(styles.BackToTopButton, {
        [styles.BackToTopButtonShow]: show,
      })}
      type="button"
      title="Scroll to top"
      onClick={() => smoothScrollToTop()}>
      <svg viewBox="0 0 24 24" width="28">
        <path
          d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}

export default BackToTopButton;
