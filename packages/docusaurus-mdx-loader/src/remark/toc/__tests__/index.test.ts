/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {join} from 'path';
import remark from 'remark';
import mdx from 'remark-mdx';
import vfile from 'to-vfile';
import plugin from '../index';
import headings from '../../headings/index';

const processFixture = async (name, options?) => {
  const path = join(__dirname, 'fixtures', `${name}.md`);
  const file = await vfile.read(path);
  const result = await remark()
    .use(headings)
    .use(mdx)
    .use(plugin, options)
    .process(file);

  return result.toString();
};

test('non text phrasing content', async () => {
  const result = await processFixture('non-text-content');
  expect(result).toMatchSnapshot();
});

test('inline code should be escaped', async () => {
  const result = await processFixture('inline-code');
  expect(result).toMatchSnapshot();
});

test('text content', async () => {
  const result = await processFixture('just-content');
  expect(result).toMatchInlineSnapshot(`
    "export const toc = [
    	{
    		value: 'Endi',
    		id: 'endi',
    		children: [],
    		level: 3
    	},
    	{
    		value: 'Endi',
    		id: 'endi-1',
    		children: [
    			{
    				value: 'Yangshun',
    				id: 'yangshun',
    				children: [],
    				level: 3
    			}
    		],
    		level: 2
    	},
    	{
    		value: 'I ♥ unicode.',
    		id: 'i--unicode',
    		children: [],
    		level: 2
    	}
    ];

    ### Endi

    \`\`\`md
    ## This is ignored
    \`\`\`

    ## Endi

    Lorem ipsum

    ### Yangshun

    Some content here

    ## I ♥ unicode.
    "
  `);
});

test('should export even with existing name', async () => {
  const result = await processFixture('name-exist');
  expect(result).toMatchInlineSnapshot(`
    "export const toc = [
    	{
    		value: 'Thanos',
    		id: 'thanos',
    		children: [],
    		level: 2
    	},
    	{
    		value: 'Tony Stark',
    		id: 'tony-stark',
    		children: [
    			{
    				value: 'Avengers',
    				id: 'avengers',
    				children: [],
    				level: 3
    			}
    		],
    		level: 2
    	}
    ];

    ## Thanos

    ## Tony Stark

    ### Avengers
    "
  `);
});

test('should export with custom name', async () => {
  const options = {
    name: 'customName',
  };
  const result = await processFixture('just-content', options);
  expect(result).toMatchInlineSnapshot(`
    "export const customName = [
    	{
    		value: 'Endi',
    		id: 'endi',
    		children: [],
    		level: 3
    	},
    	{
    		value: 'Endi',
    		id: 'endi-1',
    		children: [
    			{
    				value: 'Yangshun',
    				id: 'yangshun',
    				children: [],
    				level: 3
    			}
    		],
    		level: 2
    	},
    	{
    		value: 'I ♥ unicode.',
    		id: 'i--unicode',
    		children: [],
    		level: 2
    	}
    ];

    ### Endi

    \`\`\`md
    ## This is ignored
    \`\`\`

    ## Endi

    Lorem ipsum

    ### Yangshun

    Some content here

    ## I ♥ unicode.
    "
  `);
});

test('should insert below imports', async () => {
  const result = await processFixture('insert-below-imports');
  expect(result).toMatchInlineSnapshot(`
    "import something from 'something';

    import somethingElse from 'something-else';

    export const toc = [
    	{
    		value: 'Title',
    		id: 'title',
    		children: [],
    		level: 2
    	},
    	{
    		value: 'Test',
    		id: 'test',
    		children: [
    			{
    				value: 'Again',
    				id: 'again',
    				children: [],
    				level: 3
    			}
    		],
    		level: 2
    	}
    ];

    ## Title

    ## Test

    ### Again

    Content.
    "
  `);
});

test('empty headings', async () => {
  const result = await processFixture('empty-headings');
  expect(result).toMatchInlineSnapshot(`
    "export const toc = [];

    # Ignore this

    ## 

    ## ![](an-image.svg)
    "
  `);
});
