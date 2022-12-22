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
import IconAutoThemeMode from '@theme/Icon/AutoThemeMode';
import type {Props} from '@theme/ColorModeToggle';
import type {ColorModeChoice} from '@docusaurus/theme-common';

import styles from './styles.module.css';

function ColorModeToggle({
  className,
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
        auto: () =>
          translate({
            message: 'auto mode',
            id: 'theme.colorToggle.ariaLabel.mode.auto',
            description: 'The name for the auto color mode',
          }),
      }[choice ?? 'auto'](),
    },
  );

  // cycle through dark/light/auto, as follows:
  //
  // (prefers-color-scheme: dark)
  //   ? [auto, light, dark]
  //   : [auto, dark, light]
  const nextTheme = (): ColorModeChoice => {
    // auto -> opposite
    if (choice === 'auto') {
      return value === 'dark' ? 'light' : 'dark';
    }

    // same as `prefers-color-scheme` -> auto
    if (window.matchMedia(`(prefers-color-scheme: ${choice})`).matches) {
      return 'auto';
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
        )}
        type="button"
        onClick={() => onChange(nextTheme())}
        disabled={!isBrowser}
        title={title}
        aria-label={title}
        aria-live="polite">
        <IconLightMode
          className={clsx(styles.toggleIcon, styles.lightToggleIcon)}
        />
        <IconDarkMode
          className={clsx(styles.toggleIcon, styles.darkToggleIcon)}
        />
        <IconAutoThemeMode
          className={clsx(styles.toggleIcon, styles.autoToggleIcon)}
        />
      </button>
    </div>
  );
}

export default React.memo(ColorModeToggle);
