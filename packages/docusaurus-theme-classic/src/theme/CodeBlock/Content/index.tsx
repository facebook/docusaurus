/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ComponentProps, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  parseCodeLinesFromTokens,
  useCodeBlockContext,
} from '@docusaurus/theme-common/internal';
import {usePrismTheme, useThemeConfig} from '@docusaurus/theme-common';
import {Highlight} from 'prism-react-renderer';
import type {Props} from '@theme/CodeBlock/Content';
import Line from '@theme/CodeBlock/Line';

import styles from './styles.module.css';

// TODO Docusaurus v4: remove useless forwardRef
const Pre = React.forwardRef<HTMLPreElement, ComponentProps<'pre'>>(
  (props, ref) => {
    return (
      <pre
        ref={ref}
        /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
        tabIndex={0}
        {...props}
        className={clsx(props.className, styles.codeBlock, 'thin-scrollbar')}
      />
    );
  },
);

function Code(props: ComponentProps<'code'>) {
  const {metadata} = useCodeBlockContext();
  return (
    <code
      {...props}
      className={clsx(
        props.className,
        styles.codeBlockLines,
        metadata.lineNumbersStart !== undefined &&
          styles.codeBlockLinesWithNumbering,
      )}
      style={{
        ...props.style,
        counterReset:
          metadata.lineNumbersStart === undefined
            ? undefined
            : `line-count ${metadata.lineNumbersStart - 1}`,
      }}
    />
  );
}

export default function CodeBlockContent({
  className: classNameProp,
}: Props): ReactNode {
  const {metadata, wordWrap} = useCodeBlockContext();
  const prismTheme = usePrismTheme();
  const {prism} = useThemeConfig();
  const {codeInput, language, lineNumbersStart, metastring} = metadata;
  return (
    <Highlight theme={prismTheme} code={codeInput} language={language}>
      {({className, style, tokens: lines, getLineProps, getTokenProps}) => {
        const {lineClassNames, lineIndexes} = parseCodeLinesFromTokens({
          codeInput,
          tokens: lines,
          metastring,
          magicComments: prism.magicComments,
          language,
        });
        const visibleLines = lineIndexes.map((index) => lines[index]!);
        return (
          <Pre
            ref={wordWrap.codeBlockRef}
            className={clsx(classNameProp, className)}
            style={style}>
            <Code>
              {visibleLines.map((line, i) => (
                <Line
                  key={i}
                  line={line}
                  getLineProps={getLineProps}
                  getTokenProps={getTokenProps}
                  classNames={lineClassNames[i]}
                  showLineNumbers={lineNumbersStart !== undefined}
                />
              ))}
            </Code>
          </Pre>
        );
      }}
    </Highlight>
  );
}
