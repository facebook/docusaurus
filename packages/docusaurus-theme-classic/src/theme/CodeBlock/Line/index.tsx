/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import LineToken from '@theme/CodeBlock/Line/Token';
import type {Props} from '@theme/CodeBlock/Line';

import styles from './styles.module.css';

export default function CodeBlockLine({
  line,
  classNames,
  showLineNumbers,
  getLineProps,
  getTokenProps,
}: Props): ReactNode {
  const lineProps = getLineProps({
    line,
    className: clsx(classNames, showLineNumbers && styles.codeLine),
  });

  const lineTokens = line.map((token, key) => {
    const tokenProps = getTokenProps({token});
    return (
      <LineToken key={key} {...tokenProps} line={line} token={token}>
        {tokenProps.children}
      </LineToken>
    );
  });

  return (
    <div {...lineProps}>
      {showLineNumbers ? (
        <>
          <span className={styles.codeLineNumber} />
          <span className={styles.codeLineContent}>{lineTokens}</span>
        </>
      ) : (
        lineTokens
      )}
    </div>
  );
}
