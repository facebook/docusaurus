/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Highlight, {defaultProps} from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/nightOwl';

export default ({children, className}) => {
  const language = className && className.replace(/language-/, '');

  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={children}
      language={language}>
      {({style, tokens, getLineProps, getTokenProps}) => (
        <pre style={{...style, padding: '20px', display: 'inline-flex'}}>
          {tokens.map((line, i) => (
            <code
              key={i}
              {...getLineProps({line, key: i})}
              className={className}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({token, key})} />
              ))}
            </code>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
