/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import fs from 'fs-extra';
import tmp from 'tmp-promise';
import {getBabelOptions} from '../utils';
import {extractSourceCodeFileTranslations} from '../babelTranslationsExtractor';

const TestBabelOptions = getBabelOptions({
  isServer: true,
});

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
