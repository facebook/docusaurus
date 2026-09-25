/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Text snapshots are built with "docusaurus build --dev", using React dev SSR.
// For client-rendered Suspense boundaries (e.g. <BrowserOnly>), React dev
// emits debug attributes that production never emits, including a full
// component stack with line numbers, creating noisy text snapshot diffs.
// Digest "" means an intentional browser() bailout, not an SSR error.

import fs from 'node:fs/promises';
import path from 'node:path';

const buildDir = path.resolve(import.meta.dirname, '../website/build');

const BrowserBailoutTemplateRegex =
  /<template data-dgst=""(?: data-(?:msg|stck|cstck)="[^"]*")+><\/template>/g;

let count = 0;
for await (const file of fs.glob('**/*.html', {cwd: buildDir})) {
  const filePath = path.join(buildDir, file);
  const html = await fs.readFile(filePath, 'utf8');
  const normalized = html.replace(BrowserBailoutTemplateRegex, () => {
    count += 1;
    return '<template data-dgst=""></template>';
  });
  if (normalized !== html) {
    await fs.writeFile(filePath, normalized);
  }
}

console.log(`Normalized ${count} browser-only Suspense boundaries`);
