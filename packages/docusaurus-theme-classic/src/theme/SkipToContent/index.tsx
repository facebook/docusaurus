/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import styles from './styles.module.css';

function SkipToContent(): JSX.Element {
  const handleSkip = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.keyCode !== 13) {
      return;
    }

    (document.activeElement as HTMLElement).blur();

    const firstMainElement = document.querySelector('main:first-of-type');

    if (firstMainElement) {
      firstMainElement.scrollIntoView();
    }
  };

  return (
    <nav aria-label="Skip navigation links">
      <button
        type="button"
        tabIndex={0}
        className={styles.skipToContent}
        onKeyDown={handleSkip}>
        Skip to main content
      </button>
    </nav>
  );
}

export default SkipToContent;
