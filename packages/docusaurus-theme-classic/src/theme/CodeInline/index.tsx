/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {usePrismTheme, useThemeConfig} from '@docusaurus/theme-common';
import Highlight, {defaultProps, type Language} from 'prism-react-renderer';
import type {Props} from '@theme/CodeInline';

export default function CodeInline({
  language: languageProp,
  className = '',
  children,
}: Props): JSX.Element {
  const {
    prism: {defaultLanguage},
  } = useThemeConfig();
  const language = languageProp ?? defaultLanguage ?? 'text';
  const prismTheme = usePrismTheme();

  if (!children || typeof children !== 'string') {
    return <code className={className}>{children}</code>;
  }

  return (
    <Highlight
      {...defaultProps}
      theme={prismTheme}
      code={children}
      language={language as Language}>
      {({
        className: highlightClassName,
        tokens,
        getLineProps,
        getTokenProps,
      }) => {
        if (tokens.length !== 1) {
          // This is actually multi-line (or empty) code.
          // Multi-line _should_ never happen.
          // Just return the code without highlighting I guess?
          return children;
        }
        return (
          <code
            {...getLineProps({
              line: tokens[0]!,
              className: clsx(
                className,
                `language-${language}`,
                highlightClassName,
              ),
            })}>
            {tokens[0]!.map((token, key) => (
              <span key={key} {...getTokenProps({token})} />
            ))}
          </code>
        );
      }}
    </Highlight>
  );
}
