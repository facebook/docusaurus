/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/CodeBlock/Line';

import styles from './styles.module.css';

type Token = Props['line'][number];

// Replaces '\n' by ''
// Historical code, not sure why we even need this :/
function fixLineBreak(line: Token[]) {
  const singleLineBreakToken =
    line.length === 1 && line[0]!.content === '\n' ? line[0] : undefined;

  if (singleLineBreakToken) {
    return [{...singleLineBreakToken, content: ''}];
  }

  return line;
}

export default function CodeBlockLine({
  line: lineProp,
  classNames,
  showLineNumbers,
  getLineProps,
  getTokenProps,
}: Props): ReactNode {
  const line = fixLineBreak(lineProp);

  const lineProps = getLineProps({
    line,
    className: clsx(classNames, showLineNumbers && styles.codeLine),
  });

  const lineTokens = line.map((token, key) => (
    <span key={key} {...getTokenProps({token})} />
  ));

  return (
    <span {...lineProps}>
      {showLineNumbers ? (
        <>
          <span className={styles.codeLineNumber} />
          <span className={styles.codeLineContent}>{lineTokens}</span>
        </>
      ) : (
        lineTokens
      )}
      <br />
    </span>
  );
}
