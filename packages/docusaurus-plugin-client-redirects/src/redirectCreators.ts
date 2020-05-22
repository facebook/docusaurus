/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {RedirectsCreator} from './types';
import {removeTrailingSlash} from './utils';

export function fromExtensionsRedirectCreator(
  extensions: string[],
): RedirectsCreator {
  const dottedExtensions = extensions.map((ext) => `.${ext}`);
  return (fromRoutePath: string) => {
    const extensionMatch = dottedExtensions.find((ext) =>
      fromRoutePath.endsWith(`.${ext}`),
    );
    if (extensionMatch) {
      const routePathWithoutExtension = fromRoutePath.substr(
        0,
        fromRoutePath.length - extensionMatch.length - 1,
      );
      return [routePathWithoutExtension];
    }
    return [];
  };
}

export function toExtensionsRedirectCreator(
  extensions: string[],
): RedirectsCreator {
  return (fromRoutePath: string) => {
    if (fromRoutePath === '/') {
      return [];
    } else {
      const fromRoutePathNoSlash = removeTrailingSlash(fromRoutePath);
      return extensions.map((ext) => `${fromRoutePathNoSlash}.${ext}`);
    }
  };
}
