/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {flatten} from 'lodash';
import {removeSuffix} from '@docusaurus/utils';
import {RedirectMetadata} from './types';

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
export function createToExtensionsRedirects(
  paths: string[],
  extensions: string[],
  baseUrl: string,
): RedirectMetadata[] {
  extensions.forEach(validateExtension);

  const dottedExtensions = extensions.map(addLeadingDot);

  const createPathRedirects = (path: string): RedirectMetadata[] => {
    const extensionFound = dottedExtensions.find((ext) => path.endsWith(ext));
    if (extensionFound) {
      const routePathWithoutExtension = removeSuffix(path, extensionFound);
      return [routePathWithoutExtension].map((from) => ({
        from: trimBaseUrl(from, baseUrl),
        to: trimBaseUrl(path, baseUrl),
      }));
    }
    return [];
  };

  return flatten(paths.map(createPathRedirects));
}

// Create new /path.html that redirects to existing an /path
export function createFromExtensionsRedirects(
  paths: string[],
  extensions: string[],
  baseUrl: string,
): RedirectMetadata[] {
  extensions.forEach(validateExtension);

  const dottedExtensions = extensions.map(addLeadingDot);

  const alreadyEndsWithAnExtension = (str: string) =>
    dottedExtensions.some((ext) => str.endsWith(ext));

  const createPathRedirects = (path: string): RedirectMetadata[] => {
    if (path === '' || path.endsWith('/') || alreadyEndsWithAnExtension(path)) {
      return [];
    } else {
      return extensions.map((ext) => ({
        from: `${trimBaseUrl(path, baseUrl)}.${ext}`,
        to: trimBaseUrl(path, baseUrl),
      }));
    }
  };

  return flatten(paths.map(createPathRedirects));
}

function trimBaseUrl(path: string, baseUrl: string) {
  return path.startsWith(baseUrl) ? path.replace(baseUrl, '/') : path;
}
