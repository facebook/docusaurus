/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import _ from 'lodash';
import {DEFAULT_PARSE_FRONT_MATTER} from '@docusaurus/utils';
import {compileToJSX} from '../utils';
import type {Options} from '../options';
import type {Root} from 'mdast';
import type {Plugin} from 'unified';
import type {DeepPartial} from 'utility-types';

function createOptions(overrides: DeepPartial<Options> = {}): Options {
  const defaults: Options = {
    siteDir: __dirname,
    staticDirs: [],
    admonitions: true,
    markdownConfig: {
      format: 'mdx',
      parseFrontMatter: DEFAULT_PARSE_FRONT_MATTER,
      mermaid: false,
      emoji: true,
      mdx1Compat: {comments: true, admonitions: true, headingIds: true},
      anchors: {maintainCase: false},
      remarkRehypeOptions: undefined,
      hooks: {
        onBrokenMarkdownLinks: 'throw',
        onBrokenMarkdownImages: 'throw',
        onUnusedMarkdownDirectives: 'throw',
      },
    },
  };
  return _.merge({}, defaults, overrides);
}

function processContent(content: string, options: Options) {
  return compileToJSX({
    fileContent: content,
    filePath: `${__dirname}/document.md`,
    frontMatter: {},
    compilerName: 'client',
    options,
  });
}

describe('MDX processor', () => {
  describe.each(['md', 'mdx'] as const)('%s format', (format) => {
    it('compiles GFM tables', async () => {
      const options = createOptions({markdownConfig: {format}});
      const result = await processContent(
        '| a | b |\n| - | - |\n| c | d |',
        options,
      );
      expect(result.content).toMatchSnapshot();
    });

    it('extracts the content title', async () => {
      const options = createOptions({markdownConfig: {format}});
      const result = await processContent('# Title', options);
      expect(result.data.contentTitle).toBe('Title');
    });

    it('exports the table of contents', async () => {
      const options = createOptions({markdownConfig: {format}});
      const result = await processContent('## Heading', options);
      expect(result.content).toMatchSnapshot();
    });

    it('reuses the processor when compiling files concurrently', async () => {
      let pluginInitializations = 0;
      const asyncPlugin: Plugin<[], Root> = () => {
        pluginInitializations += 1;
        return async (_tree, file) => {
          await new Promise<void>((resolve) => setImmediate(resolve));
          file.data.asyncPluginContent = file.toString();
        };
      };
      const options = createOptions({
        markdownConfig: {format},
        remarkPlugins: [asyncPlugin],
      });

      const results = await Promise.all([
        processContent('First document', options),
        processContent('Second document', options),
      ]);

      expect(pluginInitializations).toBe(1);
      expect(results.map((result) => result.data.asyncPluginContent)).toEqual([
        'First document',
        'Second document',
      ]);
    });
  });

  it.each([true, false])('supports emoji=%s', async (emoji) => {
    const options = createOptions({markdownConfig: {emoji}});
    const result = await processContent(
      'Hello :smile: :unknown_shortcode:',
      options,
    );
    expect(result.content).toMatchSnapshot();
  });

  it('awaits async user plugins', async () => {
    const asyncPlugin: Plugin<[], Root> = () => async (_tree, file) => {
      await new Promise<void>((resolve) => setImmediate(resolve));
      file.data.asyncPluginCompleted = true;
    };
    const options = createOptions({remarkPlugins: [asyncPlugin]});
    const result = await processContent('Content', options);
    expect(result.data.asyncPluginCompleted).toBe(true);
  });

  it('preserves legacy comments', async () => {
    const options = createOptions();
    const result = await processContent('<!-- hidden comment -->', options);
    expect(result.content).toMatchSnapshot();
  });

  it('preserves legacy heading IDs', async () => {
    const options = createOptions();
    const result = await processContent('## Heading {#custom-id}', options);
    expect(result.content).toMatchSnapshot();
  });

  it('preserves legacy admonition titles', async () => {
    const options = createOptions();
    const result = await processContent(
      ':::note Custom title\nBody\n:::',
      options,
    );
    expect(result.content).toMatchSnapshot();
  });

  it('preserves raw HTML in CommonMark', async () => {
    const options = createOptions({markdownConfig: {format: 'md'}});
    const result = await processContent(
      '<div class="custom">HTML content</div>',
      options,
    );
    expect(result.content).toMatchSnapshot();
  });

  describe('remarkMdxOptions', () => {
    // See https://github.com/mdx-js/mdx/issues/2628
    const importAttributes = `import text from './file.txt' with {type: 'text'};

{text}`;

    it('parses import attributes by default (ES2025)', async () => {
      const options = createOptions({markdownConfig: {format: 'mdx'}});
      const result = await processContent(importAttributes, options);
      expect(result.content).toMatchSnapshot();
    });

    it('can downgrade to ES2024', async () => {
      const options = createOptions({
        markdownConfig: {format: 'mdx'},
        remarkMdxOptions: {
          acornOptions: {ecmaVersion: 2024, sourceType: 'module'},
        },
      });
      await expect(processContent(importAttributes, options)).rejects.toThrow(
        /Could not parse import\/exports with acorn/,
      );
    });

    it('does not apply to the md format', async () => {
      const options = createOptions({markdownConfig: {format: 'md'}});
      const result = await processContent(importAttributes, options);
      expect(result.content).toMatchSnapshot();
    });
  });
});
