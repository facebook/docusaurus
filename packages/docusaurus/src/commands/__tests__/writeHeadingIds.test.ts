/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {transformMarkdownContent} from '../writeHeadingIds';

describe('transformMarkdownContent', () => {
  it('works for simple level-2 heading', () => {
    expect(transformMarkdownContent('## ABC')).toEqual('## ABC {#abc}');
  });

  it('works for simple level-3 heading', () => {
    expect(transformMarkdownContent('### ABC')).toEqual('### ABC {#abc}');
  });

  it('works for simple level-4 heading', () => {
    expect(transformMarkdownContent('#### ABC')).toEqual('#### ABC {#abc}');
  });

  it('unwraps markdown links', () => {
    const input = `## hello [facebook](https://facebook.com) [crowdin](https://crowdin.com/translate/docusaurus-v2/126/en-fr?filter=basic&value=0)`;
    expect(transformMarkdownContent(input)).toEqual(
      `${input} {#hello-facebook-crowdin}`,
    );
  });

  it('can slugify complex headings', () => {
    const input = '## abc [Hello] How are you %Sébastien_-_$)( ## -56756';
    expect(transformMarkdownContent(input)).toEqual(
      `${input} {#abc-hello-how-are-you-sébastien_-_---56756}`,
    );
  });

  it('does not duplicate duplicate id', () => {
    expect(transformMarkdownContent('## hello world {#hello-world}')).toEqual(
      '## hello world {#hello-world}',
    );
  });

  it('respects existing heading', () => {
    expect(transformMarkdownContent('## New heading {#old-heading}')).toEqual(
      '## New heading {#old-heading}',
    );
  });

  it('overwrites heading ID when asked to', () => {
    expect(
      transformMarkdownContent('## New heading {#old-heading}', {
        overwrite: true,
      }),
    ).toEqual('## New heading {#new-heading}');
  });

  it('maintains casing when asked to', () => {
    expect(
      transformMarkdownContent('## getDataFromAPI()', {
        maintainCase: true,
      }),
    ).toEqual('## getDataFromAPI() {#getDataFromAPI}');
  });

  it('transform the headings', () => {
    const input = `

# Ignored title

## abc

### Hello world

\`\`\`
# Heading in code block
\`\`\`

## Hello world

    \`\`\`
    # Heading in escaped code block
    \`\`\`

### abc {#abc}

    `;

    const expected = `

# Ignored title

## abc {#abc-1}

### Hello world {#hello-world}

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
