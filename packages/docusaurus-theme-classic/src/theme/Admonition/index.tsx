/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {
  ThemeClassNames,
  processAdmonitionProps,
} from '@docusaurus/theme-common';
import Translate from '@docusaurus/Translate';
import type {Props} from '@theme/Admonition';
import IconNote from '@theme/Admonition/Icon/Note';
import IconTip from '@theme/Admonition/Icon/Tip';
import IconInfo from '@theme/Admonition/Icon/Info';
import IconCaution from '@theme/Admonition/Icon/Caution';
import IconDanger from '@theme/Admonition/Icon/Danger';

import styles from './styles.module.css';

type AdmonitionConfig = {
  iconComponent: React.ComponentType;
  infimaClassName: string;
  label: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
const AdmonitionConfigs: Record<Props['type'], AdmonitionConfig> = {
  note: {
    infimaClassName: 'secondary',
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
    infimaClassName: 'success',
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
    infimaClassName: 'danger',
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
    infimaClassName: 'info',
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
    infimaClassName: 'warning',
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

export default function Admonition(props: Props): JSX.Element {
  const {children, type, title, icon: iconProp} = processAdmonitionProps(props);

  const typeConfig = getAdmonitionConfig(type);
  const titleLabel = title ?? typeConfig.label;
  const {iconComponent: IconComponent} = typeConfig;
  const icon = iconProp ?? <IconComponent />;
  return (
    <div
      className={clsx(
        ThemeClassNames.common.admonition,
        ThemeClassNames.common.admonitionType(props.type),
        'alert',
        `alert--${typeConfig.infimaClassName}`,
        styles.admonition,
      )}>
      <div className={styles.admonitionHeading}>
        <span className={styles.admonitionIcon}>{icon}</span>
        {titleLabel}
      </div>
      <div className={styles.admonitionContent}>{children}</div>
    </div>
  );
}
