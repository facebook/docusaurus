/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module 'remark-admonitions';

declare module 'react-loadable-ssr-addon-v5-slorber' {
  type Asset = {
    file: string;
    hash: string;
    publicPath: string;
    integrity: string;
  };

  export type Manifest = {
    entrypoints: string[];
    origins: {[key: string]: number[]};
    assets: Array<{[key: string]: Asset[]}>;
  };

  export function getBundles(
    manifest: Manifest,
    modulesToBeLoaded: string[],
  ): {js: Asset[]; css: Asset[]};

  interface ReactLoadableSSRAddon {
    new (props: {filename: string});
  }

  const plugin: ReactLoadableSSRAddon;
  export default plugin;
}

declare module '@slorber/static-site-generator-webpack-plugin' {
  export type Locals = {
    routesLocation: {[filePath: string]: string};
    generatedFilesDir: string;
    headTags: string;
    preBodyTags: string;
    postBodyTags: string;
    onLinksCollected: (staticPagePath: string, links: string[]) => void;
    baseUrl: string;
    ssrTemplate: string;
    noIndex: boolean;
  };

  interface StaticSiteGeneratorPlugin {
    new (props: {
      entry: string;
      locals: Locals;
      paths: string[];
      preferFoldersOutput?: boolean;
      globals: {[key: string]: unknown};
    });
  }

  const plugin: StaticSiteGeneratorPlugin;
  export default plugin;
}

declare module 'webpack/lib/HotModuleReplacementPlugin' {
  import type {HotModuleReplacementPlugin} from 'webpack';

  export default HotModuleReplacementPlugin;
}
