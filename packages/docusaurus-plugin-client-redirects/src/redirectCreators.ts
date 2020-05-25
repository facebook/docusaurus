/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {RedirectsCreator} from './types';
import {removeSuffix} from './utils';

const ExtensionAdditionalMessage =
  "If the redirect extension system is not good enough for your usecase, you can create redirects yourself with the 'createRedirects' plugin option.";

const validateExtension = (ext: string) => {
  if (!ext) {
    throw new Error(
      `Extension=['${String(
        ext,
      )}'] is not allowed. ${ExtensionAdditionalMessage}`,
    );
  }
  if (ext.includes('.')) {
    throw new Error(
      `Extension=['${ext}'] contains a . (dot) and is not allowed. ${ExtensionAdditionalMessage}`,
    );
  }
  if (ext.includes('/')) {
    throw new Error(
      `Extension=['${ext}'] contains a / and is not allowed. ${ExtensionAdditionalMessage}`,
    );
  }
  if (encodeURIComponent(ext) !== ext) {
    throw new Error(
      `Extension=['${ext}'] contains invalid uri characters. ${ExtensionAdditionalMessage}`,
    );
  }
};

const addLeadingDot = (extension: string) => `.${extension}`;

// Create new /path that redirects to existing an /path.html
export function toExtensionsRedirectCreator(
  extensions: string[],
): RedirectsCreator {
  extensions.forEach(validateExtension);

  const dottedExtensions = extensions.map(addLeadingDot);

  return (fromRoutePath: string) => {
    const extensionFound = dottedExtensions.find((ext) =>
      fromRoutePath.endsWith(ext),
    );
    if (extensionFound) {
      const routePathWithoutExtension = removeSuffix(
        fromRoutePath,
        extensionFound,
      );
      return [routePathWithoutExtension];
    }
    return [];
  };
}

// Create new /path.html that redirects to existing an /path
export function fromExtensionsRedirectCreator(
  extensions: string[],
): RedirectsCreator {
  extensions.forEach(validateExtension);

  const dottedExtensions = extensions.map(addLeadingDot);

  const alreadyEndsWithAnExtension = (str: string) =>
    dottedExtensions.some((ext) => str.endsWith(ext));

  return (fromRoutePath: string) => {
    if (
      fromRoutePath === '' ||
      fromRoutePath.endsWith('/') ||
      alreadyEndsWithAnExtension(fromRoutePath)
    ) {
      return [];
    } else {
      return extensions.map((ext) => `${fromRoutePath}.${ext}`);
    }
  };
}
