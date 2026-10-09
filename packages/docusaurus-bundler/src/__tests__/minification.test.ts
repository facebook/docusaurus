/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {afterEach, describe, expect, it} from 'vitest';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import {getCurrentBundler} from '../currentBundler';
import {getMinimizers} from '../minification';
import type webpack from 'webpack';
import type {CurrentBundler} from '@docusaurus/types';

const tempDirs: string[] = [];

const files = {
  'index.js': `import jsText from './text.js' with {type: 'text'};
import cssText from './text.css' with {type: 'text'};

export default function getTexts() {
  const unminifiedVariableName = [jsText, cssText];
  return [...unminifiedVariableName, new URL('./style.css', import.meta.url)];
}
`,
  'text.js': '// Text import\nconst   jsText   =   1;\n',
  'text.css': '/* Text import */\n.textCss   {   color:   red;   }\n',
  'style.css': '/* Comment */\n.style {\n  color: #ff0000;\n}\n',
};

async function build(name: CurrentBundler['name']) {
  const siteDir = await fs.mkdtemp(
    path.join(os.tmpdir(), 'docusaurus-minification-'),
  );
  tempDirs.push(siteDir);
  await Promise.all(
    Object.entries(files).map(([file, contents]) =>
      fs.writeFile(path.join(siteDir, file), contents),
    ),
  );
  const currentBundler = await getCurrentBundler({
    siteConfig: {webpack: name === 'webpack' ? {} : undefined},
  });
  const outDir = path.join(siteDir, 'build');
  const compiler = currentBundler.instance({
    mode: 'production',
    context: siteDir,
    entry: './index.js',
    output: {
      path: outDir,
      filename: '[name].js',
      assetModuleFilename: '[name][ext]',
      library: {type: 'commonjs2'},
    },
    optimization: {minimizer: await getMinimizers({currentBundler})},
  });
  let stats: webpack.Stats;
  try {
    stats = await new Promise((resolve, reject) => {
      compiler.run((error, result) =>
        error ? reject(error) : resolve(result!),
      );
    });
  } finally {
    await new Promise<void>((resolve, reject) => {
      compiler.close((error) => (error ? reject(error) : resolve()));
    });
  }
  expect(stats.hasErrors()).toBe(false);
  expect(stats.hasWarnings()).toBe(false);
  return {
    js: await fs.readFile(path.join(outDir, 'main.js'), 'utf8'),
    css: await fs.readFile(path.join(outDir, 'style.css'), 'utf8'),
  };
}

describe.each(['webpack', 'rspack'] as const)('%s minimizers', (name) => {
  afterEach(async () => {
    await Promise.all(
      tempDirs
        .splice(0)
        .map((dir) => fs.rm(dir, {recursive: true, force: true})),
    );
  });

  it('minify JS and CSS assets, but not text imports', async () => {
    const {js, css} = await build(name);
    expect(js).not.toContain('unminifiedVariableName');
    expect(css).toBe('.style{color:red}');
    // Text imports must remain the raw file content
    expect(js).toContain(JSON.stringify(files['text.js']));
    expect(js).toContain(JSON.stringify(files['text.css']));
  });
});
