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
  extractSiteSourceCodeTranslations,
} from '../translationsExtractor';
import {getBabelOptions} from '../../../webpack/utils';
import path from 'path';
import {InitPlugin} from '../../plugins/init';
import {SRC_DIR_NAME} from '../../../constants';

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

describe('extractSiteSourceCodeTranslations', () => {
  test('should extract translation from all plugins source code', async () => {
    const siteDir = await createTmpDir();

    const siteComponentFile1 = path.join(
      siteDir,
      SRC_DIR_NAME,
      'site-component-1.jsx',
    );
    await fs.ensureDir(path.dirname(siteComponentFile1));
    await fs.writeFile(
      siteComponentFile1,
      `
export default function MySiteComponent1() {
  return (
      <Translate
        id="siteComponentFileId1"
        description="site component 1 desc"
      >
        site component 1 message
      </Translate>
  );
}
`,
    );

    function createTestPlugin(pluginDir: string): InitPlugin {
      // @ts-expect-error: good enough for this test
      return {
        name: 'abc',
        getPathsToWatch() {
          return [path.join(pluginDir, 'subpath', '**/*.{js,jsx,ts,tsx}')];
        },
        getThemePath() {
          return path.join(pluginDir, 'src', 'theme');
        },
      };
    }

    const plugin1Dir = await createTmpDir();
    const plugin1File1 = path.join(plugin1Dir, 'subpath', 'file1.jsx');
    await fs.ensureDir(path.dirname(plugin1File1));
    await fs.writeFile(
      plugin1File1,
      `
export default function MyComponent() {
  return (
    <div>
      <input
        text={translate(
          {id: 'plugin1Id1',message: 'plugin1 message 1',description: 'plugin1 description 1'},
          {someDynamicValue: 42}
        )}/>
    </div>
  );
}
`,
    );
    const plugin1File2 = path.join(plugin1Dir, 'src', 'theme', 'file2.jsx');
    await fs.ensureDir(path.dirname(plugin1File2));
    await fs.writeFile(
      plugin1File2,
      `
export default function MyComponent() {
  return (
    <div>
      <input text={translate({id: 'plugin1Id2',message: 'plugin1 message 2',description: 'plugin1 description 2'})}/>
    </div>
  );
}
`,
    );

    // This one should not be found! On purpose!
    const plugin1File3 = path.join(plugin1Dir, 'unscannedFolder', 'file3.jsx');
    await fs.ensureDir(path.dirname(plugin1File3));
    await fs.writeFile(
      plugin1File3,
      `
export default function MyComponent() {
  return (
    <div>
      <input text={translate({id: 'plugin1Id3',message: 'plugin1 message 3',description: 'plugin1 description 3'})}/>
    </div>
  );
}
`,
    );
    const plugin1 = createTestPlugin(plugin1Dir);

    const plugin2Dir = await createTmpDir();
    const plugin2File = path.join(plugin1Dir, 'subpath', 'file.tsx');
    await fs.ensureDir(path.dirname(plugin2File));
    await fs.writeFile(
      plugin2File,
      `
type Props = {hey: string};

export default function MyComponent(props: Props) {
  return (
    <div>
      <input text={translate({id: 'plugin2Id1',message: 'plugin2 message 1',description: 'plugin2 description 1'})}/>
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
    const translations = await extractSiteSourceCodeTranslations(
      siteDir,
      plugins,
      TestBabelOptions,
    );
    expect(translations).toEqual({
      siteComponentFileId1: {
        description: 'site component 1 desc',
        message: 'site component 1 message',
      },
      plugin1Id1: {
        description: 'plugin1 description 1',
        message: 'plugin1 message 1',
      },
      plugin1Id2: {
        description: 'plugin1 description 2',
        message: 'plugin1 message 2',
      },
      plugin2Id1: {
        description: 'plugin2 description 1',
        message: 'plugin2 message 1',
      },
      plugin2Id2: {
        description: 'plugin2 description 2',
        message: 'plugin2 message 2',
      },
    });
  });
});
