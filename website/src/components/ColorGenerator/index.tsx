/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import Color from 'color';
import CodeBlock from '@theme/CodeBlock';
import useThemeContext from '@theme/hooks/useThemeContext';
import {createStorageSlot} from '@docusaurus/theme-common';

import styles from './styles.module.css';

type Shades = Record<
  string,
  {
    adjustment: number;
    adjustmentInput: string;
    displayOrder: number;
    codeOrder: number;
  }
>;
const COLOR_SHADES: Shades = {
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

const LIGHT_PRIMARY_COLOR = '#18816a';
const DARK_PRIMARY_COLOR = '#25c2a0';
const LIGHT_BACKGROUND_COLOR = '#ffffff';
const DARK_BACKGROUND_COLOR = '#181920';

function wcagContrast(foreground: string, background: string) {
  const contrast = Color(foreground).contrast(Color(background));
  // eslint-disable-next-line no-nested-ternary
  return contrast > 7 ? 'AAA 🏅' : contrast > 4.5 ? 'AA 👍' : 'Fail 🔴';
}

type ColorState = {
  baseColor: string;
  background: string;
  shades: Shades;
};

const lightStorage = createStorageSlot('ifm-theme-colors-light');
const darkStorage = createStorageSlot('ifm-theme-colors-dark');

function getAdjustedColors(shades: Shades, baseColor: string) {
  return Object.keys(shades)
    .map((shade) => ({
      ...shades[shade],
      variableName: shade,
    }))
    .map((value) => ({
      ...value,
      hex: Color(baseColor).darken(value.adjustment).hex(),
    }));
}

function ColorGenerator(): JSX.Element {
  const {isDarkTheme, setDarkTheme, setLightTheme} = useThemeContext();
  const DEFAULT_PRIMARY_COLOR = isDarkTheme
    ? DARK_PRIMARY_COLOR
    : LIGHT_PRIMARY_COLOR;
  const DEFAULT_BACKGROUND_COLOR = isDarkTheme
    ? DARK_BACKGROUND_COLOR
    : LIGHT_BACKGROUND_COLOR;

  const [inputColor, setInputColor] = useState(DEFAULT_PRIMARY_COLOR);
  const [baseColor, setBaseColor] = useState(DEFAULT_PRIMARY_COLOR);
  const [background, setBackground] = useState(DEFAULT_BACKGROUND_COLOR);
  const [shades, setShades] = useState(COLOR_SHADES);
  const [storage, setStorage] = useState(
    isDarkTheme ? darkStorage : lightStorage,
  );

  useEffect(() => {
    if (darkStorage.get() === null) {
      darkStorage.set(
        JSON.stringify({
          baseColor: DARK_PRIMARY_COLOR,
          background: DARK_BACKGROUND_COLOR,
          shades: COLOR_SHADES,
        }),
      );
    }
    if (lightStorage.get() === null) {
      lightStorage.set(
        JSON.stringify({
          baseColor: LIGHT_PRIMARY_COLOR,
          background: LIGHT_BACKGROUND_COLOR,
          shades: COLOR_SHADES,
        }),
      );
    }
  }, []);

  useEffect(() => {
    setStorage(isDarkTheme ? darkStorage : lightStorage);
  }, [isDarkTheme]);

  useEffect(() => {
    const storedValues: ColorState = JSON.parse(storage.get() ?? '{}');
    setInputColor(storedValues.baseColor ?? DEFAULT_PRIMARY_COLOR);
    setBaseColor(storedValues.baseColor ?? DEFAULT_PRIMARY_COLOR);
    setBackground(storedValues.background ?? DEFAULT_BACKGROUND_COLOR);
    setShades(storedValues.shades ?? COLOR_SHADES);
  }, [storage, DEFAULT_BACKGROUND_COLOR, DEFAULT_PRIMARY_COLOR]);

  useEffect(() => {
    const root = document.documentElement;
    getAdjustedColors(shades, baseColor).forEach((value) => {
      root.style.setProperty(value.variableName, value.hex);
      root.style.setProperty('--ifm-background-color', background);
    });
    storage.set(JSON.stringify({baseColor, background, shades}));
  }, [baseColor, background, shades, storage]);

  function updateColor(event: React.ChangeEvent<HTMLInputElement>) {
    // Only prepend # when there isn't one.
    // e.g. ccc -> #ccc, #ccc -> #ccc, ##ccc -> ##ccc,
    const colorValue = event.target.value.replace(/^(?=[^#])/, '#');
    setInputColor(colorValue);

    try {
      setBaseColor(Color(colorValue).hex());
    } catch {
      // Don't update for invalid colors.
    }
  }

  return (
    <div>
      <p>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="primary_color">
          <strong className="margin-right--sm">Primary Color:</strong>
        </label>{' '}
        <input
          id="primary_color"
          type="text"
          className={clsx(styles.input, 'margin-right--sm')}
          value={inputColor}
          onChange={updateColor}
        />
        <input
          type="color"
          className={styles.colorInput}
          // value has to always be a valid color, so baseColor instead of inputColor
          value={baseColor}
          onChange={updateColor}
        />
        <button
          type="button"
          className="clean-btn button button--primary margin-left--md"
          onClick={() => {
            if (isDarkTheme) {
              setLightTheme();
            } else {
              setDarkTheme();
            }
          }}>
          Edit {isDarkTheme ? 'light' : 'dark'} mode
        </button>
        <button
          type="button"
          className="clean-btn button button--secondary margin-left--md"
          onClick={() => {
            setInputColor(DEFAULT_PRIMARY_COLOR);
            setBaseColor(DEFAULT_PRIMARY_COLOR);
            setBackground(DEFAULT_BACKGROUND_COLOR);
            setShades(COLOR_SHADES);
          }}>
          Reset
        </button>
      </p>
      <p>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="background_color">
          <strong className="margin-right--sm">Background:</strong>
        </label>
        <input
          id="background_color"
          type="color"
          className={clsx(styles.colorInput, 'margin-right--sm')}
          value={background}
          onChange={(e) => {
            setBackground(e.target.value);
          }}
        />
      </p>
      <div>
        <table className={styles.colorTable}>
          <thead>
            <tr>
              <th>CSS Variable Name</th>
              <th>Hex</th>
              <th>Adjustment</th>
              <th>Contrast Rating</th>
            </tr>
          </thead>
          <tbody>
            {getAdjustedColors(shades, baseColor)
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((value) => {
                const {variableName, adjustment, adjustmentInput, hex} = value;
                return (
                  <tr key={variableName}>
                    <td>
                      <code>{variableName}</code>
                    </td>
                    <td>
                      <span
                        className={styles.color}
                        style={{
                          backgroundColor: hex,
                        }}
                      />
                      <code className="margin-left--sm">
                        {hex.toLowerCase()}
                      </code>
                    </td>
                    <td>
                      {variableName === '--ifm-color-primary' ? (
                        0
                      ) : (
                        <input
                          aria-label={`${variableName} CSS variable name`}
                          className={styles.input}
                          type="number"
                          value={adjustmentInput}
                          onChange={(event) => {
                            const newValue = parseFloat(event.target.value);
                            setShades({
                              ...shades,
                              [variableName]: {
                                ...shades[variableName],
                                adjustmentInput: event.target.value,
                                adjustment: Number.isNaN(newValue)
                                  ? adjustment
                                  : newValue / 100.0,
                              },
                            });
                          }}
                        />
                      )}
                    </td>
                    <td
                      style={{
                        fontSize: 'medium',
                        backgroundColor: background,
                        color: hex,
                      }}>
                      <b>{wcagContrast(hex, background)}</b>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <p>
        Replace the variables in <code>src/css/custom.css</code> with these new
        variables.
      </p>
      <CodeBlock className="language-css" title="/src/css/custom.css">
        {`${isDarkTheme ? "html[data-theme='dark']" : ':root'} {
${getAdjustedColors(shades, baseColor)
  .sort((a, b) => a.codeOrder - b.codeOrder)
  .map((value) => `  ${value.variableName}: ${value.hex.toLowerCase()};`)
  .join('\n')}${
          background !== DEFAULT_BACKGROUND_COLOR
            ? `\n  --ifm-background-color: ${background};`
            : ''
        }
}`}
      </CodeBlock>
    </div>
  );
}

export default ColorGenerator;
