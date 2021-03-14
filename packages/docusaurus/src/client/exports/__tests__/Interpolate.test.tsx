/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {interpolate} from '../Interpolate';

describe('Interpolate', () => {
  test('without placeholders', () => {
    const text = 'Hello how are you?';
    expect(interpolate(text)).toEqual(text);
  });

  test('placeholders with string values', () => {
    const text = 'Hello {name} how are you {day}?';
    const values = {name: 'Sébastien', day: 'today'};
    expect(interpolate(text, values)).toMatchInlineSnapshot(
      `"Hello Sébastien how are you today?"`,
    );
  });

  test('placeholders with string values', () => {
    const text = '{number} {string} {object} {array}';
    const values = {
      number: 42,
      string: 'Hello',
      object: {hello: 'world'},
      array: ['Hello'],
    };
    // Do we need to improve the JS type -> String conversion logic here?
    expect(interpolate(text, values)).toMatchInlineSnapshot(
      `"42 Hello [object Object] Hello"`,
    );
  });

  test('placeholders with falsy values', () => {
    const text = '{number} {string} {boolean}';
    const values = {
      number: 0,
      string: '',
      boolean: false,
    };
    // Do we need to improve the JS type -> String conversion logic here?
    expect(interpolate(text, values)).toMatchInlineSnapshot(`"0  false"`);
  });

  test('placeholders with string values mismatch', () => {
    // Should we emit warnings in such case?
    const text = 'Hello {name} how are you {unprovidedValue}?';
    const values = {name: 'Sébastien', extraValue: 'today'};
    expect(interpolate(text, values)).toMatchInlineSnapshot(
      `"Hello Sébastien how are you {unprovidedValue}?"`,
    );
  });

  test('placeholders with values not provided', () => {
    // Should we emit warnings in such case?
    const text = 'Hello {name} how are you {day}?';
    expect(interpolate(text)).toEqual(text);
    expect(interpolate(text, {})).toEqual(text);
  });

  test('placeholders with JSX values', () => {
    const text = 'Hello {name} how are you {day}?';
    const values = {name: <b>Sébastien</b>, day: <span>today</span>};
    expect(interpolate(text, values)).toMatchSnapshot();
  });

  test('placeholders with mixed vales', () => {
    const text = 'Hello {name} how are you {day}?';
    const values = {name: 'Sébastien', day: <span>today</span>};
    expect(interpolate(text, values)).toMatchSnapshot();
  });

  test('acceptance test', () => {
    const text = 'Hello {name} how are you {day}? Another {unprovidedValue}!';
    const values = {
      name: 'Sébastien',
      day: <span>today</span>,
      extraUselessValue1: <div>test</div>,
      extraUselessValue2: 'hi',
    };
    expect(interpolate(text, values)).toMatchSnapshot();
  });
});
