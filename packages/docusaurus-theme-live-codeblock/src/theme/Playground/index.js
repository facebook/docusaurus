/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';
import clsx from 'clsx';

import styles from './styles.module.css';

function Playground({children, theme, transformCode, ...props}) {
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
        Live Editor
      </div>
      <LiveEditor className={styles.playgroundEditor} />
      <div
        className={clsx(
          styles.playgroundHeader,
          styles.playgroundPreviewHeader,
        )}>
        Result
      </div>
      <div className={styles.playgroundPreview}>
        <LivePreview />
        <LiveError />
      </div>
    </LiveProvider>
  );
}

export default Playground;
