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
  useCodeWordWrap,
  createCodeBlockMetadata,
  type CodeBlockMetadata,
} from '@docusaurus/theme-common/internal';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {Highlight, type Language} from 'prism-react-renderer';
import Line from '@theme/CodeBlock/Line';
import CopyButton from '@theme/CodeBlock/CopyButton';
import WordWrapButton from '@theme/CodeBlock/WordWrapButton';
import Container from '@theme/CodeBlock/Container';
import type {Props} from '@theme/CodeBlock/Content/String';

import styles from './styles.module.css';

type WordWrap = ReturnType<typeof useCodeWordWrap>;

function CodeBlockTitle({children}: {children: ReactNode}): ReactNode {
  // Just a pass-through for now
  return children;
}

function CodeBlockContent({
  metadata,
  wordWrap,
}: {
  metadata: CodeBlockMetadata;
  wordWrap: WordWrap;
}): ReactNode {
  const prismTheme = usePrismTheme();
  const {code, language, lineNumbersStart, lineClassNames} = metadata;
  return (
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
  );
}

function CodeBlockButtons({
  metadata,
  wordWrap,
}: {
  metadata: CodeBlockMetadata;
  wordWrap: WordWrap;
}): ReactNode {
  return (
    <div className={styles.buttonGroup}>
      {(wordWrap.isEnabled || wordWrap.isCodeScrollable) && (
        <WordWrapButton
          className={styles.codeButton}
          onClick={() => wordWrap.toggle()}
          isEnabled={wordWrap.isEnabled}
        />
      )}
      <CopyButton className={styles.codeButton} code={metadata.code} />
    </div>
  );
}

function getCodeBlockClassName(metadata: CodeBlockMetadata): string {
  return clsx(
    metadata.className,
    metadata.language &&
      !metadata.className?.includes(`language-${metadata.language}`) &&
      `language-${metadata.language}`,
  );
}

function CodeBlockLayout({metadata}: {metadata: CodeBlockMetadata}): ReactNode {
  const isBrowser = useIsBrowser();
  const wordWrap = useCodeWordWrap();
  return (
    <Container as="div" className={getCodeBlockClassName(metadata)}>
      {metadata.title && (
        <div className={styles.codeBlockTitle}>
          <CodeBlockTitle>{metadata.title}</CodeBlockTitle>
        </div>
      )}
      <div className={styles.codeBlockContent}>
        <CodeBlockContent metadata={metadata} wordWrap={wordWrap} />
        {isBrowser ? (
          <CodeBlockButtons metadata={metadata} wordWrap={wordWrap} />
        ) : null}
      </div>
    </Container>
  );
}

function useCodeBlockMetadata(props: Props): CodeBlockMetadata {
  const {prism} = useThemeConfig();
  return createCodeBlockMetadata({
    code: props.children,
    className: props.className,
    metastring: props.metastring,
    magicComments: prism.magicComments,
    defaultLanguage: prism.defaultLanguage,
    language: props.language,
    title: props.title,
    showLineNumbers: props.showLineNumbers,
  });
}

export default function CodeBlockString(props: Props): ReactNode {
  const metadata = useCodeBlockMetadata(props);
  return <CodeBlockLayout metadata={metadata} />;
}
