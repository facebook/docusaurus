/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import type {Props} from '@theme/CodeBlock/Line';

import styles from './styles.module.css';

export default function CodeBlockLine({
  line,
  classNames,
  showLineNumbers,
  getLineProps,
  getTokenProps,
}: Props): JSX.Element {
  const isBrowser = useIsBrowser();

  if (line.length === 1 && line[0]!.content === '\n') {
    line[0]!.content = '';
  }

  const lineProps = getLineProps({
    line,
    className: clsx(classNames, showLineNumbers && styles.codeLine),
  });

  const lineTokens = line.map((token, key) => (
    <span
      key={key}
      {...getTokenProps({token, key})}
      {...(!isBrowser && {style: undefined})}
    />
  ));

  return (
    <span {...lineProps} {...(!isBrowser && {style: undefined})}>
      {showLineNumbers ? (
        <>
          <span className={styles.codeLineNumber} />
          <span className={styles.codeLineContent}>{lineTokens}</span>
        </>
      ) : (
        <>
          {lineTokens}
          <br />
        </>
      )}
    </span>
  );
}
