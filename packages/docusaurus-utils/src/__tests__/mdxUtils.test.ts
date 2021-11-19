/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {mdxToHtml} from '../mdxUtils';

describe('mdxToHtml', () => {
  test('work with simple markdown', () => {
    const mdxString = `
# title

title text **bold**

## subtitle

subtitle text *italic*

> Quote

    `;

    expect(mdxToHtml(mdxString)).toMatchInlineSnapshot(
      `"<h1>title</h1><p>title text <strong>bold</strong></p><h2>subtitle</h2><p>subtitle text <em>italic</em></p><blockquote><p>Quote</p></blockquote>"`,
    );
  });

  test('work with MDX imports', () => {
    const mdxString = `
# title

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

text

    `;

    expect(mdxToHtml(mdxString)).toMatchInlineSnapshot(
      `"<h1>title</h1><p>text</p>"`,
    );
  });

  test('work with MDX exports', () => {
    const mdxString = `
# title

export const someExport = 42

export const MyLocalComponent = () => "result"

export const toc = [
  {id: "title",label: "title"}
]

text


    `;

    expect(mdxToHtml(mdxString)).toMatchInlineSnapshot(
      `"<h1>title</h1><p>text</p>"`,
    );
  });

  test('work with MDX Tabs', () => {
    const mdxString = `
# title

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="apple" label="Apple">
    This is an apple 🍎
  </TabItem>
  <TabItem value="orange" label="Orange">
    This is an orange 🍊
  </TabItem>
</Tabs>

text


    `;

    // TODO this is not an ideal behavior!
    // There is a warning "Component TabItem was not imported, exported, or provided by MDXProvider as global scope"
    // Theme + MDX config should provide a list of React components to put in MDX scope
    expect(mdxToHtml(mdxString)).toMatchInlineSnapshot(
      `"<h1>title</h1><div><div value=\\"apple\\" label=\\"Apple\\">This is an apple 🍎</div><div value=\\"orange\\" label=\\"Orange\\">This is an orange 🍊</div></div><p>text</p>"`,
    );
  });

  test('work with MDX Tabs with ```mdx-code-block', () => {
    const mdxString = `
# title

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

\`\`\`mdx-code-block
<Tabs>
  <TabItem value="apple" label="Apple">
    This is an apple 🍎
  </TabItem>
  <TabItem value="orange" label="Orange">
    This is an orange 🍊
  </TabItem>
</Tabs>
\`\`\`

text

    `;

    // TODO bad behavior!
    // ```mdx-code-block should be unwrapped and inner MDX content should be evaluated
    expect(mdxToHtml(mdxString)).toMatchInlineSnapshot(`
      "<h1>title</h1><pre><code class=\\"language-mdx-code-block\\">&lt;Tabs&gt;
        &lt;TabItem value=&quot;apple&quot; label=&quot;Apple&quot;&gt;
          This is an apple 🍎
        &lt;/TabItem&gt;
        &lt;TabItem value=&quot;orange&quot; label=&quot;Orange&quot;&gt;
          This is an orange 🍊
        &lt;/TabItem&gt;
      &lt;/Tabs&gt;
      </code></pre><p>text</p>"
    `);
  });
});
