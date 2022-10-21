/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {
  MermaidContainerClassName,
  useMermaidSvg,
} from '@docusaurus/theme-mermaid/client';

import type {Props} from '@theme/Mermaid';

import styles from './styles.module.css';

function MermaidDiagram({value}: Props): JSX.Element {
  const svg = useMermaidSvg(value);
  return (
    <div
      className={`${MermaidContainerClassName} ${styles.container}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: svg}}
    />
  );
}

export default function Mermaid(props: Props): JSX.Element {
  return <BrowserOnly>{() => <MermaidDiagram {...props} />}</BrowserOnly>;
}
