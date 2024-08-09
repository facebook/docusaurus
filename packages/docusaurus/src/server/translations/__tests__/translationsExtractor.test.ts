/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import fs from 'fs-extra';
import tmp from 'tmp-promise';
import {SRC_DIR_NAME} from '@docusaurus/utils';
import {
  extractSourceCodeFileTranslations,
  extractSiteSourceCodeTranslations,
} from '../translationsExtractor';
import {getBabelOptions} from '../../../webpack/utils';
import type {InitializedPlugin, LoadedPlugin} from '@docusaurus/types';

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

describe('extractSourceCodeFileTranslations', () => {
  it('throws for bad source code', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
const default => {

}
`,
    });

    const errorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      extractSourceCodeFileTranslations(sourceCodeFilePath, TestBabelOptions),
    ).rejects.toThrow();

    expect(errorMock).toHaveBeenCalledWith(
      expect.stringMatching(
        /Error while attempting to extract Docusaurus translations from source code file at/,
      ),
    );
  });

  it('extracts nothing from untranslated source code', async () => {
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

  it('extracts from a translate() functions calls', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
import {translate} from '@docusaurus/Translate';

export default function MyComponent() {
  return (
    <div>
      <input text={translate({id: 'codeId',message: 'code message',description: 'code description'})}/>

      <input text={translate({id: 'codeId1'})}/>
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
        codeId1: {message: 'codeId1'},
      },
      warnings: [],
    });
  });

  it('extracts from a <Translate> components', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
import Translate from '@docusaurus/Translate';

export default function MyComponent() {
  return (
    <div>
      <Translate id="codeId" description={"code description"}>
        code message
      </Translate>

      <Translate id="codeId1" description="description 2" />
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
        codeId1: {message: 'codeId1', description: 'description 2'},
      },
      warnings: [],
    });
  });

  it('extracts statically evaluable content', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
import Translate, {translate} from '@docusaurus/Translate';

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

  it('extracts from TypeScript file', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'tsx',
      content: `
import {translate} from '@docusaurus/Translate';

type ComponentProps<T> = {toto: string}

export default function MyComponent<T>(props: ComponentProps<T>) {
  return (
    <div>
      <input text={translate({id: 'codeId',message: 'code message',description: 'code description'}) as string}/>
      <input text={translate({message: 'code message 2',description: 'code description 2'}) as string}/>
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
        'code message 2': {
          message: 'code message 2',
          description: 'code description 2',
        },
      },
      warnings: [],
    });
  });

  it('does not extract from functions that is not docusaurus provided', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
import translate from 'a-lib';

export default function somethingElse() {
  const a = translate('foo');
  return <Translate>bar</Translate>
}
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

  it('does not extract from functions that is internal', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
function translate() {
  return 'foo'
}

export default function somethingElse() {
  const a = translate('foo');
  return a;
}
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

  it('recognizes aliased imports', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
import Foo, {translate as bar} from '@docusaurus/Translate';

export function MyComponent() {
  return (
    <div>
      <Foo id="codeId" description={"code description"}>
        code message
      </Foo>

      <Translate id="codeId1" />
    </div>
  );
}

export default function () {
  return (
    <div>
      <input text={translate({id: 'codeId',message: 'code message',description: 'code description'})}/>

      <input text={bar({id: 'codeId1'})}/>
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
        codeId: {
          description: 'code description',
          message: 'code message',
        },
        codeId1: {
          message: 'codeId1',
        },
      },
      warnings: [],
    });
  });

  it('recognizes aliased imports as string literal', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
import {'translate' as bar} from '@docusaurus/Translate';

export default function () {
  return (
    <div>
      <input text={translate({id: 'codeId',message: 'code message',description: 'code description'})}/>

      <input text={bar({id: 'codeId1'})}/>
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
        codeId1: {
          message: 'codeId1',
        },
      },
      warnings: [],
    });
  });

  it('warns about id if no children', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
import Translate from '@docusaurus/Translate';

export default function () {
  return (
    <Translate description="foo" />
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
      translations: {},
      warnings: [
        `<Translate> without children must have id prop.
Example: <Translate id="my-id" />
File: ${sourceCodeFilePath} at line 6
Full code: <Translate description="foo" />`,
      ],
    });
  });

  it('warns about dynamic id', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
import Translate from '@docusaurus/Translate';

export default function () {
  return (
    <Translate id={index}>foo</Translate>
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
        foo: {
          message: 'foo',
        },
      },
      warnings: [
        `<Translate> prop=id should be a statically evaluable object.
Example: <Translate id="optional id" description="optional description">Message</Translate>
Dynamically constructed values are not allowed, because they prevent translations to be extracted.
File: ${sourceCodeFilePath} at line 6
Full code: <Translate id={index}>foo</Translate>`,
      ],
    });
  });

  it('warns about dynamic children', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
import Translate from '@docusaurus/Translate';

export default function () {
  return (
    <Translate id='foo'><a>hhh</a></Translate>
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
      translations: {},
      warnings: [
        `Translate content could not be extracted. It has to be a static string and use optional but static props, like <Translate id="my-id" description="my-description">text</Translate>.
File: ${sourceCodeFilePath} at line 6
Full code: <Translate id='foo'><a>hhh</a></Translate>`,
      ],
    });
  });

  it('warns about dynamic translate argument', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
import {translate} from '@docusaurus/Translate';

translate(foo);
`,
    });

    const sourceCodeFileTranslations = await extractSourceCodeFileTranslations(
      sourceCodeFilePath,
      TestBabelOptions,
    );

    expect(sourceCodeFileTranslations).toEqual({
      sourceCodeFilePath,
      translations: {},
      warnings: [
        `translate() first arg should be a statically evaluable object.
Example: translate({message: "text",id: "optional.id",description: "optional description"}
Dynamically constructed values are not allowed, because they prevent translations to be extracted.
File: ${sourceCodeFilePath} at line 4
Full code: translate(foo)`,
      ],
    });
  });

  it('warns about too many arguments', async () => {
    const {sourceCodeFilePath} = await createTmpSourceCodeFile({
      extension: 'js',
      content: `
import {translate} from '@docusaurus/Translate';

translate({message: 'a'}, {a: 1}, 2);
`,
    });

    const sourceCodeFileTranslations = await extractSourceCodeFileTranslations(
      sourceCodeFilePath,
      TestBabelOptions,
    );

    expect(sourceCodeFileTranslations).toEqual({
      sourceCodeFilePath,
      translations: {},
      warnings: [
        `translate() function only takes 1 or 2 args
File: ${sourceCodeFilePath} at line 4
Full code: translate({
  message: 'a'
}, {
  a: 1
}, 2)`,
      ],
    });
  });
});

describe('extractSiteSourceCodeTranslations', () => {
  it('extracts translation from all plugins source code', async () => {
    const siteDir = await createTmpDir();

    const siteComponentFile1 = path.join(
      siteDir,
      SRC_DIR_NAME,
      'site-component-1.jsx',
    );
    await fs.outputFile(
      siteComponentFile1,
      `
import Translate from '@docusaurus/Translate';

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

    function createTestPlugin(pluginDir: string): InitializedPlugin {
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
    await fs.outputFile(
      plugin1File1,
      `
import {translate} from '@docusaurus/Translate';

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
    await fs.outputFile(
      plugin1File2,
      `
import {translate} from '@docusaurus/Translate';

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
    const plugin1File3 = path.join(plugin1Dir, 'ignoredFolder', 'file3.jsx');
    await fs.outputFile(
      plugin1File3,
      `
import {translate} from '@docusaurus/Translate';

export default function MyComponent() {
  return (
    <div>
      <input text={translate({id: 'plugin1Id3',message: 'plugin1 message 3',description: 'plugin1 description 3'})}/>
    </div>
  );
}
`,
    );

    const plugin1File4 = path.join(plugin1Dir, 'src/theme/file4.jsx');
    // Contains some invalid translations...
    await fs.outputFile(
      plugin1File4,
      `
import {translate} from '@docusaurus/Translate';

export default function MyComponent() {
  return (
    <div>
      <input text={translate({id: index})}/>
    </div>
  );
}
`,
    );
    const consoleWarnMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const plugin1 = createTestPlugin(plugin1Dir);

    const plugin2Dir = await createTmpDir();
    const plugin2File = path.join(plugin1Dir, 'subpath', 'file.tsx');
    await fs.outputFile(
      plugin2File,
      `
import Translate, {translate} from '@docusaurus/Translate';

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

    const plugins = [
      plugin1,
      plugin2,
      {name: 'dummy', options: {}, version: {type: 'synthetic'}} as const,
    ] as LoadedPlugin[];
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
    expect(consoleWarnMock.mock.calls[0]![0]).toMatch(
      /.*\[WARNING\].* Translation extraction warnings for file .*src.theme.file4\.jsx.*\n.*- translate\(\) first arg should be a statically evaluable object\./,
    );
  });
});
