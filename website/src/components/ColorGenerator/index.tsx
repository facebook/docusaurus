/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import Color from 'color';
import CodeBlock from '@theme/CodeBlock';

import styles from './styles.module.css';

const COLOR_SHADES: Record<
  string,
  {
    adjustment: number;
    adjustmentInput: string;
    displayOrder: number;
    codeOrder: number;
  }
> = {
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

const DEFAULT_PRIMARY_COLOR = '#25c2a0';
const LIGHT_BACKGROUND_COLOR = 'white';
const DARK_BACKGROUND_COLOR = '#181920';

function wcagContrast(foreground: string, background: string) {
  const contrast = Color(foreground).contrast(Color(background));
  // eslint-disable-next-line no-nested-ternary
  return contrast > 7 ? 'AAA' : contrast > 4.5 ? 'AA' : 'Fail';
}

function ColorGenerator(): JSX.Element {
  const [inputColor, setInputColor] = useState(DEFAULT_PRIMARY_COLOR);
  const [baseColor, setBaseColor] = useState(DEFAULT_PRIMARY_COLOR);
  const [shades, setShades] = useState(COLOR_SHADES);
  const color = Color(baseColor);
  const adjustedColors = Object.keys(shades)
    .map((shade) => ({
      ...shades[shade],
      variableName: shade,
    }))
    .map((value) => ({
      ...value,
      hex: color.darken(value.adjustment).hex(),
    }));

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
          className={styles.input}
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
      </p>
      <div>
        <table className={styles.colorTable}>
          <thead>
            <tr>
              <th>CSS Variable Name</th>
              <th>Hex</th>
              <th>Adjustment</th>
              <th>Light contrast</th>
              <th>Dark contrast</th>
            </tr>
          </thead>
          <tbody>
            {adjustedColors
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
                        backgroundColor: LIGHT_BACKGROUND_COLOR,
                        color: hex,
                      }}>
                      <b>{wcagContrast(hex, LIGHT_BACKGROUND_COLOR)}</b>
                    </td>
                    <td
                      style={{
                        fontSize: 'medium',
                        backgroundColor: DARK_BACKGROUND_COLOR,
                        color: hex,
                      }}>
                      <b>{wcagContrast(hex, DARK_BACKGROUND_COLOR)}</b>
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
      <CodeBlock className="language-css">
        {adjustedColors
          .sort((a, b) => a.codeOrder - b.codeOrder)
          .map((value) => `${value.variableName}: ${value.hex.toLowerCase()};`)
          .join('\n')}
      </CodeBlock>
    </div>
  );
}

export default ColorGenerator;
