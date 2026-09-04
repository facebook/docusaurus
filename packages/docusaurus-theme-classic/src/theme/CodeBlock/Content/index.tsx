/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {type ComponentProps, type ReactNode} from 'react';
import clsx from 'clsx';
import {useCodeBlockContext} from '@docusaurus/theme-common/internal';
import {Highlight, type PrismTheme} from 'prism-react-renderer';
import type {Props} from '@theme/CodeBlock/Content';
import Line from '@theme/CodeBlock/Line';

import styles from './styles.module.css';

// A bare theme with no colors so that prism-react-renderer does NOT
// inject inline styles on each token span. Token classnames (e.g.
// `token keyword`) are still applied by Prism.js regardless of theme.
// Actual syntax-highlight colors are provided by the CSS generated in
// loadContent() and bundled via getClientModules(), scoped under
// [data-theme='light|dark']. This prevents the flash of wrong colors
// in dark mode (issue #11566).
const BARE_PRISM_THEME: PrismTheme = {plain: {}, styles: []};

function Pre({className, ref, ...props}: ComponentProps<'pre'>) {
  return (
    <pre
      ref={ref}
      /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
      tabIndex={0}
      {...props}
      className={clsx(className, styles.codeBlock, 'thin-scrollbar')}
    />
  );
}

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
  const {code, language, lineNumbersStart, lineClassNames} = metadata;
  return (
    <Highlight theme={BARE_PRISM_THEME} code={code} language={language}>
      {({className, tokens: lines, getLineProps, getTokenProps}) => (
        <Pre
          ref={wordWrap.codeBlockRef}
          className={clsx(classNameProp, className)}>
          <Code>
            {lines.map((line, i) => (
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
      )}
    </Highlight>
  );
}
