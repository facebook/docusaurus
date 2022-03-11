/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {OptionsSchema, DEFAULT_OPTIONS, validateOptions} from '../options';
import {normalizePluginOptions} from '@docusaurus/utils-validation';
import {DefaultSidebarItemsGenerator} from '../sidebars/generator';
import {
  DefaultNumberPrefixParser,
  DisabledNumberPrefixParser,
} from '../numberPrefix';
import {GlobExcludeDefault} from '@docusaurus/utils';
import type {PluginOptions} from '@docusaurus/plugin-content-docs';

// the type of remark/rehype plugins is function
const markdownPluginsFunctionStub = () => {};
const markdownPluginsObjectStub = {};

function testValidateOptions(options: Partial<PluginOptions>) {
  return validateOptions({
    options: {
      ...DEFAULT_OPTIONS,
      ...options,
    },
    validate: normalizePluginOptions,
  });
}

describe('normalizeDocsPluginOptions', () => {
  it('returns default options for undefined user options', async () => {
    const {value, error} = await OptionsSchema.validate({});
    expect(value).toEqual(DEFAULT_OPTIONS);
    expect(error).toBe(undefined);
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
    const {value, error} = await OptionsSchema.validate(userOptions);
    expect(value).toEqual(userOptions);
    expect(error).toBe(undefined);
  });

  it('accepts correctly defined remark and rehype plugin options', async () => {
    const userOptions = {
      ...DEFAULT_OPTIONS,
      beforeDefaultRemarkPlugins: [],
      beforeDefaultRehypePlugins: [markdownPluginsFunctionStub],
      remarkPlugins: [[markdownPluginsFunctionStub, {option1: '42'}]],
      rehypePlugins: [
        markdownPluginsObjectStub,
        [markdownPluginsFunctionStub, {option1: '42'}],
      ],
    };
    const {value, error} = await OptionsSchema.validate(userOptions);
    expect(value).toEqual(userOptions);
    expect(error).toBe(undefined);
  });

  it('accepts admonitions false', async () => {
    const admonitionsFalse = {
      ...DEFAULT_OPTIONS,
      admonitions: false,
    };
    const {value, error} = OptionsSchema.validate(admonitionsFalse);
    expect(value).toEqual(admonitionsFalse);
    expect(error).toBe(undefined);
  });

  it('accepts numberPrefixParser function', () => {
    function customNumberPrefixParser() {}
    expect(
      normalizePluginOptions(OptionsSchema, {
        ...DEFAULT_OPTIONS,
        numberPrefixParser: customNumberPrefixParser,
      }),
    ).toEqual({
      ...DEFAULT_OPTIONS,
      id: 'default',
      numberPrefixParser: customNumberPrefixParser,
    });
  });

  it('accepts numberPrefixParser false', () => {
    expect(
      normalizePluginOptions(OptionsSchema, {
        ...DEFAULT_OPTIONS,
        numberPrefixParser: false,
      }),
    ).toEqual({
      ...DEFAULT_OPTIONS,
      id: 'default',
      numberPrefixParser: DisabledNumberPrefixParser,
    });
  });

  it('accepts numberPrefixParser true', () => {
    expect(
      normalizePluginOptions(OptionsSchema, {
        ...DEFAULT_OPTIONS,
        numberPrefixParser: true,
      }),
    ).toEqual({
      ...DEFAULT_OPTIONS,
      id: 'default',
      numberPrefixParser: DefaultNumberPrefixParser,
    });
  });

  it('rejects admonitions true', async () => {
    const admonitionsTrue = {
      ...DEFAULT_OPTIONS,
      admonitions: true,
    };
    const {error} = OptionsSchema.validate(admonitionsTrue);
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: "admonitions" contains an invalid value]`,
    );
  });

  it('rejects invalid remark plugin options', () => {
    expect(() => {
      normalizePluginOptions(OptionsSchema, {
        remarkPlugins: [[{option1: '42'}, markdownPluginsFunctionStub]],
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"remarkPlugins[0]\\" does not match any of the allowed types"`,
    );
  });

  it('rejects invalid rehype plugin options', () => {
    expect(() => {
      normalizePluginOptions(OptionsSchema, {
        rehypePlugins: [
          [
            markdownPluginsFunctionStub,
            {option1: '42'},
            markdownPluginsFunctionStub,
          ],
        ],
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"rehypePlugins[0]\\" does not match any of the allowed types"`,
    );
  });

  it('rejects bad path inputs', () => {
    expect(() => {
      normalizePluginOptions(OptionsSchema, {
        path: 2,
      });
    }).toThrowErrorMatchingInlineSnapshot(`"\\"path\\" must be a string"`);
  });

  it('rejects bad include inputs', () => {
    expect(() => {
      normalizePluginOptions(OptionsSchema, {
        include: '**/*.{md,mdx}',
      });
    }).toThrowErrorMatchingInlineSnapshot(`"\\"include\\" must be an array"`);
  });

  it('rejects bad showLastUpdateTime inputs', () => {
    expect(() => {
      normalizePluginOptions(OptionsSchema, {
        showLastUpdateTime: 'true',
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"showLastUpdateTime\\" must be a boolean"`,
    );
  });

  it('rejects bad remarkPlugins input', () => {
    expect(() => {
      normalizePluginOptions(OptionsSchema, {
        remarkPlugins: 'remark-math',
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"remarkPlugins\\" must be an array"`,
    );
  });

  it('rejects bad lastVersion', () => {
    expect(() => {
      normalizePluginOptions(OptionsSchema, {
        lastVersion: false,
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"lastVersion\\" must be a string"`,
    );
  });

  it('rejects bad versions', () => {
    expect(() => {
      normalizePluginOptions(OptionsSchema, {
        versions: {
          current: {
            hey: 3,
          },
          version1: {
            path: 'hello',
            label: 'world',
          },
        },
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"versions.current.hey\\" is not allowed"`,
    );
  });

  it('handles sidebarCollapsed option inconsistencies', () => {
    expect(
      testValidateOptions({
        ...DEFAULT_OPTIONS,
        sidebarCollapsible: true,
        sidebarCollapsed: undefined,
      }).sidebarCollapsed,
    ).toEqual(true);

    expect(
      testValidateOptions({
        ...DEFAULT_OPTIONS,
        sidebarCollapsible: false,
        sidebarCollapsed: undefined,
      }).sidebarCollapsed,
    ).toEqual(false);

    expect(
      testValidateOptions({
        ...DEFAULT_OPTIONS,
        sidebarCollapsible: false,
        sidebarCollapsed: true,
      }).sidebarCollapsed,
    ).toEqual(false);
  });
});
