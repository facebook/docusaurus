/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const execa = require('execa');
const {PerfLogger} = require('@docusaurus/logger');

async function runTest(name, file, options) {
  for (let i = 0; i < 100; i++) {
    const before = performance.now();
    const result = await PerfLogger.async(`${name} ${i}`, async () => {
      const out = execa.sync(
        'git',
        // ['--version'],
        ['log', '--format=RESULT:%ct,%an', '--max-count=1', '--', `"${file}"`],
        {
          // stdout: 'inherit',
          ...options,
        },
      );

      return out;
    });

    const time = performance.now() - before;

    // console.log(`${name} ${i} => Time = ${time}`, options, result.exitCode);
  }
}

async function runAllTests() {
  await runTest('Shell false', 'website/docs/advanced/architecture.mdx', {
    shell: false,
  });

  await runTest('Shell true', 'website/docs/advanced/architecture.mdx', {
    shell: true,
  });

  await runTest(
    'Shell false',
    'website/i18n/zh-CN/docusaurus-plugin-content-docs/current/advanced/architecture.mdx',
    {
      shell: false,
    },
  );

  await runTest(
    'Shell true',
    'website/i18n/zh-CN/docusaurus-plugin-content-docs/current/advanced/architecture.mdx',
    {
      shell: true,
    },
  );
}

runAllTests().then(
  () => {
    console.log('success');
  },
  (e) => {
    console.log('failure', e);
  },
);
