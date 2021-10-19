/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import tmp from 'tmp-promise';
import {
  extractSourceCodeFileTranslations,
  extractPluginsSourceCodeTranslations,
} from '../translationsExtractor';
import {getBabelOptions} from '../../../webpack/utils';
import path from 'path';
import {InitPlugin} from '../../plugins/init';

const TestBabelOptions = getBabelOptions({
  isServer: true,
});

async function createTmpDir() {
  const {path: siteDirPath} = await tmp.dir({
    prefix: 'jest-createTmpSiteDir',
  });
  return siteDirPath;
}

async function createTmpSourceCodeFile({
  extension,
  content,
}: {
  extension: string;
  content: string;
}) {
  const file = await tmp.file({
    prefix: 'jest-createTmpSourceCodeFile',
    postfix: `.${extension}`,
  });

  await fs.writeFile(file.path, content);

  return {
    sourceCodeFilePath: file.path,
  };
}

describe('extractSourceCodeTranslations', () => {
  test('throw for bad source code', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
const default => {

}
`,
    });

    await expect(
      extractSourceCodeFileTranslations(sourceCodeFilePath, TestBabelOptions),
    ).rejects.toThrowError(
      /Error while attempting to extract Docusaurus translations from source code file at path/,
    );
  });

  test('extract nothing from untranslated source code', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
const unrelated =  42;
`,
    });

    const sourceCodeFileTranslations = await extractSourceCodeFileTranslations(
      sourceCodeFilePath,
      TestBabelOptions,
    );

    expect(sourceCodeFileTranslations).toEqual({
      sourceCodeFilePath,
      translations: {},
      warnings: [],
    });
  });

  test('extract from a translate() function call', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
export default function MyComponent() {
  return (
    <div>
      <input text={translate({id: 'codeId',message: 'code message',description: 'code description'})}/>
    </div>
  );
}
`,
    });

    const sourceCodeFileTranslations = await extractSourceCodeFileTranslations(
      sourceCodeFilePath,
      TestBabelOptions,
    );

    expect(sourceCodeFileTranslations).toEqual({
      sourceCodeFilePath,
      translations: {
        codeId: {message: 'code message', description: 'code description'},
      },
      warnings: [],
    });
  });

  test('extract from a <Translate> component', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
export default function MyComponent() {
  return (
    <div>
      <Translate id="codeId" description={"code description"}>
        code message
      </Translate>
    </div>
  );
}
`,
    });

    const sourceCodeFileTranslations = await extractSourceCodeFileTranslations(
      sourceCodeFilePath,
      TestBabelOptions,
    );

    expect(sourceCodeFileTranslations).toEqual({
      sourceCodeFilePath,
      translations: {
        codeId: {message: 'code message', description: 'code description'},
      },
      warnings: [],
    });
  });

  test('extract statically evaluable content', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
const prefix = "prefix ";

export default function MyComponent() {
  return (
    <div>
      <input
        text={translate({
          id: prefix + 'codeId fn',
          message: prefix + 'code message',
          description: prefix + 'code description'}
        )}
      />
      <Translate
        id={prefix + "codeId comp"}
        description={prefix + "code description"}
      >
      {prefix + "code message"}
      </Translate>
      <Translate>

        {

          prefix + \`Static template literal with unusual formatting!\`
        }
      </Translate>
    </div>
  );
}
`,
    });

    const sourceCodeFileTranslations = await extractSourceCodeFileTranslations(
      sourceCodeFilePath,
      TestBabelOptions,
    );

    expect(sourceCodeFileTranslations).toEqual({
      sourceCodeFilePath,
      translations: {
        'prefix codeId comp': {
          message: 'prefix code message',
          description: 'prefix code description',
        },
        'prefix codeId fn': {
          message: 'prefix code message',
          description: 'prefix code description',
        },
        'prefix Static template literal with unusual formatting!': {
          message: 'prefix Static template literal with unusual formatting!',
        },
      },
      warnings: [],
    });
  });

  test('extract from TypeScript file', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'tsx',
      content: `
type ComponentProps<T> = {toto: string}

export default function MyComponent<T>(props: ComponentProps<T>) {
  return (
    <div>
      <input text={translate({id: 'codeId',message: 'code message',description: 'code description'}) as string}/>
    </div>
  );
}
`,
    });

    const sourceCodeFileTranslations = await extractSourceCodeFileTranslations(
      sourceCodeFilePath,
      TestBabelOptions,
    );

    expect(sourceCodeFileTranslations).toEqual({
      sourceCodeFilePath,
      translations: {
        codeId: {message: 'code message', description: 'code description'},
      },
      warnings: [],
    });
  });
});

describe('extractPluginsSourceCodeTranslations', () => {
  test('should extract translation from all plugins source code', async () => {
    function createTestPlugin(pluginDir: string): InitPlugin {
      // @ts-expect-error: good enough for this test
      return {
        name: 'abc',
        getPathsToWatch() {
          return [path.join(pluginDir, '**/*.{js,jsx,ts,tsx}')];
        },
      };
    }

    const plugin1Dir = await createTmpDir();
    const plugin1File = path.join(plugin1Dir, 'file.jsx');
    await fs.ensureDir(path.dirname(plugin1File));
    await fs.writeFile(
      plugin1File,
      `
export default function MyComponent() {
  return (
    <div>
      <input text={translate({id: 'plugin1Id',message: 'plugin1 message',description: 'plugin1 description'})}/>
    </div>
  );
}
`,
    );
    const plugin1 = createTestPlugin(plugin1Dir);

    const plugin2Dir = await createTmpDir();
    const plugin2File = path.join(plugin1Dir, 'sub', 'path', 'file.tsx');
    await fs.ensureDir(path.dirname(plugin2File));
    await fs.writeFile(
      plugin2File,
      `
type Props = {hey: string};

export default function MyComponent(props: Props) {
  return (
    <div>
      <input text={translate({id: 'plugin2Id',message: 'plugin2 message',description: 'plugin2 description'})}/>
      <Translate
        id="plugin2Id2"
        description="plugin2 description 2"
      >
        plugin2 message 2
      </Translate>
    </div>
  );
}
`,
    );
    const plugin2 = createTestPlugin(plugin2Dir);

    const plugins = [plugin1, plugin2];
    const translations = await extractPluginsSourceCodeTranslations(
      plugins,
      TestBabelOptions,
    );
    expect(translations).toEqual({
      plugin1Id: {
        description: 'plugin1 description',
        message: 'plugin1 message',
      },
      plugin2Id: {
        description: 'plugin2 description',
        message: 'plugin2 message',
      },
      plugin2Id2: {
        description: 'plugin2 description 2',
        message: 'plugin2 message 2',
      },
    });
  });
});
