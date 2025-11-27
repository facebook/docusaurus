/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import {getVcsPreset} from '@docusaurus/utils';
import {
  ConfigSchema,
  DEFAULT_CONFIG,
  DEFAULT_FASTER_CONFIG,
  DEFAULT_FASTER_CONFIG_TRUE,
  DEFAULT_FUTURE_CONFIG,
  DEFAULT_FUTURE_V4_CONFIG,
  DEFAULT_FUTURE_V4_CONFIG_TRUE,
  DEFAULT_STORAGE_CONFIG,
  validateConfig,
} from '../configValidation';
import type {
  FasterConfig,
  FutureConfig,
  FutureV4Config,
  StorageConfig,
  MarkdownConfig,
  MarkdownHooks,
  Config,
  DocusaurusConfig,
  PluginConfig,
  I18nConfig,
  I18nLocaleConfig,
  VcsConfig,
  VcsPreset,
} from '@docusaurus/types';
import type {DeepPartial} from 'utility-types';

const baseConfig = {
  baseUrl: '/',
  title: 'my site',
  url: 'https://mysite.com',
} as Config;

const normalizeConfig = (config: DeepPartial<Config>): DocusaurusConfig =>
  validateConfig({...baseConfig, ...config}, 'docusaurus.config.js');

describe('normalizeConfig', () => {
  it('normalizes empty config', () => {
    const value = normalizeConfig({markdown: {}});
    expect(value).toEqual({
      ...DEFAULT_CONFIG,
      ...baseConfig,
    });
  });

  it('accepts correctly defined config options', () => {
    const userConfig: Config = {
      ...DEFAULT_CONFIG,
      ...baseConfig,
      future: {
        v4: {
          removeLegacyPostBuildHeadAttribute: true,
          useCssCascadeLayers: true,
        },
        experimental_faster: {
          swcJsLoader: true,
          swcJsMinimizer: true,
          swcHtmlMinimizer: true,
          lightningCssMinimizer: true,
          mdxCrossCompilerCache: true,
          rspackBundler: true,
          rspackPersistentCache: true,
          ssgWorkerThreads: true,
          gitEagerVcs: true,
        },
        experimental_storage: {
          type: 'sessionStorage',
          namespace: true,
        },
        experimental_vcs: {
          initialize: (_params) => {},
          getFileCreationInfo: (_filePath) => null,
          getFileLastUpdateInfo: (_filePath) => null,
        },
        experimental_router: 'hash',
      },
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
        format: 'md',
        mermaid: true,
        emoji: false,
        parseFrontMatter: async (params) =>
          params.defaultParseFrontMatter(params),
        preprocessor: ({fileContent}) => fileContent,
        mdx1Compat: {
          comments: true,
          admonitions: false,
          headingIds: true,
        },
        anchors: {
          maintainCase: true,
        },
        remarkRehypeOptions: {
          footnoteLabel: 'Pied de page',
        },
        hooks: {
          onBrokenMarkdownLinks: 'log',
          onBrokenMarkdownImages: 'log',
        },
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
});

describe('config warning and error', () => {
  function getWarning(config: unknown) {
    return ConfigSchema.validate(config).warning;
  }

  it('baseConfig has no warning', () => {
    const warning = getWarning(baseConfig);
    expect(warning).toBeUndefined();
  });
});

describe('url', () => {
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

  it('site url fails validation when using subpath', () => {
    const {error} = ConfigSchema.validate({
      ...baseConfig,
      url: 'https://mysite.com/someSubpath',
    });
    expect(error).toBeDefined();
    expect(error?.message).toBe(
      'The url is not supposed to contain a sub-path like "/someSubpath". Please use the baseUrl field for sub-paths.',
    );
  });
});

describe('headTags', () => {
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

  it('accepts headTags with a custom element without attributes', () => {
    expect(() =>
      normalizeConfig({
        headTags: [
          {
            tagName: 'my-custom-element',
            customElement: true,
          },
        ],
      }),
    ).not.toThrow();
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
});

describe('css', () => {
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
});

describe('scripts', () => {
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
});

describe('onBrokenLinks', () => {
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

describe('i18n', () => {
  function normalizeI18n(i18n: DeepPartial<I18nConfig>): I18nConfig {
    return normalizeConfig({i18n}).i18n;
  }

  it('accepts undefined object', () => {
    expect(normalizeI18n(undefined)).toEqual(DEFAULT_CONFIG.i18n);
  });

  it('rejects empty object', () => {
    expect(() => normalizeI18n({})).toThrowErrorMatchingInlineSnapshot(`
      ""i18n.defaultLocale" is required
      "i18n.locales" is required
      "
    `);
  });

  it('accepts minimal i18n config', () => {
    expect(normalizeI18n({defaultLocale: 'fr', locales: ['fr']})).toEqual({
      defaultLocale: 'fr',
      localeConfigs: {},
      locales: ['fr'],
      path: 'i18n',
    });
  });

  describe('locale config', () => {
    function normalizeLocaleConfig(
      localeConfig?: Partial<I18nLocaleConfig>,
    ): Partial<I18nLocaleConfig> {
      return normalizeConfig({
        i18n: {
          defaultLocale: 'fr',
          locales: ['fr'],
          localeConfigs: {
            fr: localeConfig,
          },
        },
      }).i18n.localeConfigs.fr;
    }

    it('accepts undefined locale config', () => {
      expect(normalizeLocaleConfig(undefined)).toBeUndefined();
    });

    it('accepts empty locale config', () => {
      expect(normalizeLocaleConfig({})).toEqual({});
    });

    describe('url', () => {
      it('accepts undefined', () => {
        expect(normalizeLocaleConfig({url: undefined})).toEqual({
          url: undefined,
        });
      });

      it('rejects empty', () => {
        expect(() => normalizeLocaleConfig({url: ''}))
          .toThrowErrorMatchingInlineSnapshot(`
          ""i18n.localeConfigs.fr.url" is not allowed to be empty
          "
        `);
      });

      it('accepts valid url', () => {
        expect(
          normalizeLocaleConfig({url: 'https://fr.docusaurus.io'}),
        ).toEqual({
          url: 'https://fr.docusaurus.io',
        });
      });

      it('accepts valid url and removes trailing slash', () => {
        expect(
          normalizeLocaleConfig({url: 'https://fr.docusaurus.io/'}),
        ).toEqual({
          url: 'https://fr.docusaurus.io',
        });
      });
    });

    describe('baseUrl', () => {
      it('accepts undefined baseUrl', () => {
        expect(normalizeLocaleConfig({baseUrl: undefined})).toEqual({
          baseUrl: undefined,
        });
      });

      it('accepts empty baseUrl', () => {
        expect(normalizeLocaleConfig({baseUrl: ''})).toEqual({
          baseUrl: '/',
        });
      });

      it('accepts regular baseUrl', () => {
        expect(normalizeLocaleConfig({baseUrl: '/myBase/Url/'})).toEqual({
          baseUrl: '/myBase/Url/',
        });
      });

      it('accepts baseUrl without leading/trailing slashes', () => {
        expect(normalizeLocaleConfig({baseUrl: 'myBase/Url'})).toEqual({
          baseUrl: '/myBase/Url/',
        });
      });

      it('accepts translate true', () => {
        expect(normalizeLocaleConfig({translate: true})).toEqual({
          translate: true,
        });
      });
    });
  });
});

describe('markdown', () => {
  function normalizeMarkdown(
    markdown: DeepPartial<MarkdownConfig>,
  ): MarkdownConfig {
    return normalizeConfig({markdown}).markdown;
  }
  it('accepts undefined object', () => {
    expect(normalizeMarkdown(undefined)).toEqual(DEFAULT_CONFIG.markdown);
  });

  it('accepts empty object', () => {
    expect(normalizeMarkdown({})).toEqual(DEFAULT_CONFIG.markdown);
  });

  it('accepts valid markdown object', () => {
    const markdown: Config['markdown'] = {
      format: 'md',
      mermaid: true,
      emoji: false,
      parseFrontMatter: async (params) =>
        params.defaultParseFrontMatter(params),
      preprocessor: ({fileContent}) => fileContent,
      mdx1Compat: {
        comments: false,
        admonitions: true,
        headingIds: false,
      },
      anchors: {
        maintainCase: true,
      },
      remarkRehypeOptions: {
        footnoteLabel: 'Notes de bas de page',
        // @ts-expect-error: we don't validate it on purpose
        anyKey: 'heck we accept it on purpose',
      },
      hooks: {
        onBrokenMarkdownLinks: 'log',
        onBrokenMarkdownImages: 'warn',
      },
    };
    expect(normalizeMarkdown(markdown)).toEqual(markdown);
  });

  it('accepts partial markdown object', () => {
    const markdown: DeepPartial<Config['markdown']> = {
      mdx1Compat: {
        admonitions: true,
        headingIds: false,
      },
    };
    expect(normalizeMarkdown(markdown)).toEqual({
      ...DEFAULT_CONFIG.markdown,
      ...markdown,
      mdx1Compat: {
        ...DEFAULT_CONFIG.markdown.mdx1Compat,
        ...markdown.mdx1Compat,
      },
    });
  });

  it('throw for preprocessor bad arity', () => {
    expect(() =>
      normalizeConfig({
        markdown: {preprocessor: () => 'content'},
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      ""markdown.preprocessor" must have an arity of 1
      "
    `);
    expect(() =>
      normalizeMarkdown(
        // @ts-expect-error: types forbid this
        {preprocessor: (arg1, arg2) => String(arg1) + String(arg2)},
      ),
    ).toThrowErrorMatchingInlineSnapshot(`
      ""markdown.preprocessor" must have an arity of 1
      "
    `);
  });

  it('accepts undefined markdown format', () => {
    expect(normalizeMarkdown({format: undefined}).format).toBe('mdx');
  });

  it('throw for bad markdown format', () => {
    expect(() =>
      normalizeMarkdown({
        format: null,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      ""markdown.format" must be one of [mdx, md, detect]
      "markdown.format" must be a string
      "
    `);
    expect(() =>
      normalizeMarkdown(
        // @ts-expect-error: bad value
        {format: 'xyz'},
      ),
    ).toThrowErrorMatchingInlineSnapshot(`
      ""markdown.format" must be one of [mdx, md, detect]
      "
    `);
  });

  it('throw for null object', () => {
    expect(() => {
      normalizeMarkdown(null);
    }).toThrowErrorMatchingInlineSnapshot(`
      ""markdown" must be of type object
      "
    `);
  });

  describe('emoji', () => {
    it('accepts emoji boolean true', () => {
      expect(
        normalizeMarkdown({
          emoji: true,
        }).emoji,
      ).toBe(true);
    });

    it('accepts emoji boolean false', () => {
      expect(
        normalizeMarkdown({
          emoji: false,
        }).emoji,
      ).toBe(false);
    });

    it('defaults emoji to true when undefined', () => {
      expect(normalizeMarkdown({}).emoji).toBe(true);
    });

    it('throw for string emoji value', () => {
      expect(() =>
        normalizeMarkdown({
          // @ts-expect-error: bad value
          emoji: 'yes',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
              ""markdown.emoji" must be a boolean
              "
          `);
    });

    it('throw for number emoji value', () => {
      expect(() =>
        normalizeConfig({
          markdown: {
            // @ts-expect-error: bad value
            emoji: 1,
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
              ""markdown.emoji" must be a boolean
              "
          `);
    });
  });

  describe('hooks', () => {
    function normalizeHooks(hooks: DeepPartial<MarkdownHooks>): MarkdownHooks {
      return normalizeMarkdown({
        hooks,
      }).hooks;
    }

    describe('onBrokenMarkdownLinks', () => {
      function normalizeValue(
        onBrokenMarkdownLinks?: MarkdownHooks['onBrokenMarkdownLinks'],
      ) {
        return normalizeHooks({
          onBrokenMarkdownLinks,
        }).onBrokenMarkdownLinks;
      }

      it('accepts undefined', () => {
        expect(normalizeValue(undefined)).toBe('warn');
      });

      it('accepts severity level', () => {
        expect(normalizeValue('log')).toBe('log');
      });

      it('rejects number', () => {
        expect(() =>
          normalizeValue(
            // @ts-expect-error: bad value
            42,
          ),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""markdown.hooks.onBrokenMarkdownLinks" does not match any of the allowed types
          "
        `);
      });

      it('accepts function', () => {
        expect(normalizeValue(() => {})).toBeInstanceOf(Function);
      });

      it('rejects null', () => {
        expect(() => normalizeValue(null)).toThrowErrorMatchingInlineSnapshot(`
          ""markdown.hooks.onBrokenMarkdownLinks" does not match any of the allowed types
          "
        `);
      });

      describe('onBrokenMarkdownLinks migration', () => {
        const warnMock = jest
          .spyOn(console, 'warn')
          .mockImplementation(() => {});
        beforeEach(() => {
          warnMock.mockClear();
        });

        it('accepts migrated v3 config', () => {
          expect(
            normalizeConfig({
              onBrokenMarkdownLinks: undefined,
              markdown: {
                hooks: {
                  onBrokenMarkdownLinks: 'throw',
                },
              },
            }),
          ).toEqual(
            expect.objectContaining({
              onBrokenMarkdownLinks: undefined,
              markdown: expect.objectContaining({
                hooks: expect.objectContaining({
                  onBrokenMarkdownLinks: 'throw',
                }),
              }),
            }),
          );

          expect(warnMock).not.toHaveBeenCalled();
        });

        it('accepts deprecated v3 config with migration warning', () => {
          expect(
            normalizeConfig({
              onBrokenMarkdownLinks: 'log',
              markdown: {
                hooks: {
                  onBrokenMarkdownLinks: 'throw',
                },
              },
            }),
          ).toEqual(
            expect.objectContaining({
              onBrokenMarkdownLinks: undefined,
              markdown: expect.objectContaining({
                hooks: expect.objectContaining({
                  onBrokenMarkdownLinks: 'log',
                }),
              }),
            }),
          );

          expect(warnMock).toHaveBeenCalledTimes(1);
          expect(warnMock.mock.calls[0]).toMatchInlineSnapshot(`
            [
              "[WARNING] The \`siteConfig.onBrokenMarkdownLinks\` config option is deprecated and will be removed in Docusaurus v4.
            Please migrate and move this option to \`siteConfig.markdown.hooks.onBrokenMarkdownLinks\` instead.",
            ]
          `);
        });
      });
    });

    describe('onBrokenMarkdownImages', () => {
      function normalizeValue(
        onBrokenMarkdownImages?: MarkdownHooks['onBrokenMarkdownImages'],
      ) {
        return normalizeHooks({
          onBrokenMarkdownImages,
        }).onBrokenMarkdownImages;
      }

      it('accepts undefined', () => {
        expect(normalizeValue(undefined)).toBe('throw');
      });

      it('accepts severity level', () => {
        expect(normalizeValue('log')).toBe('log');
      });

      it('rejects number', () => {
        expect(() =>
          normalizeValue(
            // @ts-expect-error: bad value
            42,
          ),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""markdown.hooks.onBrokenMarkdownImages" does not match any of the allowed types
          "
        `);
      });

      it('accepts function', () => {
        expect(normalizeValue(() => {})).toBeInstanceOf(Function);
      });

      it('rejects null', () => {
        expect(() => normalizeValue(null)).toThrowErrorMatchingInlineSnapshot(`
          ""markdown.hooks.onBrokenMarkdownImages" does not match any of the allowed types
          "
        `);
      });
    });
  });
});

describe('plugins', () => {
  // Only here to verify typing
  function ensurePlugins(plugins: PluginConfig[]): PluginConfig[] {
    return plugins;
  }

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
    ['should accept [string] for plugins', ensurePlugins(['plain/string'])],
    [
      'should accept string[] for plugins',
      ensurePlugins(['plain/string', 'another/plain/string/path']),
    ],
    [
      'should accept [string, object] for plugins',
      ensurePlugins([['plain/string', {it: 'should work'}]]),
    ],
    [
      'should accept [string, object][] for plugins',
      ensurePlugins([
        ['plain/string', {it: 'should work'}],
        ['this/should/work', {too: 'yes'}],
      ]),
    ],
    [
      'should accept ([string, object]|string)[] for plugins',
      ensurePlugins([
        'plain/string',
        ['plain', {it: 'should work'}],
        ['this/should/work', {too: 'yes'}],
      ]),
    ],
    [
      'should accept function returning null',
      ensurePlugins([
        function plugin() {
          return null;
        },
      ]),
    ],
    [
      'should accept function returning plugin',
      ensurePlugins([
        function plugin() {
          return {name: 'plugin'};
        },
      ]),
    ],
    [
      'should accept function returning plugin or null',
      ensurePlugins([
        function plugin() {
          return Math.random() > 0.5 ? null : {name: 'plugin'};
        },
      ]),
    ],
    [
      'should accept async function returning null',
      ensurePlugins([
        async function plugin() {
          return null;
        },
      ]),
    ],
    [
      'should accept async function returning plugin',
      ensurePlugins([
        async function plugin() {
          return {name: 'plugin'};
        },
      ]),
    ],
    [
      'should accept function returning plugin or null',
      ensurePlugins([
        async function plugin() {
          return Math.random() > 0.5 ? null : {name: 'plugin'};
        },
      ]),
    ],
    [
      'should accept [function, object] for plugin',
      [[() => {}, {it: 'should work'}]],
    ],
    [
      'should accept false/null for plugin',
      ensurePlugins([false as const, null, 'classic']),
    ],
  ])(`%s for the input of: %p`, (_message, plugins) => {
    expect(() => {
      normalizeConfig({
        plugins,
      } as Config);
    }).not.toThrow();
  });
});

describe('themes', () => {
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
});

describe('presets', () => {
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
});

describe('future', () => {
  function futureContaining(future: Partial<FutureConfig>) {
    return expect.objectContaining({
      future: expect.objectContaining(future),
    });
  }

  it('accepts future - undefined', () => {
    expect(
      normalizeConfig({
        future: undefined,
      }),
    ).toEqual(futureContaining(DEFAULT_FUTURE_CONFIG));
  });

  it('accepts future - empty', () => {
    expect(
      normalizeConfig({
        future: {},
      }),
    ).toEqual(futureContaining(DEFAULT_FUTURE_CONFIG));
  });

  it('accepts future - full', () => {
    const future: DocusaurusConfig['future'] = {
      v4: {
        removeLegacyPostBuildHeadAttribute: true,
        useCssCascadeLayers: true,
      },
      experimental_faster: {
        swcJsLoader: true,
        swcJsMinimizer: true,
        swcHtmlMinimizer: true,
        lightningCssMinimizer: true,
        mdxCrossCompilerCache: true,
        rspackBundler: true,
        rspackPersistentCache: true,
        ssgWorkerThreads: true,
        gitEagerVcs: true,
      },
      experimental_vcs: {
        initialize: (_params) => {},
        getFileCreationInfo: (_filePath) => null,
        getFileLastUpdateInfo: (_filePath) => null,
      },
      experimental_storage: {
        type: 'sessionStorage',
        namespace: 'myNamespace',
      },
      experimental_router: 'hash',
    };
    expect(
      normalizeConfig({
        future,
      }),
    ).toEqual(futureContaining(future));
  });

  it('rejects future - unknown key', () => {
    const future: Config['future'] = {
      // @ts-expect-error: invalid
      doesNotExistKey: {
        type: 'sessionStorage',
        namespace: 'myNamespace',
      },
    };
    expect(() =>
      normalizeConfig({
        future,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "These field(s) ("future.doesNotExistKey",) are not recognized in docusaurus.config.js.
      If you still want these fields to be in your configuration, put them in the "customFields" field.
      See https://docusaurus.io/docs/api/docusaurus-config/#customfields"
    `);
  });

  describe('router', () => {
    it('accepts router - undefined', () => {
      expect(
        normalizeConfig({
          future: {
            experimental_router: undefined,
          },
        }),
      ).toEqual(futureContaining({experimental_router: 'browser'}));
    });

    it('accepts router - hash', () => {
      expect(
        normalizeConfig({
          future: {
            experimental_router: 'hash',
          },
        }),
      ).toEqual(futureContaining({experimental_router: 'hash'}));
    });

    it('accepts router - browser', () => {
      expect(
        normalizeConfig({
          future: {
            experimental_router: 'browser',
          },
        }),
      ).toEqual(futureContaining({experimental_router: 'browser'}));
    });

    it('rejects router - invalid enum value', () => {
      // @ts-expect-error: invalid
      const router: Config['future']['experimental_router'] = 'badRouter';
      expect(() =>
        normalizeConfig({
          future: {
            experimental_router: router,
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        ""future.experimental_router" must be one of [browser, hash]
        "
      `);
    });

    it('rejects router - null', () => {
      const router: Config['future']['experimental_router'] = null;
      expect(() =>
        normalizeConfig({
          future: {
            experimental_router: router,
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        ""future.experimental_router" must be one of [browser, hash]
        "future.experimental_router" must be a string
        "
      `);
    });

    it('rejects router - number', () => {
      // @ts-expect-error: invalid
      const router: Config['future']['experimental_router'] = 42;
      expect(() =>
        normalizeConfig({
          future: {
            experimental_router: router,
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        ""future.experimental_router" must be one of [browser, hash]
        "future.experimental_router" must be a string
        "
      `);
    });
  });

  describe('storage', () => {
    function storageContaining(storage: Partial<StorageConfig>) {
      return futureContaining({
        experimental_storage: expect.objectContaining(storage),
      });
    }

    it('accepts storage - undefined', () => {
      expect(
        normalizeConfig({
          future: {
            experimental_storage: undefined,
          },
        }),
      ).toEqual(futureContaining(DEFAULT_FUTURE_CONFIG));
    });

    it('accepts storage - empty', () => {
      expect(
        normalizeConfig({
          future: {experimental_storage: {}},
        }),
      ).toEqual(futureContaining(DEFAULT_FUTURE_CONFIG));
    });

    it('accepts storage - full', () => {
      const storage: StorageConfig = {
        type: 'sessionStorage',
        namespace: 'myNamespace',
      };
      expect(
        normalizeConfig({
          future: {
            experimental_storage: storage,
          },
        }),
      ).toEqual(storageContaining(storage));
    });

    it('rejects storage - boolean', () => {
      // @ts-expect-error: invalid
      const storage: Partial<StorageConfig> = true;
      expect(() =>
        normalizeConfig({
          future: {
            experimental_storage: storage,
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        ""future.experimental_storage" must be of type object
        "
      `);
    });

    it('rejects storage - number', () => {
      // @ts-expect-error: invalid
      const storage: Partial<StorageConfig> = 42;
      expect(() =>
        normalizeConfig({
          future: {
            experimental_storage: storage,
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        ""future.experimental_storage" must be of type object
        "
      `);
    });

    describe('type', () => {
      it('accepts type', () => {
        const storage: Partial<StorageConfig> = {
          type: 'sessionStorage',
        };
        expect(
          normalizeConfig({
            future: {
              experimental_storage: storage,
            },
          }),
        ).toEqual(
          storageContaining({
            ...DEFAULT_STORAGE_CONFIG,
            ...storage,
          }),
        );
      });

      it('accepts type - undefined', () => {
        const storage: Partial<StorageConfig> = {
          type: undefined,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_storage: storage,
            },
          }),
        ).toEqual(storageContaining({type: 'localStorage'}));
      });

      it('rejects type - null', () => {
        // @ts-expect-error: invalid
        const storage: Partial<StorageConfig> = {type: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_storage: storage,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
                  ""future.experimental_storage.type" must be one of [localStorage, sessionStorage]
                  "future.experimental_storage.type" must be a string
                  "
              `);
      });

      it('rejects type - number', () => {
        // @ts-expect-error: invalid
        const storage: Partial<StorageConfig> = {type: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_storage: storage,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
                  ""future.experimental_storage.type" must be one of [localStorage, sessionStorage]
                  "future.experimental_storage.type" must be a string
                  "
              `);
      });

      it('rejects type - invalid enum value', () => {
        // @ts-expect-error: invalid
        const storage: Partial<StorageConfig> = {type: 'badType'};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_storage: storage,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
                  ""future.experimental_storage.type" must be one of [localStorage, sessionStorage]
                  "
              `);
      });
    });

    describe('namespace', () => {
      it('accepts namespace - boolean', () => {
        const storage: Partial<StorageConfig> = {
          namespace: true,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_storage: storage,
            },
          }),
        ).toEqual(storageContaining(storage));
      });

      it('accepts namespace - string', () => {
        const storage: Partial<StorageConfig> = {
          namespace: 'myNamespace',
        };
        expect(
          normalizeConfig({
            future: {
              experimental_storage: storage,
            },
          }),
        ).toEqual(storageContaining(storage));
      });

      it('rejects namespace - null', () => {
        const storage: Partial<StorageConfig> = {namespace: null};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_storage: storage,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
                  ""future.experimental_storage.namespace" must be one of [string, boolean]
                  "
              `);
      });

      it('rejects namespace - number', () => {
        // @ts-expect-error: invalid
        const storage: Partial<StorageConfig> = {namespace: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_storage: storage,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
                  ""future.experimental_storage.namespace" must be one of [string, boolean]
                  "
              `);
      });
    });
  });

  describe('vcs', () => {
    function vcsContaining(vcs: Partial<VcsConfig>) {
      return futureContaining({
        experimental_vcs: expect.objectContaining(vcs),
      });
    }

    describe('base', () => {
      it('accepts vcs - undefined', () => {
        expect(
          normalizeConfig({
            future: {
              experimental_vcs: undefined,
            },
          }),
        ).toEqual(
          futureContaining({
            ...DEFAULT_FUTURE_CONFIG,
            experimental_vcs: getVcsPreset('default-v1'),
          }),
        );
      });

      it('accepts vcs - true', () => {
        expect(
          normalizeConfig({
            future: {
              experimental_vcs: true,
            },
          }),
        ).toEqual(
          futureContaining({
            ...DEFAULT_FUTURE_CONFIG,
            experimental_vcs: getVcsPreset('default-v1'),
          }),
        );
      });

      it('accepts vcs - false', () => {
        expect(
          normalizeConfig({
            future: {
              experimental_vcs: false,
            },
          }),
        ).toEqual(
          futureContaining({
            ...DEFAULT_FUTURE_CONFIG,
            experimental_vcs: getVcsPreset('disabled'),
          }),
        );
      });
    });

    describe('presets', () => {
      it('accepts git-ad-hoc', () => {
        const presetName: VcsPreset = 'git-ad-hoc';
        expect(
          normalizeConfig({
            future: {
              experimental_vcs: presetName,
            },
          }),
        ).toEqual(vcsContaining(getVcsPreset(presetName)));
      });

      it('accepts git-eager', () => {
        const presetName: VcsPreset = 'git-eager';
        expect(
          normalizeConfig({
            future: {
              experimental_vcs: presetName,
            },
          }),
        ).toEqual(vcsContaining(getVcsPreset(presetName)));
      });

      it('accepts hardcoded', () => {
        const presetName: VcsPreset = 'hardcoded';
        expect(
          normalizeConfig({
            future: {
              experimental_vcs: presetName,
            },
          }),
        ).toEqual(vcsContaining(getVcsPreset(presetName)));
      });

      it('rejects unknown preset name', () => {
        // @ts-expect-error: invalid on purpose
        const presetName: VcsPreset = 'unknown-preset-name';
        expect(() =>
          normalizeConfig({
            future: {
              experimental_vcs: presetName,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_vcs" failed custom validation because VCS config preset name 'unknown-preset-name' is not valid.
          "
        `);
      });
    });

    describe('object config', () => {
      it('accepts vcs - full', () => {
        const vcs: VcsConfig = {
          initialize: (_params) => {},
          getFileCreationInfo: (_filePath) => null,
          getFileLastUpdateInfo: (_filePath) => null,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_vcs: vcs,
            },
          }),
        ).toEqual(vcsContaining(vcs));
      });

      it('rejects vcs - empty', () => {
        expect(() =>
          normalizeConfig({
            future: {experimental_vcs: {}},
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_vcs" failed custom validation because "initialize" is required
          "
        `);
      });

      it('accepts vcs - bad initialize() arity', () => {
        const vcs: VcsConfig = {
          // @ts-expect-error: invalid arity
          initialize: (_params, _extraParam) => {},
          getFileCreationInfo: (_filePath) => null,
          getFileLastUpdateInfo: (_filePath) => null,
        };
        expect(() =>
          normalizeConfig({
            future: {
              experimental_vcs: vcs,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_vcs" failed custom validation because "initialize" must have an arity lesser or equal to 1
          "
        `);
      });

      it('accepts vcs - bad getFileCreationInfo() arity', () => {
        const vcs: VcsConfig = {
          initialize: (_params) => {},
          // @ts-expect-error: invalid arity
          getFileCreationInfo: (_filePath, _extraParam) => null,
          getFileLastUpdateInfo: (_filePath) => null,
        };
        expect(() =>
          normalizeConfig({
            future: {
              experimental_vcs: vcs,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_vcs" failed custom validation because "getFileCreationInfo" must have an arity of 1
          "
        `);
      });

      it('accepts vcs - bad getFileLastUpdateInfo() arity', () => {
        const vcs: VcsConfig = {
          initialize: (_params) => {},
          getFileCreationInfo: (_filePath) => null,
          // @ts-expect-error: invalid arity
          getFileLastUpdateInfo: (_filePath, _extraParam) => null,
        };
        expect(() =>
          normalizeConfig({
            future: {
              experimental_vcs: vcs,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_vcs" failed custom validation because "getFileLastUpdateInfo" must have an arity of 1
          "
        `);
      });
    });
  });

  describe('faster', () => {
    function fasterContaining(faster: Partial<FasterConfig>) {
      return futureContaining({
        experimental_faster: expect.objectContaining(faster),
      });
    }

    it('accepts faster - undefined', () => {
      expect(
        normalizeConfig({
          future: {
            experimental_faster: undefined,
          },
        }),
      ).toEqual(futureContaining(DEFAULT_FUTURE_CONFIG));
    });

    it('accepts faster - empty', () => {
      expect(
        normalizeConfig({
          future: {experimental_faster: {}},
        }),
      ).toEqual(futureContaining(DEFAULT_FUTURE_CONFIG));
    });

    it('accepts faster - full', () => {
      const faster: FasterConfig = {
        swcJsLoader: true,
        swcJsMinimizer: true,
        swcHtmlMinimizer: true,
        lightningCssMinimizer: true,
        mdxCrossCompilerCache: true,
        rspackBundler: true,
        rspackPersistentCache: true,
        ssgWorkerThreads: true,
        gitEagerVcs: true,
      };
      expect(
        normalizeConfig({
          future: {
            v4: true,
            experimental_faster: faster,
          },
        }),
      ).toEqual(fasterContaining(faster));
    });

    it('accepts faster - false', () => {
      expect(
        normalizeConfig({
          future: {experimental_faster: false},
        }),
      ).toEqual(fasterContaining(DEFAULT_FASTER_CONFIG));
    });

    it('accepts faster - true (v4: true)', () => {
      expect(
        normalizeConfig({
          future: {
            v4: true,
            experimental_faster: true,
          },
        }),
      ).toEqual(fasterContaining(DEFAULT_FASTER_CONFIG_TRUE));
    });

    it('rejects faster - true (v4: false)', () => {
      expect(() =>
        normalizeConfig({
          future: {
            v4: false,
            experimental_faster: true,
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Docusaurus config \`future.experimental_faster.ssgWorkerThreads\` requires the future flag \`future.v4.removeLegacyPostBuildHeadAttribute\` to be turned on.
        If you use Docusaurus Faster, we recommend that you also activate Docusaurus v4 future flags: \`{future: {v4: true}}\`
        All the v4 future flags are documented here: https://docusaurus.io/docs/api/docusaurus-config#future"
      `);
    });

    it('rejects faster - true (v4: undefined)', () => {
      expect(() =>
        normalizeConfig({
          future: {
            v4: false,
            experimental_faster: true,
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Docusaurus config \`future.experimental_faster.ssgWorkerThreads\` requires the future flag \`future.v4.removeLegacyPostBuildHeadAttribute\` to be turned on.
        If you use Docusaurus Faster, we recommend that you also activate Docusaurus v4 future flags: \`{future: {v4: true}}\`
        All the v4 future flags are documented here: https://docusaurus.io/docs/api/docusaurus-config#future"
      `);
    });

    it('rejects faster - number', () => {
      // @ts-expect-error: invalid
      const faster: Partial<FasterConfig> = 42;
      expect(() =>
        normalizeConfig({
          future: {
            experimental_faster: faster,
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        ""future.experimental_faster" must be one of [object, boolean]
        "
      `);
    });

    describe('swcJsLoader', () => {
      it('accepts - undefined', () => {
        const faster: Partial<FasterConfig> = {
          swcJsLoader: undefined,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({swcJsLoader: false}));
      });

      it('accepts - true', () => {
        const faster: Partial<FasterConfig> = {
          swcJsLoader: true,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({swcJsLoader: true}));
      });

      it('accepts - false', () => {
        const faster: Partial<FasterConfig> = {
          swcJsLoader: false,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({swcJsLoader: false}));
      });

      it('rejects - null', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {swcJsLoader: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.swcJsLoader" must be a boolean
          "
        `);
      });

      it('rejects - number', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {swcJsLoader: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.swcJsLoader" must be a boolean
          "
        `);
      });
    });

    describe('swcJsMinimizer', () => {
      it('accepts - undefined', () => {
        const faster: Partial<FasterConfig> = {
          swcJsMinimizer: undefined,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({swcJsMinimizer: false}));
      });

      it('accepts - true', () => {
        const faster: Partial<FasterConfig> = {
          swcJsMinimizer: true,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({swcJsMinimizer: true}));
      });

      it('accepts - false', () => {
        const faster: Partial<FasterConfig> = {
          swcJsMinimizer: false,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({swcJsMinimizer: false}));
      });

      it('rejects - null', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {swcJsMinimizer: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.swcJsMinimizer" must be a boolean
          "
        `);
      });

      it('rejects - number', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {swcJsMinimizer: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.swcJsMinimizer" must be a boolean
          "
        `);
      });
    });

    describe('swcHtmlMinimizer', () => {
      it('accepts - undefined', () => {
        const faster: Partial<FasterConfig> = {
          swcHtmlMinimizer: undefined,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({swcHtmlMinimizer: false}));
      });

      it('accepts - true', () => {
        const faster: Partial<FasterConfig> = {
          swcHtmlMinimizer: true,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({swcHtmlMinimizer: true}));
      });

      it('accepts - false', () => {
        const faster: Partial<FasterConfig> = {
          swcHtmlMinimizer: false,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({swcHtmlMinimizer: false}));
      });

      it('rejects - null', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {swcHtmlMinimizer: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.swcHtmlMinimizer" must be a boolean
          "
        `);
      });

      it('rejects - number', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {swcHtmlMinimizer: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.swcHtmlMinimizer" must be a boolean
          "
        `);
      });
    });

    describe('lightningCssMinimizer', () => {
      it('accepts - undefined', () => {
        const faster: Partial<FasterConfig> = {
          lightningCssMinimizer: undefined,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({lightningCssMinimizer: false}));
      });

      it('accepts - true', () => {
        const faster: Partial<FasterConfig> = {
          lightningCssMinimizer: true,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({lightningCssMinimizer: true}));
      });

      it('accepts - false', () => {
        const faster: Partial<FasterConfig> = {
          lightningCssMinimizer: false,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({lightningCssMinimizer: false}));
      });

      it('rejects - null', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {lightningCssMinimizer: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.lightningCssMinimizer" must be a boolean
          "
        `);
      });

      it('rejects - number', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {lightningCssMinimizer: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.lightningCssMinimizer" must be a boolean
          "
        `);
      });
    });

    describe('mdxCrossCompilerCache', () => {
      it('accepts - undefined', () => {
        const faster: Partial<FasterConfig> = {
          mdxCrossCompilerCache: undefined,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({mdxCrossCompilerCache: false}));
      });

      it('accepts - true', () => {
        const faster: Partial<FasterConfig> = {
          mdxCrossCompilerCache: true,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({mdxCrossCompilerCache: true}));
      });

      it('accepts - false', () => {
        const faster: Partial<FasterConfig> = {
          mdxCrossCompilerCache: false,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({mdxCrossCompilerCache: false}));
      });

      it('rejects - null', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {mdxCrossCompilerCache: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.mdxCrossCompilerCache" must be a boolean
          "
        `);
      });

      it('rejects - number', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {mdxCrossCompilerCache: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.mdxCrossCompilerCache" must be a boolean
          "
        `);
      });
    });

    describe('rspackBundler', () => {
      it('accepts - undefined', () => {
        const faster: Partial<FasterConfig> = {
          rspackBundler: undefined,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({rspackBundler: false}));
      });

      it('accepts - true', () => {
        const faster: Partial<FasterConfig> = {
          rspackBundler: true,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({rspackBundler: true}));
      });

      it('accepts - false', () => {
        const faster: Partial<FasterConfig> = {
          rspackBundler: false,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({rspackBundler: false}));
      });

      it('rejects - null', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {rspackBundler: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.rspackBundler" must be a boolean
          "
        `);
      });

      it('rejects - number', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {rspackBundler: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.rspackBundler" must be a boolean
          "
        `);
      });
    });

    describe('rspackPersistentCache', () => {
      it('accepts - undefined', () => {
        const faster: Partial<FasterConfig> = {
          rspackPersistentCache: undefined,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({rspackPersistentCache: false}));
      });

      it('accepts - true (rspackBundler: true)', () => {
        const faster: Partial<FasterConfig> = {
          rspackBundler: true,
          rspackPersistentCache: true,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({rspackPersistentCache: true}));
      });

      it('rejects - true (rspackBundler: false)', () => {
        const faster: Partial<FasterConfig> = {
          rspackBundler: false,
          rspackPersistentCache: true,
        };
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(
          `"Docusaurus config flag \`future.experimental_faster.rspackPersistentCache\` requires the flag \`future.experimental_faster.rspackBundler\` to be turned on."`,
        );
      });

      it('rejects - true (rspackBundler: undefined)', () => {
        const faster: Partial<FasterConfig> = {
          rspackBundler: false,
          rspackPersistentCache: true,
        };
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(
          `"Docusaurus config flag \`future.experimental_faster.rspackPersistentCache\` requires the flag \`future.experimental_faster.rspackBundler\` to be turned on."`,
        );
      });

      it('accepts - false', () => {
        const faster: Partial<FasterConfig> = {
          rspackPersistentCache: false,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({rspackPersistentCache: false}));
      });

      it('rejects - null', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {rspackPersistentCache: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.rspackPersistentCache" must be a boolean
          "
        `);
      });

      it('rejects - number', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {rspackPersistentCache: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.rspackPersistentCache" must be a boolean
          "
        `);
      });
    });

    describe('ssgWorkerThreads', () => {
      it('accepts - undefined', () => {
        const faster: Partial<FasterConfig> = {
          ssgWorkerThreads: undefined,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({ssgWorkerThreads: false}));
      });

      it('accepts - true (v4: true)', () => {
        const faster: Partial<FasterConfig> = {
          ssgWorkerThreads: true,
        };
        expect(
          normalizeConfig({
            future: {
              v4: true,
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({ssgWorkerThreads: true}));
      });

      it('rejects - true (v4: false)', () => {
        const faster: Partial<FasterConfig> = {
          ssgWorkerThreads: true,
        };
        expect(() =>
          normalizeConfig({
            future: {
              v4: false,
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          "Docusaurus config \`future.experimental_faster.ssgWorkerThreads\` requires the future flag \`future.v4.removeLegacyPostBuildHeadAttribute\` to be turned on.
          If you use Docusaurus Faster, we recommend that you also activate Docusaurus v4 future flags: \`{future: {v4: true}}\`
          All the v4 future flags are documented here: https://docusaurus.io/docs/api/docusaurus-config#future"
        `);
      });

      it('rejects - true (v4: undefined)', () => {
        const faster: Partial<FasterConfig> = {
          ssgWorkerThreads: true,
        };
        expect(() =>
          normalizeConfig({
            future: {
              v4: undefined,
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          "Docusaurus config \`future.experimental_faster.ssgWorkerThreads\` requires the future flag \`future.v4.removeLegacyPostBuildHeadAttribute\` to be turned on.
          If you use Docusaurus Faster, we recommend that you also activate Docusaurus v4 future flags: \`{future: {v4: true}}\`
          All the v4 future flags are documented here: https://docusaurus.io/docs/api/docusaurus-config#future"
        `);
      });

      it('accepts - false', () => {
        const faster: Partial<FasterConfig> = {
          ssgWorkerThreads: false,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({ssgWorkerThreads: false}));
      });

      it('rejects - null', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {ssgWorkerThreads: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.ssgWorkerThreads" must be a boolean
          "
        `);
      });

      it('rejects - number', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {ssgWorkerThreads: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.ssgWorkerThreads" must be a boolean
          "
        `);
      });
    });

    describe('gitEagerVcs', () => {
      it('accepts - undefined', () => {
        const faster: Partial<FasterConfig> = {
          gitEagerVcs: undefined,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(fasterContaining({gitEagerVcs: false}));
      });

      it('accepts - true', () => {
        const faster: Partial<FasterConfig> = {
          gitEagerVcs: true,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(
          futureContaining({
            experimental_faster: expect.objectContaining(faster),
            experimental_vcs: getVcsPreset('default-v2'),
          }),
        );
      });

      it('accepts - false', () => {
        const faster: Partial<FasterConfig> = {
          gitEagerVcs: false,
        };
        expect(
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toEqual(
          futureContaining({
            experimental_faster: expect.objectContaining(faster),
            experimental_vcs: getVcsPreset('default-v1'),
          }),
        );
      });

      it('rejects - null', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {gitEagerVcs: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.gitEagerVcs" must be a boolean
          "
        `);
      });

      it('rejects - number', () => {
        // @ts-expect-error: invalid
        const faster: Partial<FasterConfig> = {gitEagerVcs: 42};
        expect(() =>
          normalizeConfig({
            future: {
              experimental_faster: faster,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.experimental_faster.gitEagerVcs" must be a boolean
          "
        `);
      });
    });
  });

  describe('v4', () => {
    function v4Containing(v4: Partial<FutureV4Config>) {
      return futureContaining({
        v4: expect.objectContaining(v4),
      });
    }

    it('accepts v4 - undefined', () => {
      expect(
        normalizeConfig({
          future: {
            v4: undefined,
          },
        }),
      ).toEqual(futureContaining(DEFAULT_FUTURE_CONFIG));
    });

    it('accepts v4 - empty', () => {
      expect(
        normalizeConfig({
          future: {v4: {}},
        }),
      ).toEqual(futureContaining(DEFAULT_FUTURE_CONFIG));
    });

    it('accepts v4 - full', () => {
      const v4: FutureV4Config = {
        removeLegacyPostBuildHeadAttribute: true,
        useCssCascadeLayers: true,
      };
      expect(
        normalizeConfig({
          future: {
            v4,
          },
        }),
      ).toEqual(v4Containing(v4));
    });

    it('accepts v4 - false', () => {
      expect(
        normalizeConfig({
          future: {v4: false},
        }),
      ).toEqual(v4Containing(DEFAULT_FUTURE_V4_CONFIG));
    });

    it('accepts v4 - true', () => {
      expect(
        normalizeConfig({
          future: {v4: true},
        }),
      ).toEqual(v4Containing(DEFAULT_FUTURE_V4_CONFIG_TRUE));
    });

    it('rejects v4 - number', () => {
      // @ts-expect-error: invalid
      const v4: Partial<FutureV4Config> = 42;
      expect(() =>
        normalizeConfig({
          future: {
            v4,
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        ""future.v4" must be one of [object, boolean]
        "
      `);
    });

    describe('removeLegacyPostBuildHeadAttribute', () => {
      it('accepts - undefined', () => {
        const v4: Partial<FutureV4Config> = {
          removeLegacyPostBuildHeadAttribute: undefined,
        };
        expect(
          normalizeConfig({
            future: {
              v4,
            },
          }),
        ).toEqual(v4Containing({removeLegacyPostBuildHeadAttribute: false}));
      });

      it('accepts - true', () => {
        const v4: Partial<FutureV4Config> = {
          removeLegacyPostBuildHeadAttribute: true,
        };
        expect(
          normalizeConfig({
            future: {
              v4,
            },
          }),
        ).toEqual(v4Containing({removeLegacyPostBuildHeadAttribute: true}));
      });

      it('accepts - false', () => {
        const v4: Partial<FutureV4Config> = {
          removeLegacyPostBuildHeadAttribute: false,
        };
        expect(
          normalizeConfig({
            future: {
              v4,
            },
          }),
        ).toEqual(v4Containing({removeLegacyPostBuildHeadAttribute: false}));
      });

      it('rejects - null', () => {
        const v4: Partial<FutureV4Config> = {
          // @ts-expect-error: invalid
          removeLegacyPostBuildHeadAttribute: 42,
        };
        expect(() =>
          normalizeConfig({
            future: {
              v4,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.v4.removeLegacyPostBuildHeadAttribute" must be a boolean
          "
        `);
      });

      it('rejects - number', () => {
        const v4: Partial<FutureV4Config> = {
          // @ts-expect-error: invalid
          removeLegacyPostBuildHeadAttribute: 42,
        };
        expect(() =>
          normalizeConfig({
            future: {
              v4,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.v4.removeLegacyPostBuildHeadAttribute" must be a boolean
          "
        `);
      });
    });

    describe('useCssCascadeLayers', () => {
      it('accepts - undefined', () => {
        const v4: Partial<FutureV4Config> = {
          useCssCascadeLayers: undefined,
        };
        expect(
          normalizeConfig({
            future: {
              v4,
            },
          }),
        ).toEqual(v4Containing({useCssCascadeLayers: false}));
      });

      it('accepts - true', () => {
        const v4: Partial<FutureV4Config> = {
          useCssCascadeLayers: true,
        };
        expect(
          normalizeConfig({
            future: {
              v4,
            },
          }),
        ).toEqual(v4Containing({useCssCascadeLayers: true}));
      });

      it('accepts - false', () => {
        const v4: Partial<FutureV4Config> = {
          useCssCascadeLayers: false,
        };
        expect(
          normalizeConfig({
            future: {
              v4,
            },
          }),
        ).toEqual(v4Containing({useCssCascadeLayers: false}));
      });

      it('rejects - null', () => {
        const v4: Partial<FutureV4Config> = {
          // @ts-expect-error: invalid
          useCssCascadeLayers: 42,
        };
        expect(() =>
          normalizeConfig({
            future: {
              v4,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.v4.useCssCascadeLayers" must be a boolean
          "
        `);
      });

      it('rejects - number', () => {
        const v4: Partial<FutureV4Config> = {
          // @ts-expect-error: invalid
          useCssCascadeLayers: 42,
        };
        expect(() =>
          normalizeConfig({
            future: {
              v4,
            },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          ""future.v4.useCssCascadeLayers" must be a boolean
          "
        `);
      });
    });
  });
});
