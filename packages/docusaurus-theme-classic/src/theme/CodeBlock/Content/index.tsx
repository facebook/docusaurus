/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ComponentProps, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  useCodeBlockContext,
  filterMagicCommentLines,
  type PrismTokenLine,
} from '@docusaurus/theme-common/internal';
import {usePrismTheme} from '@docusaurus/theme-common';
import {Highlight} from 'prism-react-renderer';
import type {Props} from '@theme/CodeBlock/Content';
import Line from '@theme/CodeBlock/Line';

import styles from './styles.module.css';

// TODO Docusaurus v4: remove useless forwardRef
const Pre = React.forwardRef<HTMLPreElement, ComponentProps<'pre'>>(
  function Pre(props, ref) {
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

  // When magic comment lines were stripped (codeInput !== code), pass the
  // original codeInput to Prism so after-tokenize hooks see the full line set,
  // then filter magic comment token lines and rebuild lineClassNames post-hook.
  // When metastring-based highlighting is used or there are no magic comments,
  // codeInput === code (parseLines doesn't strip anything), so we use
  // metadata.lineClassNames directly with the stripped code.
  const {
    codeInput,
    code,
    language,
    lineNumbersStart,
    lineClassNames: metadataLineClassNames,
    magicComments,
  } = metadata;

  // parseLines trims a trailing newline from codeInput, so codeInput and code
  // may differ by only a trailing newline even when no magic comment lines were
  // stripped. Compare line counts to detect actual line stripping.
  const hasMagicCommentLines =
    codeInput.replace(/\r?\n$/, '').split(/\r?\n/).length >
      code.split(/\r?\n/).length &&
    magicComments.length > 0 &&
    language !== undefined;

  return (
    <Highlight
      theme={prismTheme}
      code={hasMagicCommentLines ? codeInput : code}
      language={language}>
      {({className, style, tokens: lines, getLineProps, getTokenProps}) => {
        const {filteredLines, lineClassNames} = hasMagicCommentLines
          ? filterMagicCommentLines(
              lines as PrismTokenLine[],
              language!,
              magicComments,
            )
          : {filteredLines: lines, lineClassNames: metadataLineClassNames};

        return (
          <Pre
            ref={wordWrap.codeBlockRef}
            className={clsx(classNameProp, className)}
            style={style}>
            <Code>
              {filteredLines.map((line, i) => (
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
