/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// TODO temporary escape hatch for alpha-60: to be removed soon
// Our validation schemas might be buggy at first
// will permit users to bypass validation until we fix all validation errors
// see for example: https://github.com/facebook/docusaurus/pull/3120
// Undocumented on purpose, as we don't want users to keep using it over time
export const isValidationDisabledEscapeHatch =
  process.env.DISABLE_DOCUSAURUS_VALIDATION === 'true';

isValidationDisabledEscapeHatch &&
  console.warn(
    'You should avoid using DISABLE_DOCUSAURUS_VALIDATION escape hatch',
  );
