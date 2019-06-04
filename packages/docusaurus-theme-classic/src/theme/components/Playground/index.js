/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';

function Playground({children, theme, transformCode, ...props}) {
  return (
    <LiveProvider
      code={children}
      transformCode={transformCode || (code => `${code};`)}
      theme={theme}
      {...props}>
      <div
        style={{
          borderRadius: 4,
        }}>
        <div
          style={{
            padding: '4px 8px',
            background: '#1a2d3c',
          }}>
          <div
            style={{
              textTransform: 'uppercase',
              color: '#e1e6ef',
              fontSize: 11,
              fontWeight: 'bold',
              opacity: 0.4,
            }}>
            LIVE EDITOR
          </div>
        </div>
        <LiveEditor style={{padding: 0, border: 0, outline: 0}} />
        <div
          style={{
            padding: '0 8px',
            background: '#1a2d3c',
            height: 35,
            lineHeight: '34px',
          }}>
          <div
            style={{
              textTransform: 'uppercase',
              color: '#e1e6ef',
              fontSize: 11,
              fontWeight: 'bold',
              opacity: 0.4,
            }}>
            Result
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            padding: 16,
            border: '0.5px solid #011627',
          }}>
          <LivePreview />
          <LiveError />
        </div>
      </div>
    </LiveProvider>
  );
}

export default Playground;
