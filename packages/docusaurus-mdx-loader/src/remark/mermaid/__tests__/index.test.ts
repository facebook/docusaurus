/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createCompiler} from '@mdx-js/mdx';
import mermaid from '..';

describe('mermaid remark plugin', () => {
  function createTestCompiler() {
    return createCompiler({
      remarkPlugins: [mermaid],
    });
  }

  it("does nothing if there's no mermaid code block", async () => {
    const mdxCompiler = createTestCompiler();
    const result = await mdxCompiler.process(
      `# Heading 1

No Mermaid diagram :(

\`\`\`js
this is not mermaid
\`\`\`
`,
    );
    expect(result.contents).toMatchSnapshot();
  });

  it('works for basic mermaid code blocks', async () => {
    const mdxCompiler = createTestCompiler();
    const result = await mdxCompiler.process(`# Heading 1

\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\``);
    expect(result.contents).toMatchSnapshot();
  });
});
