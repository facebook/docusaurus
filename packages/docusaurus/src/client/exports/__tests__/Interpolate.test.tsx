/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import renderer from 'react-test-renderer';
import Interpolate, {interpolate} from '../Interpolate';

describe('interpolate', () => {
  it('without placeholders', () => {
    const text = 'Hello how are you?';
    expect(interpolate(text)).toEqual(text);
  });

  it('placeholders with string values', () => {
    const text = 'Hello {name} how are you {day}?';
    const values = {name: 'Sébastien', day: 'today'};
    expect(interpolate(text, values)).toMatchInlineSnapshot(
      `"Hello Sébastien how are you today?"`,
    );
  });

  it('placeholders with string values 2', () => {
    const text = '{number} {string} {object} {array}';
    const values = {
      number: 42,
      string: 'Hello',
      object: {hello: 'world'},
      array: ['Hello'],
    };
    expect(interpolate(text, values)).toMatchInlineSnapshot(
      `"42 Hello [object Object] Hello"`,
    );
  });

  it('placeholders with falsy values', () => {
    const text = '{number} {string} {boolean}';
    const values = {
      number: 0,
      string: '',
      boolean: false,
    };
    // Do we need to improve the JS type -> String conversion logic here?
    expect(interpolate(text, values)).toMatchInlineSnapshot(`"0  false"`);
  });

  it('placeholders with string values mismatch', () => {
    // Should we emit warnings in such case?
    const text = 'Hello {name} how are you {unprovidedValue}?';
    const values = {name: 'Sébastien', extraValue: 'today'};
    expect(interpolate(text, values)).toMatchInlineSnapshot(
      `"Hello Sébastien how are you {unprovidedValue}?"`,
    );
  });

  it('placeholders with values not provided', () => {
    // Should we emit warnings in such case?
    const text = 'Hello {name} how are you {day}?';
    expect(interpolate(text)).toEqual(text);
    expect(interpolate(text, {})).toEqual(text);
  });

  it('placeholders with JSX values', () => {
    const text = 'Hello {name} how are you {day}?';
    const values = {name: <b>Sébastien</b>, day: <span>today</span>};
    expect(interpolate(text, values)).toMatchSnapshot();
  });

  it('placeholders with mixed vales', () => {
    const text = 'Hello {name} how are you {day}?';
    const values = {name: 'Sébastien', day: <span>today</span>};
    expect(interpolate(text, values)).toMatchSnapshot();
  });

  it('acceptance test', () => {
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

describe('<Interpolate>', () => {
  it('without placeholders', () => {
    const text = 'Hello how are you?';
    expect(renderer.create(<Interpolate>{text}</Interpolate>).toJSON()).toEqual(
      text,
    );
  });

  it('placeholders with string values', () => {
    const text = 'Hello {name} how are you {day}?';
    const values = {name: 'Sébastien', day: 'today'};
    expect(
      renderer
        .create(<Interpolate values={values}>{text}</Interpolate>)
        .toJSON(),
    ).toMatchInlineSnapshot(`"Hello Sébastien how are you today?"`);
  });

  it('acceptance test', () => {
    const text = 'Hello {name} how are you {day}? Another {unprovidedValue}!';
    const values = {
      name: 'Sébastien',
      day: <span>today</span>,
      extraUselessValue1: <div>test</div>,
      extraUselessValue2: 'hi',
    };
    expect(
      renderer
        .create(<Interpolate values={values}>{text}</Interpolate>)
        .toJSON(),
    ).toMatchSnapshot();
  });

  it('rejects when children is not string', () => {
    expect(() =>
      renderer.create(
        <Interpolate>
          <span>aaa</span>
        </Interpolate>,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"The Docusaurus <Interpolate> component only accept simple string values. Received: React element"`,
    );
    expect(() =>
      renderer.create(<Interpolate>{null}</Interpolate>),
    ).toThrowErrorMatchingInlineSnapshot(
      `"The Docusaurus <Interpolate> component only accept simple string values. Received: object"`,
    );
  });
});
