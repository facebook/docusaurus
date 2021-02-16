/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from 'fs-extra';
import path from 'path';

import writeRedirectFiles, {
  toRedirectFilesMetadata,
  createToUrl,
} from '../writeRedirectFiles';

// Test to fix toUrl bugs we had:
// - https://github.com/facebook/docusaurus/issues/3886
// - https://github.com/facebook/docusaurus/issues/3925
describe('createToUrl', () => {
  test('should create appropriate redirect urls', async () => {
    expect(createToUrl('/', '/docs/something/else')).toEqual(
      '/docs/something/else',
    );
    expect(createToUrl('/', '/docs/something/else/')).toEqual(
      '/docs/something/else/',
    );
    expect(createToUrl('/', 'docs/something/else')).toEqual(
      '/docs/something/else',
    );
  });

  test('should create appropriate redirect urls with baseUrl', async () => {
    expect(createToUrl('/baseUrl/', '/docs/something/else')).toEqual(
      '/baseUrl/docs/something/else',
    );
    expect(createToUrl('/baseUrl/', '/docs/something/else/')).toEqual(
      '/baseUrl/docs/something/else/',
    );
    expect(createToUrl('/baseUrl/', 'docs/something/else')).toEqual(
      '/baseUrl/docs/something/else',
    );
  });
});

describe('toRedirectFilesMetadata', () => {
  test('should create appropriate metadatas', async () => {
    const pluginContext = {
      outDir: '/tmp/someFixedOutDir',
      baseUrl: 'https://docusaurus.io',
    };

    const redirectFiles = toRedirectFilesMetadata(
      [
        {from: '/abc.html', to: '/abc'},
        {from: '/def', to: '/def.html'},
        {from: '/xyz', to: '/'},
      ],
      pluginContext,
    );

    expect(redirectFiles.map((f) => f.fileAbsolutePath)).toEqual([
      path.join(pluginContext.outDir, '/abc.html/index.html'),
      path.join(pluginContext.outDir, '/def/index.html'),
      path.join(pluginContext.outDir, '/xyz/index.html'),
    ]);

    expect(redirectFiles.map((f) => f.fileContent)).toMatchSnapshot(
      'fileContent',
    );
  });

  test('should create appropriate metadatas for root baseUrl', async () => {
    const pluginContext = {
      outDir: '/tmp/someFixedOutDir',
      baseUrl: '/',
    };
    const redirectFiles = toRedirectFilesMetadata(
      [{from: '/abc.html', to: '/abc'}],
      pluginContext,
    );
    expect(redirectFiles.map((f) => f.fileContent)).toMatchSnapshot(
      'fileContent baseUrl=/',
    );
  });

  test('should create appropriate metadatas for empty baseUrl', async () => {
    const pluginContext = {
      outDir: '/tmp/someFixedOutDir',
      baseUrl: '',
    };
    const redirectFiles = toRedirectFilesMetadata(
      [{from: '/abc.html', to: '/abc'}],
      pluginContext,
    );
    expect(redirectFiles.map((f) => f.fileContent)).toMatchSnapshot(
      'fileContent baseUrl=empty',
    );
  });
});

describe('writeRedirectFiles', () => {
  test('write the files', async () => {
    const outDir = `/tmp/docusaurus_tests_${Math.random()}`;

    const filesMetadata = [
      {
        fileAbsolutePath: path.join(outDir, 'someFileName'),
        fileContent: 'content 1',
      },
      {
        fileAbsolutePath: path.join(outDir, '/some/nested/filename'),
        fileContent: 'content 2',
      },
    ];

    await writeRedirectFiles(filesMetadata);

    await expect(
      fs.readFile(filesMetadata[0].fileAbsolutePath, 'utf8'),
    ).resolves.toEqual('content 1');

    await expect(
      fs.readFile(filesMetadata[1].fileAbsolutePath, 'utf8'),
    ).resolves.toEqual('content 2');
  });

  test('avoid overwriting existing files', async () => {
    const outDir = `/tmp/docusaurus_tests_${Math.random()}`;

    const filesMetadata = [
      {
        fileAbsolutePath: path.join(outDir, 'someFileName/index.html'),
        fileContent: 'content 1',
      },
    ];

    await fs.ensureDir(path.dirname(filesMetadata[0].fileAbsolutePath));
    await fs.writeFile(
      filesMetadata[0].fileAbsolutePath,
      'file already exists!',
    );

    await expect(writeRedirectFiles(filesMetadata)).rejects.toThrowError(
      `Redirect file creation error for path=${filesMetadata[0].fileAbsolutePath}: Error: The redirect plugin is not supposed to override existing files`,
    );
  });
});
