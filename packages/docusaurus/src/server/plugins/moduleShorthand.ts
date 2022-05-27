/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function getNamePatterns(
  moduleName: string,
  moduleType: 'preset' | 'theme' | 'plugin',
): string[] {
  if (moduleName.startsWith('@')) {
    // Pure scope: `@scope` => `@scope/docusaurus-plugin`
    if (!moduleName.includes('/')) {
      return [`${moduleName}/docusaurus-${moduleType}`];
    }
    const [scope, packageName] = moduleName.split(/\/(?<rest>.*)/) as [
      string,
      string,
    ];
    return [
      `${scope}/${packageName}`,
      `${scope}/docusaurus-${moduleType}-${packageName}`,
    ];
  }
  return [
    moduleName,
    `@docusaurus/${moduleType}-${moduleName}`,
    `docusaurus-${moduleType}-${moduleName}`,
  ];
}

export function resolveModuleName(
  moduleName: string,
  moduleRequire: NodeRequire,
  moduleType: 'preset' | 'theme' | 'plugin',
): string {
  const modulePatterns = getNamePatterns(moduleName, moduleType);
  const module = modulePatterns.find((m) => {
    try {
      moduleRequire.resolve(m);
      return true;
    } catch {
      return false;
    }
  });
  if (!module) {
    throw new Error(`Docusaurus was unable to resolve the "${moduleName}" ${moduleType}. Make sure one of the following packages are installed:
${modulePatterns.map((m) => `- ${m}`).join('\n')}`);
  }
  return module;
}
