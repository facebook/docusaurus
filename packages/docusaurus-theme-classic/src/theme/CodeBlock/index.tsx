/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import Highlight, {defaultProps, Language} from 'prism-react-renderer';
import copy from 'copy-text-to-clipboard';
import usePrismTheme from '@theme/hooks/usePrismTheme';
import type {Props} from '@theme/CodeBlock';
import Translate, {translate} from '@docusaurus/Translate';
import IconExpand from '@theme/IconExpand';

import styles from './styles.module.css';

import {
  useThemeConfig,
  parseCodeBlockTitle,
  parseLanguage,
  parseLines,
  ThemeClassNames,
} from '@docusaurus/theme-common';

export default function CodeBlock({
  children,
  className: blockClassName,
  metastring,
  title,
}: Props): JSX.Element {
  const {prism} = useThemeConfig();

  const [showCopied, setShowCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
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

  // TODO: the title is provided by MDX as props automatically
  // so we probably don't need to parse the metastring
  // (note: title="xyz" => title prop still has the quotes)
  const codeBlockTitle = parseCodeBlockTitle(metastring) || title;

  const prismTheme = usePrismTheme();

  // In case interleaved Markdown (e.g. when using CodeBlock as standalone component).
  const content = Array.isArray(children)
    ? children.join('')
    : (children as string);

  const language =
    parseLanguage(blockClassName) ?? (prism.defaultLanguage as Language);
  const {highlightLines, collapsibleLines, code} = parseLines(
    content,
    metastring,
    language,
  );

  const handleCopyCode = () => {
    copy(code);
    setShowCopied(true);

    setTimeout(() => setShowCopied(false), 2000);
  };

  const collapsible = collapsibleLines.length > 0;

  return (
    <Highlight
      {...defaultProps}
      key={String(mounted)}
      theme={prismTheme}
      code={code}
      language={language}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <div className={clsx(styles.codeBlockContainer, blockClassName)}>
          {(codeBlockTitle || collapsible) && (
            <div style={style} className={styles.codeBlockTitle}>
              {codeBlockTitle}
              {collapsible && (
                <button
                  type="button"
                  tabIndex={0}
                  aria-label={translate({
                    id: 'theme.CodeBlock.expandButtonAriaLabel',
                    message: 'Expand code block',
                    description:
                      'The ARIA label for expanding code blocks button',
                  })}
                  className={clsx(
                    ThemeClassNames.common.expandCodeBlockButton,
                    styles.expandButton,
                    'clean-btn',
                  )}
                  onClick={() => setCollapsed(!collapsed)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setCollapsed(!collapsed);
                    }
                  }}>
                  <IconExpand expanded={!collapsed} />
                </button>
              )}
            </div>
          )}
          <div className={clsx(styles.codeBlockContent, language)}>
            <pre
              /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
              tabIndex={0}
              className={clsx(className, styles.codeBlock, 'thin-scrollbar')}
              style={style}>
              <code className={styles.codeBlockLines}>
                {tokens.map((line, i) => {
                  if (line.length === 1 && line[0].content === '\n') {
                    line[0].content = '';
                  }

                  const lineProps = getLineProps({line, key: i});

                  if (highlightLines.includes(i + 1)) {
                    lineProps.className += ' docusaurus-highlight-code-line';
                  }

                  if (collapsed) {
                    if (collapsibleLines.includes(i + 1)) {
                      return null;
                    }
                  } else if (collapsibleLines.includes(i + 1)) {
                    lineProps.className += ' docusaurus-collapsible-code-line';
                    if (
                      i !== tokens.length - 1 &&
                      !collapsibleLines.includes(i + 2)
                    ) {
                      lineProps.className +=
                        ' docusaurus-collapsible-code-line-boundary';
                    }
                  } else if (
                    i !== tokens.length - 1 &&
                    collapsibleLines.includes(i + 2)
                  ) {
                    lineProps.className +=
                      ' docusaurus-collapsible-code-line-boundary';
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

            <button
              type="button"
              aria-label={translate({
                id: 'theme.CodeBlock.copyButtonAriaLabel',
                message: 'Copy code to clipboard',
                description: 'The ARIA label for copy code blocks button',
              })}
              className={clsx(styles.copyButton, 'clean-btn')}
              onClick={handleCopyCode}>
              {showCopied ? (
                <Translate
                  id="theme.CodeBlock.copied"
                  description="The copied button label on code blocks">
                  Copied
                </Translate>
              ) : (
                <Translate
                  id="theme.CodeBlock.copy"
                  description="The copy button label on code blocks">
                  Copy
                </Translate>
              )}
            </button>
          </div>
        </div>
      )}
    </Highlight>
  );
}
