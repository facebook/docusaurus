/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  transformMarkdownHeadingLine,
  transformMarkdownContent,
} from '../writeHeadingIds';
import GithubSlugger from 'github-slugger';

describe('transformMarkdownHeadingLine', () => {
  test('throws when not a heading', () => {
    expect(() =>
      transformMarkdownHeadingLine('ABC', new GithubSlugger()),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Line is not a markdown heading: ABC"`,
    );
  });

  test('works for simple level-2 heading', () => {
    expect(transformMarkdownHeadingLine('## ABC', new GithubSlugger())).toEqual(
      '## ABC {#abc}',
    );
  });

  test('works for simple level-3 heading', () => {
    expect(transformMarkdownHeadingLine('###ABC', new GithubSlugger())).toEqual(
      '###ABC {#abc}',
    );
  });

  test('works for simple level-4 heading', () => {
    expect(
      transformMarkdownHeadingLine('#### ABC', new GithubSlugger()),
    ).toEqual('#### ABC {#abc}');
  });

  test('works for simple level-2 heading', () => {
    expect(transformMarkdownHeadingLine('## ABC', new GithubSlugger())).toEqual(
      '## ABC {#abc}',
    );
  });

  test('unwraps markdown links', () => {
    const input = `## hello [facebook](https://facebook.com) [crowdin](https://crowdin.com/translate/docusaurus-v2/126/en-fr?filter=basic&value=0)`;
    expect(transformMarkdownHeadingLine(input, new GithubSlugger())).toEqual(
      `${input} {#hello-facebook-crowdin}`,
    );
  });

  test('can slugify complex headings', () => {
    const input = '## abc [Hello] How are you %Sébastien_-_$)( ## -56756';
    expect(transformMarkdownHeadingLine(input, new GithubSlugger())).toEqual(
      `${input} {#abc-hello-how-are-you-sébastien_-_---56756}`,
    );
  });

  test('does not duplicate duplicate id', () => {
    expect(
      transformMarkdownHeadingLine(
        '# hello world {#hello-world}',
        new GithubSlugger(),
      ),
    ).toEqual('# hello world {#hello-world}');
  });
});

describe('transformMarkdownContent', () => {
  test('transform the headings', () => {
    const input = `

# Hello world

## abc

\`\`\`
# Heading in code block
\`\`\`

## Hello world

    \`\`\`
    # Heading in escaped code block
    \`\`\`

### abc {#abc}

    `;

    // TODO the first heading should probably rather be slugified to abc-1
    // otherwise we end up with 2 x "abc" anchors
    // not sure how to implement that atm
    const expected = `

# Hello world {#hello-world}

## abc {#abc}

\`\`\`
# Heading in code block
\`\`\`

## Hello world {#hello-world-1}

    \`\`\`
    # Heading in escaped code block
    \`\`\`

### abc {#abc}

    `;

    expect(transformMarkdownContent(input)).toEqual(expected);
  });
});
