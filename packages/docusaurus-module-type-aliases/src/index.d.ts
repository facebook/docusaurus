/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@generated/client-modules' {
  const clientModules: readonly any[];
  export default clientModules;
}

declare module '@generated/docusaurus.config' {
  const config: any;
  export default config;
}

declare module '@generated/registry' {
  const registry: {
    readonly [key: string]: [() => Promise<any>, string, string];
  };
  export default registry;
}

declare module '@generated/routes' {
  type Route = {
    readonly path: string;
    readonly component: any;
    readonly exact?: boolean;
  };
  const routes: Route[];
  export default routes;
}

declare module '@generated/routesChunkNames' {
  const routesChunkNames: any;
  export default routesChunkNames;
}

declare module '@theme/*';

declare module '@theme-original/*';

declare module '@docusaurus/*';

declare module '*.module.css' {
  const classes: {readonly [key: string]: string};
  export default classes;
}

declare module '*.css' {
  const src: string;
  export default src;
}
