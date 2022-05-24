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

  it('no mermaid', async () => {
    const mdxCompiler = createTestCompiler();
    const result = await mdxCompiler.process(
      '# Heading 1\n\nNo Mermaid diagram :(',
    );
    expect(result.contents).toBe(
      '\n\n\nconst layoutProps = {\n  \n};\nconst MDXLayout = "wrapper"\nexport default function MDXContent({\n  components,\n  ...props\n}) {\n  return <MDXLayout {...layoutProps} {...props} components={components} mdxType="MDXLayout">\n    <h1>{`Heading 1`}</h1>\n    <p>{`No Mermaid diagram :(`}</p>\n    </MDXLayout>;\n}\n\n;\nMDXContent.isMDXComponent = true;',
    );
  });

  it('basic', async () => {
    const mdxCompiler = createTestCompiler();
    const result = await mdxCompiler.process(`# Heading 1\n
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\``);
    expect(result.contents).toBe(`


const layoutProps = {
${'  '}
};
const MDXLayout = "wrapper"
export default function MDXContent({
  components,
  ...props
}) {
  return <MDXLayout {...layoutProps} {...props} components={components} mdxType="MDXLayout">
    <h1>{\`Heading 1\`}</h1>
    <mermaid value={\`graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;\`} />
    </MDXLayout>;
}

;
MDXContent.isMDXComponent = true;`);
  });
});
