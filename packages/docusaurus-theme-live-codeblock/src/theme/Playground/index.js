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

// see https://icons.getbootstrap.com/icons/code-square/
function IconCodeSquare(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className={clsx('bi', 'bi-code-slash', styles.playgroundIconCodeSquare)}
      viewBox="0 0 16 16"
      {...props}>
      <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" />
    </svg>
  );
}

// 匹配对应的头部注释信息
function getHeaderNotesTxtToJSONObject(codeInfo) {
  const rules = /\/\*\*[\s\S.]+?\*\//g;
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
    console.log(headerNotesTxt);
    code = code.replace(headerNotesTxt, '');
  }
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
  } = getHeaderNotesTxtToJSONObject(children.replace(/\n$/, ''));
  const [isShowCode, setShowCode] = React.useState(false);
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
        {isShowCode ? <LiveEditor /> : undefined}
      </div>
    </LiveProvider>
  );
}
