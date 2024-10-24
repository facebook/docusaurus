/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {translate} from '@docusaurus/Translate';
import IconLightMode from '@theme/Icon/LightMode';
import IconDarkMode from '@theme/Icon/DarkMode';
import type {Props} from '@theme/ColorModeToggle';

import IconSystemMode from '@theme/Icon/SystemMode';
import type {ColorModeChoice} from '@docusaurus/theme-common';
import styles from './styles.module.css';

function ColorModeToggle({
  className,
  buttonClassName,
  value,
  choice,
  onChange,
}: Props): JSX.Element {
  const isBrowser = useIsBrowser();

  const title = translate(
    {
      message: 'Switch between dark and light mode (currently {mode})',
      id: 'theme.colorToggle.ariaLabel',
      description: 'The ARIA label for the navbar color mode toggle',
    },
    {
      mode: {
        dark: () =>
          translate({
            message: 'dark mode',
            id: 'theme.colorToggle.ariaLabel.mode.dark',
            description: 'The name for the dark color mode',
          }),
        light: () =>
          translate({
            message: 'light mode',
            id: 'theme.colorToggle.ariaLabel.mode.light',
            description: 'The name for the light color mode',
          }),
        system: () =>
          translate({
            message: 'system mode',
            id: 'theme.colorToggle.ariaLabel.mode.system',
            description: 'The name for the system color mode',
          }),
      }[choice ?? 'system'](),
    },
  );

  // cycle through dark/light/system, as follows:
  //
  // (prefers-color-scheme: dark)
  //   ? [system, light, dark]
  //   : [system, dark, light]
  const nextTheme = (): ColorModeChoice => {
    // system -> opposite
    if (choice === 'system') {
      return value === 'dark' ? 'light' : 'dark';
    }

    // same as `prefers-color-scheme` -> system
    if (window.matchMedia(`(prefers-color-scheme: ${choice})`).matches) {
      return 'system';
    }

    // dark/light -> opposite
    return choice === 'dark' ? 'light' : 'dark';
  };

  return (
    <div className={clsx(styles.toggle, className)}>
      <button
        className={clsx(
          'clean-btn',
          styles.toggleButton,
          !isBrowser && styles.toggleButtonDisabled,
          buttonClassName,
        )}
        type="button"
        onClick={() => onChange(nextTheme())}
        disabled={!isBrowser}
        title={title}
        aria-label={title}
        aria-live="polite"
        aria-pressed={value === 'dark' ? 'true' : 'false'}>
        <IconLightMode
          className={clsx(styles.toggleIcon, styles.lightToggleIcon)}
        />
        <IconDarkMode
          className={clsx(styles.toggleIcon, styles.darkToggleIcon)}
        />
        <IconSystemMode
          className={clsx(styles.toggleIcon, styles.systemToggleIcon)}
        />
      </button>
    </div>
  );
}

export default React.memo(ColorModeToggle);
