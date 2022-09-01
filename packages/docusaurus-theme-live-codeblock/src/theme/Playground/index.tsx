/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {usePrismTheme} from '@docusaurus/theme-common';
import ErrorBoundary from '@docusaurus/ErrorBoundary';

import type {Props} from '@theme/Playground';
import type {Props as ErrorProps} from '@theme/Error';
import type {ThemeConfig} from '@docusaurus/theme-live-codeblock';

import styles from './styles.module.css';

function Header({children}: {children: React.ReactNode}) {
  return <div className={clsx(styles.playgroundHeader)}>{children}</div>;
}

function LivePreviewLoader() {
  // Is it worth improving/translating?
  // eslint-disable-next-line @docusaurus/no-untranslated-text
  return <div>Loading...</div>;
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
        <BrowserOnly fallback={<LivePreviewLoader />}>
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

function ThemedLiveEditor() {
  const isBrowser = useIsBrowser();
  return (
    <LiveEditor
      // We force remount the editor on hydration,
      // otherwise dark prism theme is not applied
      key={String(isBrowser)}
      className={styles.playgroundEditor}
    />
  );
}

function EditorWithHeader() {
  return (
    <>
      <Header>
        <Translate
          id="theme.Playground.liveEditor"
          description="The live editor label of the live codeblocks">
          Live Editor
        </Translate>
      </Header>
      <ThemedLiveEditor />
    </>
  );
}

function ErrorFallbackWithHeader({error, tryAgain}: ErrorProps): JSX.Element {
  return (
    <>
      <Header>
        <Translate
          id="theme.Playground.result"
          description="The result label of the live codeblocks">
          Result
        </Translate>
      </Header>
      <div className={styles.playgroundPreview}>
        <p>{error.message}</p>
        <button type="button" onClick={tryAgain}>
          <Translate
            id="theme.ErrorPageContent.tryAgain"
            description="The try again label of the error fallback">
            Try Again!
          </Translate>
        </button>
      </div>
    </>
  );
}

export default function Playground({
  children,
  transformCode,
  ...props
}: Props): JSX.Element {
  const {
    siteConfig: {themeConfig},
  } = useDocusaurusContext();
  const {
    liveCodeBlock: {playgroundPosition},
  } = themeConfig as ThemeConfig;
  const prismTheme = usePrismTheme();

  const noInline = props.metastring?.includes('noInline') ?? false;

  return (
    <div className={styles.playgroundContainer}>
      {/* @ts-expect-error: type incompatibility with refs */}
      <LiveProvider
        code={children.replace(/\n$/, '')}
        noInline={noInline}
        transformCode={transformCode ?? ((code) => `${code};`)}
        theme={prismTheme}
        {...props}>
        {playgroundPosition === 'top' ? (
          <>
            <ErrorBoundary fallback={ErrorFallbackWithHeader}>
              <ResultWithHeader />
            </ErrorBoundary>
            <EditorWithHeader />
          </>
        ) : (
          <>
            <EditorWithHeader />
            <ErrorBoundary fallback={ErrorFallbackWithHeader}>
              <ResultWithHeader />
            </ErrorBoundary>
          </>
        )}
      </LiveProvider>
    </div>
  );
}
