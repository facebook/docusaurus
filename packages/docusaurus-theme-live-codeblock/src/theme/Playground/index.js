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

import styles from './styles.module.css';

export default function Playground({children, theme, transformCode, ...props}) {
  return (
    <LiveProvider
      code={children.replace(/\n$/, '')}
      transformCode={transformCode || ((code) => `${code};`)}
      theme={theme}
      {...props}>
      <div
        className={clsx(
          styles.playgroundHeader,
          styles.playgroundEditorHeader,
        )}>
        <Translate
          id="theme.Playground.liveEditor"
          description="The live editor label of the live codeblocks">
          Live Editor
        </Translate>
      </div>
      <LiveEditor className={styles.playgroundEditor} />
      <div
        className={clsx(
          styles.playgroundHeader,
          styles.playgroundPreviewHeader,
        )}>
        <Translate
          id="theme.Playground.result"
          description="The result label of the live codeblocks">
          Result
        </Translate>
      </div>
      <div className={styles.playgroundPreview}>
        <LivePreview />
        <LiveError />
      </div>
    </LiveProvider>
  );
}
