/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {isValidElement, useEffect, useState} from 'react';
import clsx from 'clsx';
import Highlight, {defaultProps, type Language} from 'prism-react-renderer';
import {
  useThemeConfig,
  parseCodeBlockTitle,
  parseLanguage,
  parseLines,
  ThemeClassNames,
  usePrismTheme,
} from '@docusaurus/theme-common';
import CopyButton from '@theme/CodeBlock/CopyButton';
import type {Props} from '@theme/CodeBlock';

import styles from './styles.module.css';

export default function CodeBlock({
  children,
  className: blockClassName = '',
  metastring,
  title,
  language: languageProp,
}: Props): JSX.Element {
  const {prism} = useThemeConfig();

  const [mounted, setMounted] = useState(false);
  // The Prism theme on SSR is always the default theme but the site theme
  // can be in a different mode. React hydration doesn't update DOM styles
  // that come from SSR. Hence force a re-render after mounting to apply the
  // current relevant styles. There will be a flash seen of the original
  // styles seen using this current approach but that's probably ok. Fixing
  // the flash will require changing the theming approach and is not worth it
  // at this point.
  useEffect(() => {
    setMounted(true);
  }, []);

  // We still parse the metastring in case we want to support more syntax in the
  // future. Note that MDX doesn't strip quotes when parsing metastring:
  // "title=\"xyz\"" => title: "\"xyz\""
  const codeBlockTitle = parseCodeBlockTitle(metastring) || title;
  const prismTheme = usePrismTheme();

  // <pre> tags in markdown map to CodeBlocks and they may contain JSX children.
  // When the children is not a simple string, we just return a styled block
  // without actually highlighting.
  if (React.Children.toArray(children).some((el) => isValidElement(el))) {
    return (
      <Highlight
        {...defaultProps}
        key={String(mounted)}
        theme={prismTheme}
        code=""
        language={'text' as Language}>
        {({className, style}) => (
          <pre
            /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
            tabIndex={0}
            className={clsx(
              className,
              styles.codeBlockStandalone,
              'thin-scrollbar',
              styles.codeBlockContainer,
              blockClassName,
              ThemeClassNames.common.codeBlock,
            )}
            style={style}>
            <code className={styles.codeBlockLines}>{children}</code>
          </pre>
        )}
      </Highlight>
    );
  }

  // The children is now guaranteed to be one/more plain strings
  const content = Array.isArray(children)
    ? children.join('')
    : (children as string);

  const language =
    languageProp ?? parseLanguage(blockClassName) ?? prism.defaultLanguage;
  const {highlightLines, code} = parseLines(content, metastring, language);

  return (
    <Highlight
      {...defaultProps}
      key={String(mounted)}
      theme={prismTheme}
      code={code}
      language={(language ?? 'text') as Language}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <div
          className={clsx(
            styles.codeBlockContainer,
            blockClassName,
            {
              [`language-${language}`]:
                language && !blockClassName.includes(`language-${language}`),
            },
            ThemeClassNames.common.codeBlock,
          )}>
          {codeBlockTitle && (
            <div style={style} className={styles.codeBlockTitle}>
              {codeBlockTitle}
            </div>
          )}
          <div className={styles.codeBlockContent} style={style}>
            <pre
              /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
              tabIndex={0}
              className={clsx(className, styles.codeBlock, 'thin-scrollbar')}>
              <code className={styles.codeBlockLines}>
                {tokens.map((line, i) => {
                  if (line.length === 1 && line[0]!.content === '\n') {
                    line[0]!.content = '';
                  }

                  const lineProps = getLineProps({line, key: i});

                  if (highlightLines.includes(i)) {
                    lineProps.className += ' docusaurus-highlight-code-line';
                  }

                  return (
                    <span key={i} {...lineProps}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({token, key})} />
                      ))}
                      <br />
                    </span>
                  );
                })}
              </code>
            </pre>

            <CopyButton code={code} />
          </div>
        </div>
      )}
    </Highlight>
  );
}
