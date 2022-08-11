/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Translate from '@docusaurus/Translate';
import type {Props} from '@theme/Admonition';
import IconNote from '@theme/Admonition/Icon/Note';
import IconTip from '@theme/Admonition/Icon/Tip';
import IconInfo from '@theme/Admonition/Icon/Info';
import IconCaution from '@theme/Admonition/Icon/Caution';
import IconDanger from '@theme/Admonition/Icon/Danger';
import type {AdmonitionTypeConfig} from '@theme/Admonition/Types';

function getInfimaClassName(suffix: string) {
  return `alert alert--${suffix}`;
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
const admonitionTypes: Record<Props['type'], AdmonitionTypeConfig> = {
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

function createLegacyAlias(
  alias: string,
  config: AdmonitionTypeConfig,
): AdmonitionTypeConfig {
  return {
    ...config,
    // An alias "important" should display "Important", not "Info"
    // Not translated on purpose: legacy, to remove later
    label: alias,
  };
}

// Legacy admonition type aliases, undocumented but kept for retro-compatibility
const aliases: {[key: string]: AdmonitionTypeConfig} = {
  secondary: createLegacyAlias('secondary', admonitionTypes.note),
  important: createLegacyAlias('important', admonitionTypes.info),
  success: createLegacyAlias('success', admonitionTypes.tip),
  // TODO bad legacy mapping, warning is usually yellow, not red...
  warning: createLegacyAlias('warning', admonitionTypes.danger),
} as const;

export default {
  ...admonitionTypes,
  ...aliases,
};
