/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useCallback, useState, useEffect} from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/CodeBlock/WordWrapButton';

import styles from './styles.module.css';

export default function WordWrapButton({
  codeBlockRef,
  className,
}: Props): JSX.Element | null {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isCodeScrollable, setIsCodeScrollable] = useState<boolean>(false);
  const toggleWordWrapCode = useCallback(() => {
    setIsEnabled((value) => !value);

    const codeElement = codeBlockRef.current!.querySelector('code');
    codeElement?.classList.toggle(styles.codeWithWordWrap!);
  }, [codeBlockRef]);
  const updateCodeIsScrollable = useCallback(() => {
    const {scrollWidth, clientWidth} = codeBlockRef.current!;
    setIsCodeScrollable(scrollWidth > clientWidth);
  }, [codeBlockRef]);

  useEffect(() => {
    updateCodeIsScrollable();

    window.addEventListener('resize', updateCodeIsScrollable);

    return () => {
      window.removeEventListener('resize', updateCodeIsScrollable);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isCodeScrollable) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleWordWrapCode}
      className={clsx(
        'clean-btn',
        className,
        styles.wordWrapButton,
        isEnabled && styles.wordWrapButtonEnabled,
      )}
      // TODO: add i18n
      aria-label="Toggle code wrap"
      title="Toggle code wrap">
      <svg
        className={styles.wordWrapButtonIcon}
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3l3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"
        />
      </svg>
    </button>
  );
}
