/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState, useRef} from 'react';
import classnames from 'classnames';
import Highlight, {defaultProps} from 'prism-react-renderer';
import defaultTheme from 'prism-react-renderer/themes/palenight';
import Clipboard from 'clipboard';
import rangeParser from 'parse-numeric-range';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useThemeContext from '@theme/hooks/useThemeContext';
import Playground from '@theme/Playground';

import styles from './styles.module.css';

const highlightLinesRangeRegex = /{([\d,-]+)}/;
const codeBlockTitleRegex = /title=".*"/;

export default ({
  children,
  className: languageClassName,
  live,
  metastring,
  ...props
}) => {
  const {
    siteConfig: {
      themeConfig: {prism = {}},
    },
  } = useDocusaurusContext();

  const [showCopied, setShowCopied] = useState(false);
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

  const target = useRef(null);
  const button = useRef(null);
  let highlightLines = [];
  let codeBlockTitle = '';

  const {isDarkTheme} = useThemeContext();
  const lightModeTheme = prism.theme || defaultTheme;
  const darkModeTheme = prism.darkTheme || lightModeTheme;
  const prismTheme = isDarkTheme ? darkModeTheme : lightModeTheme;

  if (metastring && highlightLinesRangeRegex.test(metastring)) {
    const highlightLinesRange = metastring.match(highlightLinesRangeRegex)[1];
    highlightLines = rangeParser.parse(highlightLinesRange).filter(n => n > 0);
  }

  if (metastring && codeBlockTitleRegex.test(metastring)) {
    codeBlockTitle = metastring
      .match(codeBlockTitleRegex)[0]
      .split('title=')[1]
      .replace(/"+/g, '');
  }

  useEffect(() => {
    let clipboard;

    if (button.current) {
      clipboard = new Clipboard(button.current, {
        target: () => target.current,
      });
    }

    return () => {
      if (clipboard) {
        clipboard.destroy();
      }
    };
  }, [button.current, target.current]);

  if (live) {
    return (
      <Playground
        key={mounted}
        scope={{...React}}
        code={children.replace(/\n$/, '')}
        theme={prismTheme}
        {...props}
      />
    );
  }

  let language =
    languageClassName && languageClassName.replace(/language-/, '');

  if (!language && prism.defaultLanguage) {
    language = prism.defaultLanguage;
  }

  const handleCopyCode = () => {
    window.getSelection().empty();
    setShowCopied(true);

    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <Highlight
      {...defaultProps}
      key={mounted}
      theme={prismTheme}
      code={children.replace(/\n$/, '')}
      language={language}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <>
          {codeBlockTitle && (
            <div style={style} className={styles.codeBlockTitle}>
              {codeBlockTitle}
            </div>
          )}
          <div className={styles.codeBlockContent}>
            <button
              ref={button}
              type="button"
              aria-label="Copy code to clipboard"
              className={classnames(styles.copyButton, {
                [styles.copyButtonWithTitle]: codeBlockTitle,
              })}
              onClick={handleCopyCode}>
              {showCopied ? 'Copied' : 'Copy'}
            </button>
            <pre
              className={classnames(className, styles.codeBlock, {
                [styles.codeBlockWithTitle]: codeBlockTitle,
              })}>
              <div ref={target} className={styles.codeBlockLines} style={style}>
                {tokens.map((line, i) => {
                  if (line.length === 1 && line[0].content === '') {
                    line[0].content = '\n'; // eslint-disable-line no-param-reassign
                  }

                  const lineProps = getLineProps({line, key: i});

                  if (highlightLines.includes(i + 1)) {
                    lineProps.className = `${lineProps.className} docusaurus-highlight-code-line`;
                  }

                  return (
                    <div key={i} {...lineProps}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({token, key})} />
                      ))}
                    </div>
                  );
                })}
              </div>
            </pre>
          </div>
        </>
      )}
    </Highlight>
  );
};
