/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  isValidElement,
  type ComponentProps,
  type ReactNode,
} from 'react';
import clsx from 'clsx';
import Highlight, {defaultProps, type Language} from 'prism-react-renderer';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {
  useThemeConfig,
  parseCodeBlockTitle,
  parseLanguage,
  parseLines,
  containsLineNumbers,
  ThemeClassNames,
  usePrismTheme,
  getPrismCssVariables,
} from '@docusaurus/theme-common';
import CopyButton from '@theme/CodeBlock/CopyButton';
import type {Props} from '@theme/CodeBlock';

import styles from './styles.module.css';

// Lib does not make this easy
type RenderProps = Parameters<ComponentProps<typeof Highlight>['children']>[0];
type GetLineProps = RenderProps['getLineProps'];
type GetTokenProps = RenderProps['getTokenProps'];
type Token = RenderProps['tokens'][number][number];

function CodeBlockLine({
  line,
  highlight,
  showLineNumbers,
  getLineProps,
  getTokenProps,
}: {
  line: Token[];
  highlight: boolean;
  showLineNumbers: boolean;
  getLineProps: GetLineProps;
  getTokenProps: GetTokenProps;
}) {
  if (line.length === 1 && line[0]!.content === '\n') {
    line[0]!.content = '';
  }

  const lineProps = getLineProps({
    line,
    ...(showLineNumbers && {className: styles.codeLine}),
  });

  if (highlight) {
    lineProps.className += ' docusaurus-highlight-code-line';
  }

  const lineTokens = line.map((token, key) => (
    <span key={key} {...getTokenProps({token, key})} />
  ));

  return (
    <span {...lineProps}>
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

/**
 * Best attempt to make the children a plain string so it is copyable. If there
 * are react elements, we will not be able to copy the content, and it will
 * return `children` as-is; otherwise, it concatenates the string children
 * together.
 */
function maybeStringifyChildren(children: ReactNode): ReactNode {
  if (React.Children.toArray(children).some((el) => isValidElement(el))) {
    return children;
  }
  // The children is now guaranteed to be one/more plain strings
  return Array.isArray(children) ? children.join('') : (children as string);
}

export default function CodeBlock({
  children: rawChildren,
  ...props
}: Props): JSX.Element {
  // The Prism theme on SSR is always the default theme but the site theme can
  // be in a different mode. React hydration doesn't update DOM styles that come
  // from SSR. Hence force a re-render after mounting to apply the current
  // relevant styles.
  const isBrowser = useIsBrowser();
  const children = maybeStringifyChildren(rawChildren);
  const CodeBlockComp =
    typeof children === 'string' ? CodeBlockString : CodeBlockJSX;
  return (
    <CodeBlockComp key={String(isBrowser)} {...props}>
      {children as string}
    </CodeBlockComp>
  );
}

function CodeBlockContainer<T extends 'div' | 'pre'>({
  as: As,
  ...props
}: {as: T} & ComponentProps<T>) {
  return (
    <As
      // Polymorphic components are hard to type, without `oneOf` generics
      {...(props as never)}
      className={clsx(
        props.className,
        styles.codeBlockContainer,
        ThemeClassNames.common.codeBlock,
      )}
    />
  );
}

// <pre> tags in markdown map to CodeBlocks. They may contain JSX children.
// When the children is not a simple string, we just return a styled block
// without actually highlighting.
function CodeBlockJSX({children, className}: Props): JSX.Element {
  const prismTheme = usePrismTheme();
  const prismCssVariables = getPrismCssVariables(prismTheme);
  return (
    <CodeBlockContainer
      as="pre"
      tabIndex={0}
      className={clsx(styles.codeBlockStandalone, 'thin-scrollbar', className)}
      style={prismCssVariables}>
      <code className={styles.codeBlockLines}>{children}</code>
    </CodeBlockContainer>
  );
}

function CodeBlockString({
  children,
  className: blockClassName = '',
  metastring,
  title,
  showLineNumbers: showLineNumbersProp,
  language: languageProp,
}: Omit<Props, 'children'> & {children: string}): JSX.Element {
  const {
    prism: {defaultLanguage},
  } = useThemeConfig();
  const language =
    languageProp ?? parseLanguage(blockClassName) ?? defaultLanguage;
  const prismTheme = usePrismTheme();
  const prismCssVariables = getPrismCssVariables(prismTheme);

  // We still parse the metastring in case we want to support more syntax in the
  // future. Note that MDX doesn't strip quotes when parsing metastring:
  // "title=\"xyz\"" => title: "\"xyz\""
  const codeBlockTitle = parseCodeBlockTitle(metastring) || title;

  const {highlightLines, code} = parseLines(children, metastring, language);
  const showLineNumbers =
    showLineNumbersProp || containsLineNumbers(metastring);

  return (
    <Highlight
      {...defaultProps}
      theme={prismTheme}
      code={code}
      language={(language ?? 'text') as Language}>
      {({className, tokens, getLineProps, getTokenProps}) => (
        <CodeBlockContainer
          as="div"
          className={clsx(blockClassName, {
            [`language-${language}`]:
              language && !blockClassName.includes(`language-${language}`),
          })}
          style={prismCssVariables}>
          {codeBlockTitle && (
            <div className={styles.codeBlockTitle}>{codeBlockTitle}</div>
          )}
          <div className={styles.codeBlockContent}>
            <pre
              /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
              tabIndex={0}
              className={clsx(className, styles.codeBlock, 'thin-scrollbar')}>
              <code
                className={clsx(
                  styles.codeBlockLines,
                  showLineNumbers && styles.codeBlockLinesWithNumbering,
                )}>
                {tokens.map((line, i) => (
                  <CodeBlockLine
                    key={i}
                    line={line}
                    getLineProps={getLineProps}
                    getTokenProps={getTokenProps}
                    highlight={highlightLines.includes(i)}
                    showLineNumbers={showLineNumbers}
                  />
                ))}
              </code>
            </pre>

            <CopyButton code={code} />
          </div>
        </CodeBlockContainer>
      )}
    </Highlight>
  );
}
