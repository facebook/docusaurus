/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Color from 'color';
import {createStorageSlot} from '@docusaurus/theme-common';

// These values are shared between the Toggle component and the ColorGenerator

/**
 * Stored in session storage
 */
export type ColorState = {
  baseColor: string;
  background: string;
  shades: Shades;
};

export type Shades = Record<
  string,
  {
    adjustment: number;
    adjustmentInput: string;
    displayOrder: number;
    codeOrder: number;
  }
>;
export const COLOR_SHADES: Shades = {
  '--ifm-color-primary': {
    adjustment: 0,
    adjustmentInput: '0',
    displayOrder: 3,
    codeOrder: 0,
  },
  '--ifm-color-primary-dark': {
    adjustment: 0.1,
    adjustmentInput: '10',
    displayOrder: 4,
    codeOrder: 1,
  },
  '--ifm-color-primary-darker': {
    adjustment: 0.15,
    adjustmentInput: '15',
    displayOrder: 5,
    codeOrder: 2,
  },
  '--ifm-color-primary-darkest': {
    adjustment: 0.3,
    adjustmentInput: '30',
    displayOrder: 6,
    codeOrder: 3,
  },
  '--ifm-color-primary-light': {
    adjustment: -0.1,
    adjustmentInput: '-10',
    displayOrder: 2,
    codeOrder: 4,
  },
  '--ifm-color-primary-lighter': {
    adjustment: -0.15,
    adjustmentInput: '-15',
    displayOrder: 1,
    codeOrder: 5,
  },
  '--ifm-color-primary-lightest': {
    adjustment: -0.3,
    adjustmentInput: '-30',
    displayOrder: 0,
    codeOrder: 6,
  },
};

export const LIGHT_PRIMARY_COLOR = '#2e8555';
export const DARK_PRIMARY_COLOR = '#25c2a0';
export const LIGHT_BACKGROUND_COLOR = '#ffffff';
export const DARK_BACKGROUND_COLOR = '#181920';

// sessionStorage allows resetting everything next time users visit the site
export const lightStorage = createStorageSlot('ifm-theme-colors-light', {
  persistence: 'sessionStorage',
});
export const darkStorage = createStorageSlot('ifm-theme-colors-dark', {
  persistence: 'sessionStorage',
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getAdjustedColors(shades: Shades, baseColor: string) {
  return Object.keys(shades).map((shade) => ({
    ...shades[shade],
    variableName: shade,
    hex: Color(baseColor).darken(shades[shade].adjustment).hex(),
  }));
}

export function updateDOMColors({
  shades,
  baseColor,
  background,
}: ColorState): void {
  const root = document.documentElement;
  getAdjustedColors(shades, baseColor).forEach((value) => {
    root.style.setProperty(value.variableName, value.hex);
  });
  root.style.setProperty('--ifm-background-color', background);
}
