/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function buildSshUrl(
  githubHost: string,
  organizationName: string,
  projectName: string,
  githubPort?: string,
): string {
  if (githubPort) {
    return `ssh://git@${githubHost}:${githubPort}/${organizationName}/${projectName}.git`;
  }
  return `git@${githubHost}:${organizationName}/${projectName}.git`;
}

export function buildHttpsUrl(
  gitCredentials: string,
  githubHost: string,
  organizationName: string,
  projectName: string,
  githubPort?: string,
): string {
  if (githubPort) {
    return `https://${gitCredentials}@${githubHost}:${githubPort}/${organizationName}/${projectName}.git`;
  }
  return `https://${gitCredentials}@${githubHost}/${organizationName}/${projectName}.git`;
}
