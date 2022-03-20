/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {Props} from '@theme/TextHighlight';

import styles from './styles.module.css';

function TextHighlight({text, highlight}: Props): JSX.Element {
  if (!highlight) {
    return <>{text}</>;
  }

  const highlightedText = text.replace(
    new RegExp(highlight, 'gi'),
    (match) => `<mark>${match}</mark>`,
  );

  return (
    <span
      className={styles.highlightText}
      dangerouslySetInnerHTML={{__html: highlightedText}}
    />
  );
}

export default TextHighlight;
