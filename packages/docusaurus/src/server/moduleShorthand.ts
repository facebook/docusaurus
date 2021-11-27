/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function resolveModuleName(
  moduleName: string,
  moduleRequire: NodeRequire,
  moduleType: 'preset' | 'theme' | 'plugin',
): string {
  const modulePatterns = [
    moduleName,
    `@docusaurus/${moduleType}-${moduleName}`,
    `docusaurus-${moduleType}-${moduleName}`,
    `@${moduleName}/docusaurus-${moduleType}`,
  ];
  // eslint-disable-next-line no-restricted-syntax
  for (const module of modulePatterns) {
    try {
      moduleRequire.resolve(module);
      return module;
    } catch (e) {}
  }
  throw new Error(`Docusaurus was unable to resolve the "${moduleName}" ${moduleType}. Make sure one of the following packages are installed:
  ${modulePatterns.map((module) => `- ${module}`).join('\n')}`);
}
