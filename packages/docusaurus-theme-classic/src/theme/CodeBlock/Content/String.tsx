/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useThemeConfig, usePrismTheme} from '@docusaurus/theme-common';
import {
  createCodeBlockMetadata,
  useCodeWordWrap,
} from '@docusaurus/theme-common/internal';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {Highlight, type Language} from 'prism-react-renderer';
import Line from '@theme/CodeBlock/Line';
import CopyButton from '@theme/CodeBlock/CopyButton';
import WordWrapButton from '@theme/CodeBlock/WordWrapButton';
import Container from '@theme/CodeBlock/Container';
import type {Props} from '@theme/CodeBlock/Content/String';

import styles from './styles.module.css';

export default function CodeBlockString({
  children,
  className: blockClassName = '',
  metastring,
  ...props
}: Props): ReactNode {
  const {
    prism: {defaultLanguage, magicComments},
  } = useThemeConfig();

  const prismTheme = usePrismTheme();
  const wordWrap = useCodeWordWrap();
  const isBrowser = useIsBrowser();

  const metadata = createCodeBlockMetadata({
    code: children,
    className: blockClassName,
    metastring,
    magicComments,
    defaultLanguage,
    language: props.language,
    title: props.title,
    showLineNumbers: props.showLineNumbers,
  });

  const {code, language, title, lineNumbersStart, lineClassNames} = metadata;

  return (
    <Container
      as="div"
      className={clsx(
        blockClassName,
        language &&
          !blockClassName.includes(`language-${language}`) &&
          `language-${language}`,
      )}>
      {title && <div className={styles.codeBlockTitle}>{title}</div>}
      <div className={styles.codeBlockContent}>
        <Highlight
          theme={prismTheme}
          code={code}
          language={(language ?? 'text') as Language}>
          {({className, style, tokens, getLineProps, getTokenProps}) => (
            <pre
              /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
              tabIndex={0}
              ref={wordWrap.codeBlockRef}
              className={clsx(className, styles.codeBlock, 'thin-scrollbar')}
              style={style}>
              <code
                className={clsx(
                  styles.codeBlockLines,
                  lineNumbersStart !== undefined &&
                    styles.codeBlockLinesWithNumbering,
                )}
                style={
                  lineNumbersStart === undefined
                    ? undefined
                    : {
                        counterReset: `line-count ${lineNumbersStart - 1}`,
                      }
                }>
                {tokens.map((line, i) => (
                  <Line
                    key={i}
                    line={line}
                    getLineProps={getLineProps}
                    getTokenProps={getTokenProps}
                    classNames={lineClassNames[i]}
                    showLineNumbers={lineNumbersStart !== undefined}
                  />
                ))}
              </code>
            </pre>
          )}
        </Highlight>
        {isBrowser ? (
          <div className={styles.buttonGroup}>
            {(wordWrap.isEnabled || wordWrap.isCodeScrollable) && (
              <WordWrapButton
                className={styles.codeButton}
                onClick={() => wordWrap.toggle()}
                isEnabled={wordWrap.isEnabled}
              />
            )}
            <CopyButton className={styles.codeButton} code={code} />
          </div>
        ) : null}
      </div>
    </Container>
  );
}
