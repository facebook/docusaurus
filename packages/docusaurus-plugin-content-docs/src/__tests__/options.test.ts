/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validateOptions, DEFAULT_OPTIONS} from '../options';
import {normalizePluginOptions} from '@docusaurus/utils-validation';
import {DefaultSidebarItemsGenerator} from '../sidebars/generator';
import {
  DefaultNumberPrefixParser,
  DisabledNumberPrefixParser,
} from '../numberPrefix';
import {GlobExcludeDefault} from '@docusaurus/utils';
import type {Options} from '@docusaurus/plugin-content-docs';

// the type of remark/rehype plugins is function
const markdownPluginsFunctionStub = () => {};
const markdownPluginsObjectStub = {};

function testValidate(options: Options) {
  return validateOptions({validate: normalizePluginOptions, options});
}

const defaultOptions = {
  ...DEFAULT_OPTIONS,
  id: 'default',
  // The admonitions plugin is automatically added. Not really worth testing
  remarkPlugins: expect.any(Array),
};

describe('normalizeDocsPluginOptions', () => {
  it('returns default options for undefined user options', async () => {
    expect(testValidate({})).toEqual(defaultOptions);
  });

  it('accepts correctly defined user options', async () => {
    const userOptions = {
      path: 'my-docs', // Path to data on filesystem, relative to site dir.
      routeBasePath: 'my-docs', // URL Route.
      tagsBasePath: 'tags', // URL Tags Route.
      include: ['**/*.{md,mdx}'], // Extensions to include.
      exclude: GlobExcludeDefault,
      sidebarPath: 'my-sidebar', // Path to sidebar configuration for showing a list of markdown pages.
      sidebarItemsGenerator: DefaultSidebarItemsGenerator,
      numberPrefixParser: DefaultNumberPrefixParser,
      docLayoutComponent: '@theme/DocPage',
      docItemComponent: '@theme/DocItem',
      docTagDocListComponent: '@theme/DocTagDocListPage',
      docTagsListComponent: '@theme/DocTagsListPage',
      docCategoryGeneratedIndexComponent:
        '@theme/DocCategoryGeneratedIndexPage',
      remarkPlugins: [markdownPluginsObjectStub],
      rehypePlugins: [markdownPluginsFunctionStub],
      beforeDefaultRehypePlugins: [],
      beforeDefaultRemarkPlugins: [],
      breadcrumbs: true,
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
      admonitions: {},
      includeCurrentVersion: false,
      disableVersioning: true,
      editCurrentVersion: true,
      editLocalizedFiles: true,
      versions: {
        current: {
          path: 'next',
          label: 'next',
        },
        version1: {
          path: 'hello',
          label: 'world',
        },
      },
      sidebarCollapsible: false,
      sidebarCollapsed: false,
    };
    expect(testValidate(userOptions)).toEqual({
      ...defaultOptions,
      ...userOptions,
      remarkPlugins: [...userOptions.remarkPlugins, expect.any(Array)],
    });
  });

  it('accepts correctly defined remark and rehype plugin options', async () => {
    const userOptions = {
      beforeDefaultRemarkPlugins: [],
      beforeDefaultRehypePlugins: [markdownPluginsFunctionStub],
      remarkPlugins: [[markdownPluginsFunctionStub, {option1: '42'}]],
      rehypePlugins: [
        markdownPluginsObjectStub,
        [markdownPluginsFunctionStub, {option1: '42'}],
      ],
    };
    expect(testValidate(userOptions)).toEqual({
      ...defaultOptions,
      ...userOptions,
      remarkPlugins: [...userOptions.remarkPlugins, expect.any(Array)],
    });
  });

  it('accepts admonitions false', async () => {
    const admonitionsFalse = {
      admonitions: false,
    };
    expect(testValidate(admonitionsFalse)).toEqual({
      ...defaultOptions,
      ...admonitionsFalse,
    });
  });

  it('rejects admonitions true', async () => {
    const admonitionsTrue = {
      admonitions: true,
    };
    expect(() =>
      testValidate(admonitionsTrue),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"admonitions\\" contains an invalid value"`,
    );
  });

  it('accepts numberPrefixParser function', () => {
    function customNumberPrefixParser() {}
    expect(
      testValidate({numberPrefixParser: customNumberPrefixParser}),
    ).toEqual({
      ...defaultOptions,
      numberPrefixParser: customNumberPrefixParser,
    });
  });

  it('accepts numberPrefixParser false', () => {
    expect(testValidate({numberPrefixParser: false})).toEqual({
      ...defaultOptions,
      numberPrefixParser: DisabledNumberPrefixParser,
    });
  });

  it('accepts numberPrefixParser true', () => {
    expect(testValidate({numberPrefixParser: true})).toEqual({
      ...defaultOptions,
      numberPrefixParser: DefaultNumberPrefixParser,
    });
  });

  it('rejects invalid remark plugin options', () => {
    expect(() =>
      testValidate({
        remarkPlugins: [[{option1: '42'}, markdownPluginsFunctionStub]],
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"remarkPlugins[0]\\" does not match any of the allowed types"`,
    );
  });

  it('rejects invalid rehype plugin options', () => {
    expect(() =>
      testValidate({
        rehypePlugins: [
          [
            markdownPluginsFunctionStub,
            {option1: '42'},
            markdownPluginsFunctionStub,
          ],
        ],
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"rehypePlugins[0]\\" does not match any of the allowed types"`,
    );
  });

  it('rejects bad path inputs', () => {
    expect(() => testValidate({path: 2})).toThrowErrorMatchingInlineSnapshot(
      `"\\"path\\" must be a string"`,
    );
  });

  it('rejects bad include inputs', () => {
    expect(() =>
      testValidate({include: '**/*.{md,mdx}'}),
    ).toThrowErrorMatchingInlineSnapshot(`"\\"include\\" must be an array"`);
  });

  it('rejects bad showLastUpdateTime inputs', () => {
    expect(() =>
      testValidate({showLastUpdateTime: 'true'}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"showLastUpdateTime\\" must be a boolean"`,
    );
  });

  it('rejects bad remarkPlugins input', () => {
    expect(() =>
      testValidate({remarkPlugins: 'remark-math'}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"remarkPlugins\\" must be an array"`,
    );
  });

  it('rejects bad lastVersion', () => {
    expect(() =>
      testValidate({lastVersion: false}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"lastVersion\\" must be a string"`,
    );
  });

  it('rejects bad versions', () => {
    expect(() =>
      testValidate({
        versions: {
          current: {
            hey: 3,
          },
          version1: {
            path: 'hello',
            label: 'world',
          },
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"versions.current.hey\\" is not allowed"`,
    );
  });

  it('handles sidebarCollapsed option inconsistencies', () => {
    expect(
      testValidate({
        sidebarCollapsible: true,
        sidebarCollapsed: undefined,
      }).sidebarCollapsed,
    ).toBe(true);

    expect(
      testValidate({
        sidebarCollapsible: false,
        sidebarCollapsed: undefined,
      }).sidebarCollapsed,
    ).toBe(false);

    expect(
      testValidate({
        sidebarCollapsible: false,
        sidebarCollapsed: true,
      }).sidebarCollapsed,
    ).toBe(false);
  });
});
