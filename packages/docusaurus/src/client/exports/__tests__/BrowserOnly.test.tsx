/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import React from 'react';
import renderer from 'react-test-renderer';
import BrowserOnly from '../BrowserOnly';

jest.mock('@docusaurus/useIsBrowser', () => () => true);

describe('BrowserOnly', () => {
  it('rejects react element children', () => {
    process.env.NODE_ENV = 'development';
    expect(() => {
      renderer.create(
        <BrowserOnly>
          {/* @ts-expect-error test */}
          <span>{window.location.href}</span>
        </BrowserOnly>,
      );
    }).toThrowErrorMatchingInlineSnapshot(`
      "Docusaurus error: The children of <BrowserOnly> must be a \\"render function\\", e.g. <BrowserOnly>{() => <span>{window.location.href}</span>}</BrowserOnly>.
      Current type: React element"
    `);
  });
  it('rejects string children', () => {
    expect(() => {
      renderer.create(
        // @ts-expect-error test
        <BrowserOnly> </BrowserOnly>,
      );
    }).toThrowErrorMatchingInlineSnapshot(`
      "Docusaurus error: The children of <BrowserOnly> must be a \\"render function\\", e.g. <BrowserOnly>{() => <span>{window.location.href}</span>}</BrowserOnly>.
      Current type: string"
    `);
  });
  it('accepts valid children', () => {
    expect(
      renderer
        .create(
          <BrowserOnly fallback={<span>Loading</span>}>
            {() => <span>{window.location.href}</span>}
          </BrowserOnly>,
        )
        .toJSON(),
    ).toMatchInlineSnapshot(`
      <span>
        https://docusaurus.io
      </span>
    `);
  });
});
