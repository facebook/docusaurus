/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @vitest-environment jsdom

import {afterAll, describe, expect, it, vi} from 'vitest';
import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import BrowserOnly from '../BrowserOnly';
import {Context} from '../../browserContext';

describe('<BrowserOnly>', () => {
  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('rejects react element children', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() =>
      render(
        <Context.Provider value>
          <BrowserOnly>
            <span>{window.location.href}</span>
          </BrowserOnly>
        </Context.Provider>,
      ),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Error: Docusaurus error: The children of <BrowserOnly> must be a "render function", e.g. <BrowserOnly>{() => <span>{window.location.href}</span>}</BrowserOnly>.
      Current type: React element]
    `);
  });

  it('rejects string children', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() => {
      render(
        <Context.Provider value>
          <BrowserOnly> </BrowserOnly>
        </Context.Provider>,
      );
    }).toThrowErrorMatchingInlineSnapshot(`
      [Error: Docusaurus error: The children of <BrowserOnly> must be a "render function", e.g. <BrowserOnly>{() => <span>{window.location.href}</span>}</BrowserOnly>.
      Current type: string]
    `);
  });

  it('accepts valid children', () => {
    const {container} = render(
      <Context.Provider value>
        <BrowserOnly fallback={<span>Loading</span>}>
          {() => <span>{window.location.href}</span>}
        </BrowserOnly>
      </Context.Provider>,
    );
    expect(container.firstElementChild).toMatchInlineSnapshot(`
      <span>
        https://docusaurus.io/
      </span>
    `);
  });

  it('returns fallback when not in browser', () => {
    const {container} = render(
      <Context.Provider value={false}>
        <BrowserOnly fallback={<span>Loading</span>}>
          {() => <span>{window.location.href}</span>}
        </BrowserOnly>
      </Context.Provider>,
    );
    expect(container.firstElementChild).toMatchInlineSnapshot(`
      <span>
        Loading
      </span>
    `);
  });

  it('gracefully falls back', () => {
    const {container} = render(
      <Context.Provider value={false}>
        <BrowserOnly>{() => <span>{window.location.href}</span>}</BrowserOnly>
      </Context.Provider>,
    );
    expect(container.firstElementChild).toMatchInlineSnapshot(`null`);
  });
});
