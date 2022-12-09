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
import type {Config, DocusaurusConfig} from '@docusaurus/types';
import type {DeepPartial} from 'utility-types';

const baseConfig = {
  baseUrl: '/',
  title: 'my site',
  url: 'https://mysite.com',
} as Config;

const normalizeConfig = (config: DeepPartial<Config>) =>
  validateConfig({...baseConfig, ...config}, 'docusaurus.config.js');

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
      githubPort: '8000',
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
      markdown: {
        mermaid: true,
      },
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
        // @ts-expect-error: test
        invalid: true,
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it('throws for non-string URLs', () => {
    expect(() =>
      normalizeConfig({
        // @ts-expect-error: test
        url: 1,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      ""url" must be a string
      "
    `);
  });

  it('throws for invalid URL', () => {
    expect(() =>
      normalizeConfig({
        url: 'mysite.com',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      ""mysite.com" does not look like a valid URL. Make sure it has a protocol; for example, "https://example.com".
      "
    `);
  });

  it('normalizes URL', () => {
    expect(
      normalizeConfig({
        url: 'https://mysite.com/',
      }).url,
    ).toBe('https://mysite.com');
  });

  it('throws for non-string base URLs', () => {
    expect(() =>
      normalizeConfig({
        // @ts-expect-error: test
        baseUrl: 1,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      ""baseUrl" must be a string
      "
    `);
  });

  it('normalizes various base URLs', () => {
    expect(
      normalizeConfig({
        baseUrl: '',
      }).baseUrl,
    ).toBe('/');
    expect(
      normalizeConfig({
        baseUrl: 'noSlash',
      }).baseUrl,
    ).toBe('/noSlash/');
    expect(
      normalizeConfig({
        baseUrl: '/noSlash',
      }).baseUrl,
    ).toBe('/noSlash/');
    expect(
      normalizeConfig({
        baseUrl: 'noSlash/foo',
      }).baseUrl,
    ).toBe('/noSlash/foo/');
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
        // @ts-expect-error: test
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
        // @ts-expect-error: test
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
    ['should accept false/null for plugin', [false as const, null, 'classic']],
  ])(`%s for the input of: %p`, (_message, plugins) => {
    expect(() => {
      normalizeConfig({
        plugins,
      } as Config);
    }).not.toThrow();
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
      } as Config);
    }).not.toThrow();
  });

  it('throws error if themes is not array', () => {
    expect(() => {
      normalizeConfig({
        // @ts-expect-error: test
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
        // @ts-expect-error: test
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
        // @ts-expect-error: test
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

  it('accepts headTags with tagName and attributes', () => {
    expect(() => {
      normalizeConfig({
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'icon',
              href: 'img/docusaurus.png',
            },
          },
        ],
      });
    }).not.toThrow();
  });

  it("throws error if headTags doesn't have tagName", () => {
    expect(() => {
      normalizeConfig({
        headTags: [
          {
            attributes: {
              rel: 'icon',
              href: 'img/docusaurus.png',
            },
          },
        ],
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      ""headTags[0].tagName" is required
      "
    `);
  });

  it("throws error if headTags doesn't have attributes", () => {
    expect(() => {
      normalizeConfig({
        headTags: [
          {
            tagName: 'link',
          },
        ],
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      ""headTags[0].attributes" is required
      "
    `);
  });

  it("throws error if headTags doesn't have string attributes", () => {
    expect(() => {
      normalizeConfig({
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: false,
              href: 'img/docusaurus.png',
            },
          },
        ],
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      ""headTags[0].attributes.rel" must be a string
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
    expect(() =>
      validateConfig(
        {
          invalidField: true,
          presets: {},
          stylesheets: {},
          themes: {},
          scripts: {},
        },
        'docusaurus.config.js',
      ),
    ).toThrowErrorMatchingSnapshot();
  });

  it('throws for "error" reporting severity', () => {
    expect(() =>
      validateConfig(
        {
          title: 'Site',
          url: 'https://example.com',
          baseUrl: '/',
          onBrokenLinks: 'error',
        },
        'docusaurus.config.js',
      ),
    ).toThrowErrorMatchingSnapshot();
  });
});

describe('config warning and error', () => {
  function getWarning(config: unknown) {
    return ConfigSchema.validate(config).warning;
  }

  it('baseConfig has no warning', () => {
    const warning = getWarning(baseConfig);
    expect(warning).toBeUndefined();
  });

  it('site url fails validation when using subpath', () => {
    const {error} = ConfigSchema.validate({
      ...baseConfig,
      url: 'https://mysite.com/someSubpath',
    });
    expect(error).toBeDefined();
    expect(error.message).toBe(
      'The url is not supposed to contain a sub-path like "/someSubpath". Please use the baseUrl field for sub-paths.',
    );
  });
});

describe('markdown', () => {
  it('accepts undefined object', () => {
    expect(
      normalizeConfig({
        markdown: undefined,
      }),
    ).toEqual(expect.objectContaining({markdown: DEFAULT_CONFIG.markdown}));
  });

  it('accepts empty object', () => {
    expect(
      normalizeConfig({
        markdown: {},
      }),
    ).toEqual(expect.objectContaining({markdown: DEFAULT_CONFIG.markdown}));
  });

  it('accepts valid markdown object', () => {
    const markdown: DocusaurusConfig['markdown'] = {
      mermaid: true,
    };
    expect(
      normalizeConfig({
        markdown,
      }),
    ).toEqual(expect.objectContaining({markdown}));
  });

  it('throw for null object', () => {
    expect(() => {
      normalizeConfig({
        // @ts-expect-error: test
        markdown: null,
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      ""markdown" must be of type object
      "
    `);
  });
});
