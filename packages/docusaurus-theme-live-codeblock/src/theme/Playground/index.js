/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

export default function Playground({children, theme, transformCode, ...props}) {
  const {
    siteConfig: {
      themeConfig: {liveCodeblock: {showResultBeforeEditor} = {}},
    } = {},
  } = useDocusaurusContext();

  return (
    <LiveProvider
      code={children.replace(/\n$/, '')}
      transformCode={transformCode || ((code) => `${code};`)}
      theme={theme}
      {...props}>
      {showResultBeforeEditor ? (
        <>
          <ResultWithHeader />
          <EditorWithHeader />
        </>
      ) : (
        <>
          <EditorWithHeader />
          <ResultWithHeader />
        </>
      )}
    </LiveProvider>
  );
}

function ResultWithHeader() {
  return (
    <>
      <Header
        translateId="theme.Playground.result"
        description="The result label of the live codeblocks"
        text="Result"
      />
      <div className={styles.playgroundPreview}>
        <LivePreview />
        <LiveError />
      </div>
    </>
  );
}

function EditorWithHeader() {
  return (
    <>
      <Header
        translateId="theme.Playground.liveEditor"
        description="The live editor label of the live codeblocks"
        text="Live Editor"
      />
      <LiveEditor className={styles.playgroundEditor} />
    </>
  );
}

function Header({translateId, description, text}) {
  return (
    <div className={clsx(styles.playgroundHeader)}>
      <Translate id={translateId} description={description}>
        {text}
      </Translate>
    </div>
  );
}
