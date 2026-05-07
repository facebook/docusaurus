/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from 'path';
import {createMDXLoaderOptionsBuilder} from '../options';

describe('createMDXLoaderOptionsBuilder', () => {
  it('produces the same options as manual assembly', () => {
    const siteDir = '/mySite';
    const siteConfig = {
      staticDirectories: ['static', 'static2'],
      markdown: {mermaid: true} as any,
    };

    const overrides = {
      admonitions: true,
      isMDXPartial: () => true,
    } as const;

    const built = createMDXLoaderOptionsBuilder({
      siteDir,
      siteConfig,
      useCrossCompilerCache: true,
    }).build(overrides as any);

    const manual = {
      siteDir,
      staticDirs: siteConfig.staticDirectories.map((dir) =>
        path.resolve(siteDir, dir),
      ),
      markdownConfig: siteConfig.markdown,
      useCrossCompilerCache: true,
      ...overrides,
    };

    expect(built).toEqual(manual);
    expect(built).toMatchSnapshot();
  });
});
