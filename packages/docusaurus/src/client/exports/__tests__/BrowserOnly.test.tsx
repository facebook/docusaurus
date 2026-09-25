/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @vitest-environment jsdom

import {afterAll, describe, expect, it, vi} from 'vitest';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import BrowserOnly from '../BrowserOnly';

describe('<BrowserOnly>', () => {
  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('rejects react element children', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() =>
      render(
        <BrowserOnly>
          <span>{window.location.href}</span>
        </BrowserOnly>,
      ),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Error: Docusaurus error: The children of <BrowserOnly> must be a "render function", e.g. <BrowserOnly>{() => <span>{window.location.href}</span>}</BrowserOnly>.
      Current type: React element]
    `);
  });

  it('rejects string children', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() => {
      render(<BrowserOnly> </BrowserOnly>);
    }).toThrowErrorMatchingInlineSnapshot(`
      [Error: Docusaurus error: The children of <BrowserOnly> must be a "render function", e.g. <BrowserOnly>{() => <span>{window.location.href}</span>}</BrowserOnly>.
      Current type: string]
    `);
  });

  it('accepts valid children', () => {
    const {container} = render(
      <BrowserOnly fallback={<span>Loading</span>}>
        {() => <span>{window.location.href}</span>}
      </BrowserOnly>,
    );
    expect(container.firstElementChild).toMatchInlineSnapshot(`
      <span>
        https://docusaurus.io/
      </span>
    `);
  });

  it('returns fallback when not in browser', () => {
    expect(
      renderToString(
        <BrowserOnly fallback={<span>Loading</span>}>
          {() => <span>{window.location.href}</span>}
        </BrowserOnly>,
      ),
    ).toBe('<span>Loading</span>');
  });

  it('gracefully falls back', () => {
    expect(
      renderToString(
        <BrowserOnly>{() => <span>{window.location.href}</span>}</BrowserOnly>,
      ),
    ).toBe('');
  });
});
