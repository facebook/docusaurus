/**
 * Copyright (c) Meta. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module 'remark-admonitions';

declare module 'react-loadable-ssr-addon-v5-slorber';

declare module 'resolve-pathname' {
  export default function resolvePathname(to: string, from?: string): string;
}

declare module '@slorber/static-site-generator-webpack-plugin';

declare module 'webpack/lib/HotModuleReplacementPlugin' {
  import {HotModuleReplacementPlugin} from 'webpack';

  export default HotModuleReplacementPlugin;
}
