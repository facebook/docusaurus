/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/plugin-pwa' {
  export type pwaHead = {
    tagName: string;
    href?: string;
    content?: string;
    [attributeName: string]: string | boolean;
  };

  export type PluginOptions = {
    debug?: boolean;
    offlineModeActivationStrategies;
    injectManifestConfig;
    reloadPopup;
    pwaHead: pwaHead[];
    swCustom;
    swRegister;
  };
}

declare module '@theme/PwaReloadPopup' {
  export interface Props {
    readonly onReload: () => void;
  }

  const PwaReloadPopup: (props: Props) => JSX.Element;
  export default PwaReloadPopup;
}
