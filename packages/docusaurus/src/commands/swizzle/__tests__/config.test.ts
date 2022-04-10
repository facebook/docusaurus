/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {SwizzleConfig} from '@docusaurus/types';
import {normalizeSwizzleConfig} from '../config';

describe('normalizeSwizzleConfig', () => {
  it(`validate no components config`, async () => {
    const config: SwizzleConfig = {
      components: {},
    };
    expect(normalizeSwizzleConfig(config)).toEqual(config);
  });

  it(`validate complete config`, async () => {
    const config: SwizzleConfig = {
      components: {
        SomeComponent: {
          actions: {
            wrap: 'safe',
            eject: 'unsafe',
          },
          description: 'SomeComponent description',
        },
        'Other/Component': {
          actions: {
            wrap: 'forbidden',
            eject: 'unsafe',
          },
          description: 'Other/Component description',
        },
      },
    };
    expect(normalizeSwizzleConfig(config)).toEqual(config);
  });

  it(`normalize partial config`, async () => {
    const config: SwizzleConfig = {
      components: {
        SomeComponent: {
          // @ts-expect-error: incomplete actions map
          actions: {
            eject: 'safe',
          },
          description: 'SomeComponent description',
        },
        'Other/Component': {
          // @ts-expect-error: incomplete actions map
          actions: {
            wrap: 'forbidden',
          },
        },
      },
    };
    expect(normalizeSwizzleConfig(config)).toMatchSnapshot();
  });

  it(`reject missing components`, async () => {
    // @ts-expect-error: incomplete actions map
    const config: SwizzleConfig = {};

    expect(() =>
      normalizeSwizzleConfig(config),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Swizzle config does not match expected schema: "components" is required"`,
    );
  });

  it(`reject invalid action name`, async () => {
    const config: SwizzleConfig = {
      components: {
        MyComponent: {
          actions: {
            wrap: 'safe',
            eject: 'unsafe',
            // @ts-expect-error: on purpose
            bad: 'safe',
          },
        },
      },
    };

    expect(() =>
      normalizeSwizzleConfig(config),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Swizzle config does not match expected schema: "components.MyComponent.actions.bad" is not allowed"`,
    );
  });

  it(`reject invalid action status`, async () => {
    const config: SwizzleConfig = {
      components: {
        MyComponent: {
          actions: {
            wrap: 'safe',
            // @ts-expect-error: on purpose
            eject: 'invalid-status',
          },
        },
      },
    };

    expect(() =>
      normalizeSwizzleConfig(config),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Swizzle config does not match expected schema: "components.MyComponent.actions.eject" must be one of [safe, unsafe, forbidden]"`,
    );
  });
});
