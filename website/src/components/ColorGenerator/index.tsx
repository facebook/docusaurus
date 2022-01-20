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
import Admonition from '@theme/Admonition';
import Link from '@docusaurus/Link';
import {useColorMode} from '@docusaurus/theme-common';

import {
  type ColorState,
  COLOR_SHADES,
  LIGHT_PRIMARY_COLOR,
  DARK_PRIMARY_COLOR,
  LIGHT_BACKGROUND_COLOR,
  DARK_BACKGROUND_COLOR,
  getAdjustedColors,
  lightStorage,
  darkStorage,
  updateDOMColors,
} from '@site/src/utils/colorUtils';
import styles from './styles.module.css';

function wcagContrast(foreground: string, background: string) {
  const contrast = Color(foreground).contrast(Color(background));
  // eslint-disable-next-line no-nested-ternary
  return contrast > 7 ? 'AAA 🏅' : contrast > 4.5 ? 'AA 👍' : 'Fail 🔴';
}

function ColorGenerator(): JSX.Element {
  const {isDarkTheme, setDarkTheme, setLightTheme} = useColorMode();
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
    setStorage(isDarkTheme ? darkStorage : lightStorage);
  }, [isDarkTheme]);

  // Switch modes -> update state by stored values
  useEffect(() => {
    const storedValues: ColorState = JSON.parse(storage.get() ?? '{}');
    setInputColor(storedValues.baseColor ?? DEFAULT_PRIMARY_COLOR);
    setBaseColor(storedValues.baseColor ?? DEFAULT_PRIMARY_COLOR);
    setBackground(storedValues.background ?? DEFAULT_BACKGROUND_COLOR);
    setShades(storedValues.shades ?? COLOR_SHADES);
  }, [storage, DEFAULT_BACKGROUND_COLOR, DEFAULT_PRIMARY_COLOR]);

  // State changes -> update DOM styles
  useEffect(() => {
    updateDOMColors({baseColor, background, shades});
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
      <Admonition type="tip">
        <p>
          Aim for at least{' '}
          <Link href="https://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">
            WCAG-AA contrast ratio
          </Link>{' '}
          for the primary color to ensure readability. Use the Docusaurus
          website itself to preview how your color palette would look like. You
          can use alternative palettes in dark mode because one color
          doesn&apos;t usually work in both light and dark mode.
        </p>
      </Admonition>
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
