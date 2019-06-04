/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import Highlight, {defaultProps} from 'prism-react-renderer';
import nightOwlTheme from 'prism-react-renderer/themes/nightOwl';

import Loading from '@theme/Loading';

/* Live playground is not small in size, lazy load it is better */
const Playground = LoadableVisibility({
  loader: () => import('@theme/components/Playground'),
  loading: Loading,
});

export default ({children, className: languageClassName, live, ...props}) => {
  if (live) {
    return (
      <Playground
        scope={{...React}}
        code={children}
        theme={nightOwlTheme}
        {...props}
      />
    );
  }
  const language =
    languageClassName && languageClassName.replace(/language-/, '');
  return (
    <Highlight
      {...defaultProps}
      theme={nightOwlTheme}
      code={children}
      language={language}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <pre
          className={className}
          style={{
            ...style,
            overflow: 'hidden',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            fontSize: 'inherit',
          }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({line, key: i})}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({token, key})} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
