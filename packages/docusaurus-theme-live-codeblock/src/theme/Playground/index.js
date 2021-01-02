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

const typescriptExtensions = ['ts', 'tsx'];
const transformJs = (code) => `${code};`;

function Playground({children, theme, className, scope}) {
  const [tsTranspileError, setTsTranspileError] = React.useState(null);
  const transformTs = React.useCallback((code) => {
    try {
      // eslint-disable-next-line global-require
      const {code: transformed} = require('@babel/standalone').transform(code, {
        filename: 'transformedCode.ts',
        presets: [
          'react',
          [
            'typescript',
            {
              isTSX: true,
              allExtensions: true,
            },
          ],
        ],
      });
      setTsTranspileError(null);

      return transformed;
    } catch (e) {
      setTsTranspileError(e.message);
    }

    return '() => null;';
  }, []);

  const isTypescriptCode = React.useMemo(
    () =>
      typescriptExtensions.some((extension) => className.endsWith(extension)),
    [className],
  );

  const transformCode = React.useMemo(() => {
    return isTypescriptCode ? transformTs : transformJs;
  }, [isTypescriptCode, transformTs]);

  return (
    <LiveProvider
      scope={scope}
      code={children.replace(/\n$/, '')}
      transformCode={transformCode}
      theme={theme}
      language={isTypescriptCode ? 'typescript' : 'javascript'}
      className={className}>
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
        {tsTranspileError ? <pre>{tsTranspileError}</pre> : <LiveError />}
      </div>
    </LiveProvider>
  );
}

export default Playground;
