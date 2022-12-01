/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import vfile from 'to-vfile';
// import mdx from 'remark-mdx';
// import remark from 'remark';
import dedent from 'dedent';
import npm2yarn from '../index';

const process = async (content: any, options?: {sync?: boolean}) => {
  // const mdx = await import('@mdx-js/mdx');
  const {remark} = await import('remark');
  const mdx = (await import('remark-mdx')).default;

  const result = await remark()
    .use(mdx)
    .use(npm2yarn, options)
    .process(content);

  return result.value;
};

const processFixture = async (name: string, options?: {sync?: boolean}) => {
  const filePath = path.join(__dirname, '__fixtures__', `${name}.md`);
  const file = await vfile.read(filePath);
  return process(file, options);
};

describe('npm2yarn plugin', () => {
  it('works with simple md', async () => {
    const result = await process(dedent`
    # Title

    Hey

    \`\`\`bash npm2yarn
    npm install test
    \`\`\`

    `);

    expect(result).toMatchInlineSnapshot(`
      "import Tabs from '@theme/Tabs'
      import TabItem from '@theme/TabItem'

      # Title

      Hey

      <Tabs>
        <TabItem value="npm">
          \`\`\`bash
          npm install test
          \`\`\`
        </TabItem>

        <TabItem value="yarn" label="Yarn">
          \`\`\`bash
          yarn add test
          \`\`\`
        </TabItem>
      </Tabs>
      "
    `);
  });

  it('works on installation file', async () => {
    const result = await processFixture('installation');

    expect(result).toMatchSnapshot();
  });

  it('works on plugin file', async () => {
    const result = await processFixture('plugin');

    expect(result).toMatchSnapshot();
  });

  it('works with sync option', async () => {
    const result = await processFixture('plugin', {sync: true});

    expect(result).toMatchSnapshot();
  });

  it('does not work when language is not set', async () => {
    const result = await processFixture('syntax-not-properly-set');

    expect(result).toMatchSnapshot();
  });

  it('does not re-import tabs components when already imported above', async () => {
    const result = await processFixture('import-tabs-above');

    expect(result).toMatchSnapshot();
  });

  it('does not re-import tabs components when already imported below', async () => {
    const result = await processFixture('import-tabs-below');

    expect(result).toMatchSnapshot();
  });

  it('does not re-import tabs components real-world multiple npm2yarn usage', async () => {
    const result = await processFixture('multiple');

    expect(result).toMatchSnapshot();
  });
});
