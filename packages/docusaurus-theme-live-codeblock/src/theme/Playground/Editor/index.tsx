/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import {LiveEditor} from 'react-live';
import useIsBrowser from '@docusaurus/useIsBrowser';
import Translate from '@docusaurus/Translate';
import PlaygroundHeader from '@theme/Playground/Header';
import ResetButton from '@theme/Playground/Buttons/ResetButton';
import {usePlaygroundReset} from '@theme/Playground/Provider';
import styles from './styles.module.css';

export default function PlaygroundEditor(): ReactNode {
  const isBrowser = useIsBrowser();
  const {reset} = usePlaygroundReset();

  return (
    <>
      <PlaygroundHeader
        label={
          <Translate
            id="theme.Playground.liveEditor"
            description="The live editor label of the live codeblocks">
            Live Editor
          </Translate>
        }
        buttons={<ResetButton onClick={reset} />}
      />
      <LiveEditor key={String(isBrowser)} className={styles.playgroundEditor} />
    </>
  );
}
