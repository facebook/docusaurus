/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function buildUrl(
  githubHost: string,
  githubPort: string | undefined,
  gitCredentials: string | undefined,
  organizationName: string,
  projectName: string,
  useSSH: boolean | undefined,
) {
  return useSSH
    ? buildSshUrl(githubHost, organizationName, projectName, githubPort)
    : buildHttpsUrl(
        gitCredentials,
        githubHost,
        organizationName,
        projectName,
        githubPort,
      );
}

function buildSshUrl(
  githubHost: string,
  organizationName: string,
  projectName: string,
  githubPort: string | undefined,
) {
  if (githubPort) {
    return `ssh://git@${githubHost}:${githubPort}/${organizationName}/${projectName}.git`;
  }
  return `git@${githubHost}:${organizationName}/${projectName}.git`;
}

function buildHttpsUrl(
  gitCredentials: string | undefined,
  githubHost: string,
  organizationName: string,
  projectName: string,
  githubPort: string | undefined,
) {
  if (githubPort) {
    return `https://${gitCredentials}@${githubHost}:${githubPort}/${organizationName}/${projectName}.git`;
  }
  return `https://${gitCredentials}@${githubHost}/${organizationName}/${projectName}.git`;
}
