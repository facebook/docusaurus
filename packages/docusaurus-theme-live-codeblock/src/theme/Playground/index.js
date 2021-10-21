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
import BrowserOnly from '@docusaurus/BrowserOnly';
import usePrismTheme from '@theme/hooks/usePrismTheme';
import CodeBlock from '@theme-init/CodeBlock';
import styles from './styles.module.css';

function Header({children}) {
  return <div className={clsx(styles.playgroundHeader)}>{children}</div>;
}

function ResultWithHeader() {
  return (
    <>
      <Header>
        <Translate
          id="theme.Playground.result"
          description="The result label of the live codeblocks">
          Result
        </Translate>
      </Header>
      {/* https://github.com/facebook/docusaurus/issues/5747 */}
      <div className={styles.playgroundPreview}>
        <BrowserOnly fallback={<div>Loading...</div>}>
          {() => (
            <>
              <LivePreview />
              <LiveError />
            </>
          )}
        </BrowserOnly>
      </div>
    </>
  );
}

function EditorWithHeader({code}) {
  return (
    <>
      <Header>
        <Translate
          id="theme.Playground.liveEditor"
          description="The live editor label of the live codeblocks">
          Live Editor
        </Translate>
      </Header>
      <BrowserOnly
        fallback={<CodeBlock className="language-jsx">{code}</CodeBlock>}>
        {() => <LiveEditor className={styles.playgroundEditor} />}
      </BrowserOnly>
    </>
  );
}

export default function Playground({children, transformCode, ...props}) {
  const {
    siteConfig: {
      themeConfig: {
        liveCodeBlock: {playgroundPosition},
      },
    },
  } = useDocusaurusContext();
  const prismTheme = usePrismTheme();

  return (
    <div className={styles.playgroundContainer}>
      <LiveProvider
        code={children.replace(/\n$/, '')}
        transformCode={transformCode || ((code) => `${code};`)}
        theme={prismTheme}
        {...props}>
        {playgroundPosition === 'top' ? (
          <>
            <ResultWithHeader />
            <EditorWithHeader code={children} />
          </>
        ) : (
          <>
            <EditorWithHeader code={children} />
            <ResultWithHeader />
          </>
        )}
      </LiveProvider>
    </div>
  );
}
