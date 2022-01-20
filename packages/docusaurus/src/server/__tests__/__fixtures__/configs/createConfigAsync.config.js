/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = async function createConfig() {
  await new Promise((resolve) => {
    setTimeout(resolve, 10);
  });
  return {
    title: 'Hello',
    tagline: 'Hello World',
    organizationName: 'endiliey',
    projectName: 'hello',
    baseUrl: '/',
    url: 'https://docusaurus.io',
  };
};
