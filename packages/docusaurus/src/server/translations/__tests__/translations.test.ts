/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  ensureTranslationFileContent,
  writeTranslationFileContent,
  writePluginTranslations,
  readTranslationFileContent,
  WriteTranslationsOptions,
  localizePluginTranslationFile,
} from '../translations';
import fs from 'fs-extra';
import tmp from 'tmp-promise';
import {TranslationFile, TranslationFileContent} from '@docusaurus/types';
import path from 'path';

async function createTmpSiteDir() {
  const {path: siteDirPath} = await tmp.dir({
    prefix: 'jest-createTmpSiteDir',
  });
  return siteDirPath;
}

async function createTmpTranslationFile(
  content: TranslationFileContent | null,
) {
  const file = await tmp.file({
    prefix: 'jest-createTmpTranslationFile',
    postfix: '.json',
  });

  // null means we don't want a file, but tmp.file() creates an empty file :(
  if (content === null) {
    await fs.unlink(file.path);
  } else {
    await fs.writeFile(file.path, JSON.stringify(content, null, 2));
  }

  return {
    filePath: file.path,
    readFile: async () => JSON.parse(await fs.readFile(file.path, 'utf8')),
  };
}

describe('ensureTranslationFileContent', () => {
  test('should pass valid translation file content', () => {
    ensureTranslationFileContent({});
    ensureTranslationFileContent({key1: {message: ''}});
    ensureTranslationFileContent({key1: {message: 'abc'}});
    ensureTranslationFileContent({key1: {message: 'abc', description: 'desc'}});
    ensureTranslationFileContent({
      key1: {message: 'abc', description: 'desc'},
      key2: {message: 'def', description: 'desc'},
    });
  });

  test('should fail for invalid translation file content', () => {
    expect(() =>
      ensureTranslationFileContent(null),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"value\\" must be of type object"`,
    );
    expect(() =>
      ensureTranslationFileContent(undefined),
    ).toThrowErrorMatchingInlineSnapshot(`"\\"value\\" is required"`);
    expect(() =>
      ensureTranslationFileContent('HEY'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"value\\" must be of type object"`,
    );
    expect(() =>
      ensureTranslationFileContent(42),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"value\\" must be of type object"`,
    );
    expect(() =>
      ensureTranslationFileContent({key: {description: 'no message'}}),
    ).toThrowErrorMatchingInlineSnapshot(`"\\"key.message\\" is required"`);
    expect(() =>
      ensureTranslationFileContent({key: {message: 42}}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"key.message\\" must be a string"`,
    );
    expect(() =>
      ensureTranslationFileContent({
        key: {message: 'Message', description: 42},
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"key.description\\" must be a string"`,
    );
  });
});

describe('writeTranslationFileContent', () => {
  test('should create new translation file', async () => {
    const {filePath, readFile} = await createTmpTranslationFile(null);

    await writeTranslationFileContent({
      filePath,
      content: {
        key1: {message: 'key1 message'},
        key2: {message: 'key2 message'},
        key3: {message: 'key3 message'},
      },
    });

    expect(await readFile()).toEqual({
      key1: {message: 'key1 message'},
      key2: {message: 'key2 message'},
      key3: {message: 'key3 message'},
    });
  });

  test('should create new translation file with prefix', async () => {
    const {filePath, readFile} = await createTmpTranslationFile(null);

    await writeTranslationFileContent({
      filePath,
      content: {
        key1: {message: 'key1 message'},
        key2: {message: 'key2 message'},
        key3: {message: 'key3 message'},
      },
      options: {
        messagePrefix: 'PREFIX ',
      },
    });

    expect(await readFile()).toEqual({
      key1: {message: 'PREFIX key1 message'},
      key2: {message: 'PREFIX key2 message'},
      key3: {message: 'PREFIX key3 message'},
    });
  });

  test('should append missing translations', async () => {
    const {filePath, readFile} = await createTmpTranslationFile({
      key1: {message: 'key1 message'},
      key2: {message: 'key2 message'},
      key3: {message: 'key3 message'},
    });

    await writeTranslationFileContent({
      filePath,
      content: {
        key1: {message: 'key1 message new'},
        key2: {message: 'key2 message new'},
        key3: {message: 'key3 message new'},
        key4: {message: 'key4 message new'},
      },
    });

    expect(await readFile()).toEqual({
      key1: {message: 'key1 message'},
      key2: {message: 'key2 message'},
      key3: {message: 'key3 message'},
      key4: {message: 'key4 message new'},
    });
  });

  test('should append missing translations with prefix', async () => {
    const {filePath, readFile} = await createTmpTranslationFile({
      key1: {message: 'key1 message'},
    });

    await writeTranslationFileContent({
      filePath,
      content: {
        key1: {message: 'key1 message new'},
        key2: {message: 'key2 message new'},
      },
      options: {
        messagePrefix: 'PREFIX ',
      },
    });

    expect(await readFile()).toEqual({
      key1: {message: 'key1 message'},
      key2: {message: 'PREFIX key2 message new'},
    });
  });

  test('should override missing translations', async () => {
    const {filePath, readFile} = await createTmpTranslationFile({
      key1: {message: 'key1 message'},
    });

    await writeTranslationFileContent({
      filePath,
      content: {
        key1: {message: 'key1 message new'},
        key2: {message: 'key2 message new'},
      },
      options: {
        override: true,
      },
    });

    expect(await readFile()).toEqual({
      key1: {message: 'key1 message new'},
      key2: {message: 'key2 message new'},
    });
  });

  test('should override missing translations with prefix', async () => {
    const {filePath, readFile} = await createTmpTranslationFile({
      key1: {message: 'key1 message'},
    });

    await writeTranslationFileContent({
      filePath,
      content: {
        key1: {message: 'key1 message new'},
        key2: {message: 'key2 message new'},
      },
      options: {
        override: true,
        messagePrefix: 'PREFIX ',
      },
    });

    expect(await readFile()).toEqual({
      key1: {message: 'PREFIX key1 message new'},
      key2: {message: 'PREFIX key2 message new'},
    });
  });

  test('should always override message description', async () => {
    const {filePath, readFile} = await createTmpTranslationFile({
      key1: {message: 'key1 message', description: 'key1 desc'},
      key2: {message: 'key2 message', description: 'key2 desc'},
      key3: {message: 'key3 message', description: undefined},
    });

    await writeTranslationFileContent({
      filePath,
      content: {
        key1: {message: 'key1 message new', description: undefined},
        key2: {message: 'key2 message new', description: 'key2 desc new'},
        key3: {message: 'key3 message new', description: 'key3 desc new'},
      },
    });

    expect(await readFile()).toEqual({
      key1: {message: 'key1 message', description: undefined},
      key2: {message: 'key2 message', description: 'key2 desc new'},
      key3: {message: 'key3 message', description: 'key3 desc new'},
    });
  });

  test('should always override message description', async () => {
    const {filePath} = await createTmpTranslationFile(
      // @ts-expect-error: bad content on purpose
      {bad: 'content'},
    );

    await expect(
      writeTranslationFileContent({
        filePath,
        content: {
          key1: {message: 'key1 message'},
        },
      }),
    ).rejects.toThrowError(/Invalid translation file at path/);
  });
});

describe('writePluginTranslations', () => {
  test('should write plugin translations', async () => {
    const siteDir = await createTmpSiteDir();

    const filePath = path.join(
      siteDir,
      'i18n',
      'fr',
      'my-plugin-name',
      'my/translation/file.json',
    );

    await writePluginTranslations({
      siteDir,
      locale: 'fr',
      translationFile: {
        path: 'my/translation/file',
        content: {
          key1: {message: 'key1 message'},
          key2: {message: 'key2 message'},
          key3: {message: 'key3 message'},
        },
      },
      // @ts-expect-error: enough for this test
      plugin: {
        name: 'my-plugin-name',
        options: {
          id: undefined,
        },
      },
    });

    expect(await readTranslationFileContent(filePath)).toEqual({
      key1: {message: 'key1 message'},
      key2: {message: 'key2 message'},
      key3: {message: 'key3 message'},
    });
  });

  test('should write plugin translations consecutively with different options', async () => {
    const siteDir = await createTmpSiteDir();

    const filePath = path.join(
      siteDir,
      'i18n',
      'fr',
      'my-plugin-name-my-plugin-id',
      'my/translation/file.json',
    );

    function doWritePluginTranslations(
      content: TranslationFileContent,
      options?: WriteTranslationsOptions,
    ) {
      return writePluginTranslations({
        siteDir,
        locale: 'fr',
        translationFile: {
          path: 'my/translation/file',
          content,
        },
        // @ts-expect-error: enough for this test
        plugin: {
          name: 'my-plugin-name',
          options: {
            id: 'my-plugin-id',
          },
        },
        options,
      });
    }

    expect(await readTranslationFileContent(filePath)).toEqual(undefined);

    await doWritePluginTranslations({
      key1: {message: 'key1 message', description: 'key1 desc'},
      key2: {message: 'key2 message', description: 'key2 desc'},
      key3: {message: 'key3 message', description: 'key3 desc'},
    });
    expect(await readTranslationFileContent(filePath)).toEqual({
      key1: {message: 'key1 message', description: 'key1 desc'},
      key2: {message: 'key2 message', description: 'key2 desc'},
      key3: {message: 'key3 message', description: 'key3 desc'},
    });

    await doWritePluginTranslations(
      {
        key3: {message: 'key3 message 2'},
        key4: {message: 'key4 message 2', description: 'key4 desc'},
      },
      {messagePrefix: 'PREFIX '},
    );
    expect(await readTranslationFileContent(filePath)).toEqual({
      key1: {message: 'key1 message', description: 'key1 desc'},
      key2: {message: 'key2 message', description: 'key2 desc'},
      key3: {message: 'key3 message', description: undefined},
      key4: {message: 'PREFIX key4 message 2', description: 'key4 desc'},
    });

    await doWritePluginTranslations(
      {
        key1: {message: 'key1 message 3', description: 'key1 desc'},
        key2: {message: 'key2 message 3', description: 'key2 desc'},
        key3: {message: 'key3 message 3', description: 'key3 desc'},
        key4: {message: 'key4 message 3', description: 'key4 desc'},
      },
      {messagePrefix: 'PREFIX ', override: true},
    );
    expect(await readTranslationFileContent(filePath)).toEqual({
      key1: {message: 'PREFIX key1 message 3', description: 'key1 desc'},
      key2: {message: 'PREFIX key2 message 3', description: 'key2 desc'},
      key3: {message: 'PREFIX key3 message 3', description: 'key3 desc'},
      key4: {message: 'PREFIX key4 message 3', description: 'key4 desc'},
    });
  });
});

describe('localizePluginTranslationFile', () => {
  test('not localize if localized file does not exist', async () => {
    const siteDir = await createTmpSiteDir();

    const translationFile: TranslationFile = {
      path: 'my/translation/file',
      content: {
        key1: {message: 'key1 message'},
        key2: {message: 'key2 message'},
        key3: {message: 'key3 message'},
      },
    };

    const localizedTranslationFile = await localizePluginTranslationFile({
      siteDir,
      locale: 'fr',
      translationFile,
      // @ts-expect-error: enough for this test
      plugin: {
        name: 'my-plugin-name',
        options: {},
      },
    });

    expect(localizedTranslationFile).toEqual(translationFile);
  });

  test('not localize if localized file does not exist', async () => {
    const siteDir = await createTmpSiteDir();

    await writeTranslationFileContent({
      filePath: path.join(
        siteDir,
        'i18n',
        'fr',
        'my-plugin-name',
        'my/translation/file.json',
      ),
      content: {
        key2: {message: 'key2 message localized'},
        key4: {message: 'key4 message localized'},
      },
    });

    const translationFile: TranslationFile = {
      path: 'my/translation/file',
      content: {
        key1: {message: 'key1 message'},
        key2: {message: 'key2 message'},
        key3: {message: 'key3 message'},
      },
    };

    const localizedTranslationFile = await localizePluginTranslationFile({
      siteDir,
      locale: 'fr',
      translationFile,
      // @ts-expect-error: enough for this test
      plugin: {
        name: 'my-plugin-name',
        options: {},
      },
    });

    expect(localizedTranslationFile).toEqual({
      path: translationFile.path,
      content: {
        // We only append/override localized messages, but never delete the data of the unlocalized translation file
        // This ensures that all required keys are present when trying to read the translations files
        key1: {message: 'key1 message'},
        key2: {message: 'key2 message localized'},
        key3: {message: 'key3 message'},
        key4: {message: 'key4 message localized'},
      },
    });
  });
});
