/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {processAdmonitionProps} from '@docusaurus/theme-common';
import type {Props} from '@theme/Admonition';
import AdmonitionLayout from '@theme/Admonition/Layout';
import AdmonitionTypes, {
  type AdmonitionTypeConfig,
} from '@theme/Admonition/Types';

function getAdmonitionType(type: string): AdmonitionTypeConfig {
  const config = AdmonitionTypes[type];
  if (config) {
    return config;
  }
  console.warn(
    `No admonition config found for admonition type "${type}". Using Info as fallback.`,
  );
  return AdmonitionTypes.info!;
}

export default function Admonition(unprocessedProps: Props): JSX.Element {
  const props = processAdmonitionProps(unprocessedProps);
  const admonitionConfig = getAdmonitionType(props.type);
  const {iconComponent: IconComponent} = admonitionConfig;
  return (
    <AdmonitionLayout
      type={props.type}
      icon={props.icon ?? <IconComponent />}
      title={props.title ?? admonitionConfig.label}
      className={clsx(admonitionConfig.className, props.className)}>
      {props.children}
    </AdmonitionLayout>
  );
}
