/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment jsdom
 */

// Jest doesn't allow pragma below other comments. https://github.com/facebook/jest/issues/12573
// eslint-disable-next-line header/header
import React from 'react';
import renderer from 'react-test-renderer';
import BrowserOnly from '../BrowserOnly';
import {Context} from '../../browserContext';

describe('<BrowserOnly>', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {...originalEnv};
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('rejects react element children', () => {
    process.env.NODE_ENV = 'development';
    expect(() =>
      renderer
        .create(
          <Context.Provider value>
            <BrowserOnly>
              {/* @ts-expect-error test */}
              <span>{window.location.href}</span>
            </BrowserOnly>
          </Context.Provider>,
        )
        .toJSON(),
    ).toThrowErrorMatchingInlineSnapshot(`
      "Docusaurus error: The children of <BrowserOnly> must be a "render function", e.g. <BrowserOnly>{() => <span>{window.location.href}</span>}</BrowserOnly>.
      Current type: React element"
    `);
  });

  it('rejects string children', () => {
    process.env.NODE_ENV = 'development';
    expect(() => {
      renderer.create(
        <Context.Provider value>
          {/* @ts-expect-error test */}
          <BrowserOnly> </BrowserOnly>
        </Context.Provider>,
      );
    }).toThrowErrorMatchingInlineSnapshot(`
      "Docusaurus error: The children of <BrowserOnly> must be a "render function", e.g. <BrowserOnly>{() => <span>{window.location.href}</span>}</BrowserOnly>.
      Current type: string"
    `);
  });

  it('accepts valid children', () => {
    expect(
      renderer
        .create(
          <Context.Provider value>
            <BrowserOnly fallback={<span>Loading</span>}>
              {() => <span>{window.location.href}</span>}
            </BrowserOnly>
          </Context.Provider>,
        )
        .toJSON(),
    ).toMatchInlineSnapshot(`
      <span>
        https://docusaurus.io/
      </span>
    `);
  });

  it('returns fallback when not in browser', () => {
    expect(
      renderer
        .create(
          <Context.Provider value={false}>
            <BrowserOnly fallback={<span>Loading</span>}>
              {() => <span>{window.location.href}</span>}
            </BrowserOnly>
          </Context.Provider>,
        )
        .toJSON(),
    ).toMatchInlineSnapshot(`
      <span>
        Loading
      </span>
    `);
  });

  it('gracefully falls back', () => {
    expect(
      renderer
        .create(
          <Context.Provider value={false}>
            <BrowserOnly>
              {() => <span>{window.location.href}</span>}
            </BrowserOnly>
          </Context.Provider>,
        )
        .toJSON(),
    ).toMatchInlineSnapshot(`null`);
  });
});
