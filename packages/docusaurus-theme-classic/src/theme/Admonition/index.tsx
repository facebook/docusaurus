/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {processAdmonitionProps} from '@docusaurus/theme-common';
import Translate from '@docusaurus/Translate';
import type {Props} from '@theme/Admonition';
import AdmonitionLayout from '@theme/Admonition/Layout';
import IconNote from '@theme/Admonition/Icon/Note';
import IconTip from '@theme/Admonition/Icon/Tip';
import IconInfo from '@theme/Admonition/Icon/Info';
import IconCaution from '@theme/Admonition/Icon/Caution';
import IconDanger from '@theme/Admonition/Icon/Danger';

function getInfimaClassName(suffix: string) {
  return `alert alert--${suffix}`;
}

type AdmonitionConfig = {
  className: string;
  iconComponent: React.ComponentType;
  label: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
const AdmonitionConfigs: Record<Props['type'], AdmonitionConfig> = {
  note: {
    className: getInfimaClassName('secondary'),
    iconComponent: IconNote,
    label: (
      <Translate
        id="theme.admonition.note"
        description="The default label used for the Note admonition (:::note)">
        note
      </Translate>
    ),
  },
  tip: {
    className: getInfimaClassName('success'),
    iconComponent: IconTip,
    label: (
      <Translate
        id="theme.admonition.tip"
        description="The default label used for the Tip admonition (:::tip)">
        tip
      </Translate>
    ),
  },
  danger: {
    className: getInfimaClassName('danger'),
    iconComponent: IconDanger,
    label: (
      <Translate
        id="theme.admonition.danger"
        description="The default label used for the Danger admonition (:::danger)">
        danger
      </Translate>
    ),
  },
  info: {
    className: getInfimaClassName('info'),
    iconComponent: IconInfo,
    label: (
      <Translate
        id="theme.admonition.info"
        description="The default label used for the Info admonition (:::info)">
        info
      </Translate>
    ),
  },
  caution: {
    className: getInfimaClassName('warning'),
    iconComponent: IconCaution,
    label: (
      <Translate
        id="theme.admonition.caution"
        description="The default label used for the Caution admonition (:::caution)">
        caution
      </Translate>
    ),
  },
};

// Legacy aliases, undocumented but kept for retro-compatibility
const aliases = {
  secondary: 'note',
  important: 'info',
  success: 'tip',
  // TODO warning => danger: weird unconventional mapping...
  // breaking change required, in another PR
  warning: 'danger',
} as const;

function getAdmonitionConfig(unsafeType: string): AdmonitionConfig {
  const type =
    (aliases as {[key: string]: Props['type']})[unsafeType] ?? unsafeType;
  const config = (AdmonitionConfigs as {[key: string]: AdmonitionConfig})[type];
  if (config) {
    return config;
  }
  console.warn(
    `No admonition config found for admonition type "${type}". Using Info as fallback.`,
  );
  return AdmonitionConfigs.info;
}

export default function Admonition(unprocessedProps: Props): JSX.Element {
  const props = processAdmonitionProps(unprocessedProps);
  const admonitionConfig = getAdmonitionConfig(props.type);
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
