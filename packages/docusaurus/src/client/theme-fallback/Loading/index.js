/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

export default props => {
  if (props.error) {
    console.warn(props.error);
    return <div align="center">Error</div>;
  }

  if (props.pastDelay) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}>
        <svg
          id="loader"
          style={{
            width: 128,
            height: 110,
            position: 'absolute',
            top: 'calc(100vh - 64%)',
          }}
          viewBox="0 0 45 45"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#61dafb">
          <g
            fill="none"
            fillRule="evenodd"
            transform="translate(1 1)"
            strokeWidth="2">
            <circle cx="22" cy="22" r="6" strokeOpacity="0">
              <animate
                attributeName="r"
                begin="1.5s"
                dur="3s"
                values="6;22"
                calcMode="linear"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                begin="1.5s"
                dur="3s"
                values="1;0"
                calcMode="linear"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-width"
                begin="1.5s"
                dur="3s"
                values="2;0"
                calcMode="linear"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="22" cy="22" r="6" strokeOpacity="0">
              <animate
                attributeName="r"
                begin="3s"
                dur="3s"
                values="6;22"
                calcMode="linear"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                begin="3s"
                dur="3s"
                values="1;0"
                calcMode="linear"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-width"
                begin="3s"
                dur="3s"
                values="2;0"
                calcMode="linear"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="22" cy="22" r="8">
              <animate
                attributeName="r"
                begin="0s"
                dur="1.5s"
                values="6;1;2;3;4;5;6"
                calcMode="linear"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>
      </div>
    );
  }

  return null;
};
