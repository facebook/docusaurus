/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docsearch/react/modal';

declare module '@docsearch/react/style';

// TODO incompatible declaration file
declare module 'eta' {
  export const defaultConfig: object;

  export function compile(
    template: string,
    options?: object,
  ): (data: object, config: object) => string;
}
