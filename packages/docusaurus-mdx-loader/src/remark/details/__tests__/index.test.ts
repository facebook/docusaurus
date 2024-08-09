/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import details from '..';

async function process(content: string) {
  const {remark} = await import('remark');

  const {default: mdx} = await import('remark-mdx');

  const result = await remark().use(mdx).use(details).process(content);

  return result.value;
}

describe('details remark plugin', () => {
  it("does nothing if there's no details", async () => {
    const input = `# Heading 1

Some content
`;
    const result = await process(input);
    expect(result).toEqual(result);
  });

  it('can convert details', async () => {
    const input = `# Details element example

<details>
  <summary>Toggle me!</summary>
  <div>
    <div>This is the detailed content</div>
    <br/>
    <details>
      <summary>
        Nested toggle! Some surprise inside...
      </summary>
      <div>
        😲😲😲😲😲
      </div>
    </details>
  </div>
</details>`;

    const result = await process(input);

    expect(result).toMatchInlineSnapshot(`
      "# Details element example

      <Details>
        <summary>Toggle me!</summary>

        <div>
          <div>This is the detailed content</div>

          <br />

          <Details>
            <summary>
              Nested toggle! Some surprise inside...
            </summary>

            <div>
              😲😲😲😲😲
            </div>
          </Details>
        </div>
      </Details>
      "
    `);
  });
});
