/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  ConfigSchema,
  DEFAULT_CONFIG,
  validateConfig,
} from '../configValidation';
import type {DocusaurusConfig} from '@docusaurus/types';

const baseConfig: DocusaurusConfig = {
  baseUrl: '/',
  title: 'my site',
  url: 'https://mysite.com',
};

const normalizeConfig = (config) => validateConfig({...baseConfig, ...config});

describe('normalizeConfig', () => {
  it('normalizes empty config', () => {
    const value = normalizeConfig({});
    expect(value).toEqual({
      ...DEFAULT_CONFIG,
      ...baseConfig,
    });
  });

  it('accepts correctly defined config options', () => {
    const userConfig = {
      ...DEFAULT_CONFIG,
      ...baseConfig,
      tagline: 'my awesome site',
      organizationName: 'facebook',
      projectName: 'docusaurus',
      githubHost: 'github.com',
      customFields: {
        myCustomField: '42',
      },
      scripts: [
        {
          src: `/analytics.js`,
          async: true,
          defer: true,
          'data-domain': 'xyz', // See https://github.com/facebook/docusaurus/issues/3378
        },
      ],
      stylesheets: [
        {
          href: '/katex/katex.min.css',
          type: 'text/css',
          crossorigin: 'anonymous',
        },
      ],
    };
    const normalizedConfig = normalizeConfig(userConfig);
    expect(normalizedConfig).toEqual(userConfig);
  });

  it('accepts custom field in config', () => {
    const value = normalizeConfig({
      customFields: {
        author: 'anshul',
      },
    });
    expect(value).toEqual({
      ...DEFAULT_CONFIG,
      ...baseConfig,
      customFields: {
        author: 'anshul',
      },
    });
  });

  it('throws error for unknown field', () => {
    expect(() => {
      normalizeConfig({
        invalid: true,
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it('throws error for baseUrl without trailing `/`', () => {
    expect(() => {
      normalizeConfig({
        baseUrl: 'noSlash',
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it.each([
    ['should throw error if plugins is not array', {}],
    [
      "should throw error if plugins is not a string and it's not an array #1",
      [123],
    ],
    [
      'should throw error if plugins is not an array of [string, object][] #1',
      [['example/path', 'wrong parameter here']],
    ],
    [
      'should throw error if plugins is not an array of [string, object][] #2',
      [[{}, 'example/path']],
    ],
    [
      'should throw error if plugins is not an array of [string, object][] #3',
      [[{}, {}]],
    ],
  ])(`%s for the input of: %p`, (_message, plugins) => {
    expect(() => {
      normalizeConfig({
        plugins,
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it.each([
    ['should throw error if themes is not array', {}],
    [
      "should throw error if themes is not a string and it's not an array #1",
      [123],
    ],
    [
      'should throw error if themes is not an array of [string, object][] #1',
      [['example/path', 'wrong parameter here']],
    ],
    [
      'should throw error if themes is not an array of [string, object][] #2',
      [[{}, 'example/path']],
    ],
    [
      'should throw error if themes is not an array of [string, object][] #3',
      [[{}, {}]],
    ],
  ])(`%s for the input of: %p`, (_message, themes) => {
    expect(() => {
      normalizeConfig({
        themes,
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it.each([
    ['should accept [string] for plugins', ['plain/string']],
    [
      'should accept string[] for plugins',
      ['plain/string', 'another/plain/string/path'],
    ],
    [
      'should accept [string, object] for plugins',
      [['plain/string', {it: 'should work'}]],
    ],
    [
      'should accept [string, object][] for plugins',
      [
        ['plain/string', {it: 'should work'}],
        ['this/should/work', {too: 'yes'}],
      ],
    ],
    [
      'should accept ([string, object]|string)[] for plugins',
      [
        'plain/string',
        ['plain', {it: 'should work'}],
        ['this/should/work', {too: 'yes'}],
      ],
    ],
    ['should accept function for plugin', [function plugin() {}]],
    [
      'should accept [function, object] for plugin',
      [[() => {}, {it: 'should work'}]],
    ],
    ['should accept false/null for plugin', [false, null, 'classic']],
  ])(`%s for the input of: %p`, (_message, plugins) => {
    expect(() => {
      normalizeConfig({
        plugins,
      });
    }).not.toThrowError();
  });

  it.each([
    ['should accept [string] for themes', ['plain/string']],
    [
      'should accept string[] for themes',
      ['plain/string', 'another/plain/string/path'],
    ],
    [
      'should accept [string, object] for themes',
      [['plain/string', {it: 'should work'}]],
    ],
    [
      'should accept [string, object][] for themes',
      [
        ['plain/string', {it: 'should work'}],
        ['this/should/work', {too: 'yes'}],
      ],
    ],
    [
      'should accept ([string, object]|string)[] for themes',
      [
        'plain/string',
        ['plain', {it: 'should work'}],
        ['this/should/work', {too: 'yes'}],
      ],
    ],
    ['should accept function for theme', [function theme() {}]],
    [
      'should accept [function, object] for theme',
      [[function theme() {}, {it: 'should work'}]],
    ],
    ['should accept false/null for themes', [false, null, 'classic']],
  ])(`%s for the input of: %p`, (_message, themes) => {
    expect(() => {
      normalizeConfig({
        themes,
      });
    }).not.toThrowError();
  });

  it('throws error if themes is not array', () => {
    expect(() => {
      normalizeConfig({
        themes: {},
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      ""themes" must be an array
      "
    `);
  });

  it('throws error if presets is not array', () => {
    expect(() => {
      normalizeConfig({
        presets: {},
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      ""presets" must be an array
      "
    `);
  });

  it('throws error if presets looks invalid', () => {
    expect(() => {
      normalizeConfig({
        presets: [() => {}],
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      ""presets[0]" does not look like a valid preset config. A preset config entry should be one of:
      - A tuple of [presetName, options], like \`["classic", { blog: false }]\`, or
      - A simple string, like \`"classic"\`
      "
    `);
  });

  it('accepts presets as false / null', () => {
    expect(() => {
      normalizeConfig({
        presets: [false, null, 'classic'],
      });
    }).not.toThrow();
  });

  it("throws error if scripts doesn't have src", () => {
    expect(() => {
      normalizeConfig({
        scripts: ['https://some.com', {}],
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      ""scripts[1]" is invalid. A script must be a plain string (the src), or an object with at least a "src" property.
      "
    `);
  });

  it("throws error if css doesn't have href", () => {
    expect(() => {
      normalizeConfig({
        stylesheets: ['https://somescript.com', {type: 'text/css'}],
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      ""stylesheets[1]" is invalid. A stylesheet must be a plain string (the href), or an object with at least a "href" property.
      "
    `);
  });

  it('throws error for required fields', () => {
    expect(
      () =>
        validateConfig({
          invalidField: true,
          presets: {},
          stylesheets: {},
          themes: {},
          scripts: {},
        } as unknown as DocusaurusConfig), // to fields not in the type
    ).toThrowErrorMatchingSnapshot();
  });
});

describe('config warnings', () => {
  function getWarning(config: unknown) {
    return ConfigSchema.validate(config).warning;
  }

  it('baseConfig has no warning', () => {
    const warning = getWarning(baseConfig);
    expect(warning).toBeUndefined();
  });

  it('site url has warning when using subpath', () => {
    const warning = getWarning({
      ...baseConfig,
      url: 'https://mysite.com/someSubpath',
    });
    expect(warning).toBeDefined();
    expect(warning.details).toHaveLength(1);
    expect(warning.details[0].message).toMatchInlineSnapshot(
      `"Docusaurus config validation warning. Field "url": the url is not supposed to contain a sub-path like '/someSubpath', please use the baseUrl field for sub-paths"`,
    );
  });
});
