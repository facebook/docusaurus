/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';
import clsx from 'clsx';
// import Translate from '@docusaurus/Translate';

import styles from './styles.module.css';

function IconCodeSquare(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className={clsx(styles.playgroundIconCodeSquare)}
      viewBox="64 64 896 896"
      {...props}>
      <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" />
    </svg>
  );
}

// 匹配对应的头部注释信息
function getHeaderNotesTxtToJSONObject(codeInfo) {
  const rules = /\/\*\*[\s\S.]+?\*\/\s*/g;
  const responJSON = {};
  const headerNotesTxt = rules.exec(codeInfo)?.[0];
  let code = codeInfo;
  let isHaveHeaderNotesTxt = false;
  if (headerNotesTxt) {
    headerNotesTxt.split(/\n/).forEach((line) => {
      const key = /\s*\*\s*[a-zA-z0-9]+\s*:/.exec(line)?.[0];
      if (key) {
        const value = line.substr(key.length);
        if (key) {
          isHaveHeaderNotesTxt = true;
          const trimKey = key.trim();
          responJSON[
            trimKey.substr(1, trimKey.length - 2).trim()
          ] = value.trim();
        }
      }
    });
  }
  if (isHaveHeaderNotesTxt) {
    code = code.substr(headerNotesTxt.length);
  }
  code = code.replace(/\n$/, '').trim();
  return {
    code,
    isHaveHeaderNotesTxt,
    params: responJSON,
  };
}

export default function Playground({children, theme, transformCode, ...props}) {
  const {
    params,
    isHaveHeaderNotesTxt,
    code: sourceCode,
  } = getHeaderNotesTxtToJSONObject(children);
  const [isShowCode, setShowCode] = React.useState(props.expand || false);
  return (
    <LiveProvider
      code={sourceCode}
      transformCode={transformCode || ((code) => `${code};`)}
      theme={theme}
      {...props}>
      <div className={styles.playgroundContainer}>
        <div className={clsx(styles.playgroundLivePreview)}>
          <LivePreview />
          <LiveError />
        </div>
        {isHaveHeaderNotesTxt ? (
          <div className={clsx(styles.playgroundMate)}>
            <span>{params.title}</span>
            <div>{params.desc}</div>
          </div>
        ) : undefined}
        <div className={clsx(styles.playgroundToolbar)}>
          <IconCodeSquare
            onClick={() => {
              setShowCode(!isShowCode);
            }}
          />
        </div>
        {isShowCode ? (
          <LiveEditor className={styles.playgroundEditor} />
        ) : undefined}
      </div>
    </LiveProvider>
  );
}
