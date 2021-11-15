/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {merge} from 'lodash';

const {ThemeConfigSchema, DEFAULT_CONFIG} = require('../validateThemeConfig');

const {normalizeThemeConfig} = require('@docusaurus/utils-validation');
const theme = require('prism-react-renderer/themes/github');
const darkTheme = require('prism-react-renderer/themes/dracula');

function testValidateThemeConfig(partialThemeConfig) {
  return normalizeThemeConfig(ThemeConfigSchema, {
    ...DEFAULT_CONFIG,
    ...partialThemeConfig,
  });
}

function testOk(partialThemeConfig) {
  expect(
    testValidateThemeConfig({...DEFAULT_CONFIG, ...partialThemeConfig}),
  ).toEqual({
    ...DEFAULT_CONFIG,
    ...partialThemeConfig,
  });
}

describe('themeConfig', () => {
  test('should accept valid theme config', () => {
    const userConfig = {
      prism: {
        theme,
        darkTheme,
        defaultLanguage: 'javascript',
        additionalLanguages: ['kotlin', 'java'],
      },
      announcementBar: {
        id: 'supportus',
        content: 'pls support',
        backgroundColor: '#fff',
        textColor: '#000',
        isCloseable: true,
      },
      image: 'img/docusaurus-soc.png',
      navbar: {
        style: 'primary',
        hideOnScroll: true,
        title: 'Docusaurus',
        logo: {
          alt: 'Docusaurus Logo',
          src: 'img/docusaurus.svg',
          srcDark: 'img/docusaurus_keytar.svg',
        },
        items: [
          {
            type: 'docsVersionDropdown',
            position: 'left',
            dropdownItemsBefore: [],
            dropdownItemsAfter: [],
          },
          {
            to: 'docs/next/support',
            label: 'Community',
            position: 'left',
            activeBaseRegex: `docs/next/(support|team|resources)`,
            'aria-label': 'Community',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {
                label: 'Introduction',
                to: 'docs',
              },
            ],
          },
        ],
        logo: {
          alt: 'Facebook Open Source Logo',
          src: 'img/oss_logo.png',
          href: 'https://opensource.facebook.com',
        },
        copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc. Built with Docusaurus.`,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5,
      },
    };
    expect(testValidateThemeConfig(userConfig)).toEqual({
      ...DEFAULT_CONFIG,
      ...userConfig,
    });
  });

  test('should allow possible types of navbar items', () => {
    const config = {
      navbar: {
        items: [
          // Doc link
          {
            type: 'doc',
            position: 'left',
            docId: 'intro',
            label: 'Introduction',
          },
          // Regular link
          {
            to: '/guide/',
            label: 'Guide',
            position: 'left',
            activeBaseRegex: '/guide/',
          },
          // Regular dropdown
          {
            label: 'Community',
            position: 'right',
            items: [
              {
                label: 'Facebook',
                href: 'https://.facebook.com/',
                target: '_self',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
                className: 'github-link',
              },
            ],
          },
          // Dropdown with name
          {
            type: 'dropdown',
            label: 'Tools',
            position: 'left',
            items: [
              {
                type: 'doc',
                docId: 'npm',
                label: 'NPM',
              },
              {
                to: '/yarn',
                label: 'Yarn',
              },
            ],
          },
          // Doc version dropdown
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
            dropdownItemsBefore: [
              {
                href: 'https://www.npmjs.com/package/docusaurus?activeTab=versions',
                label: 'Versions on npm',
                className: 'npm-styled',
                target: '_self',
              },
            ],
            dropdownItemsAfter: [
              {
                to: '/versions',
                label: 'All versions',
                className: 'all_vers',
              },
            ],
          },
          // External link with custom data attribute
          {
            href: 'https://github.com/facebook/docusaurus',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
          // Docs version
          {
            type: 'docsVersion',
            position: 'left',
            label: 'Current version',
          },
        ],
      },
    };
    expect(testValidateThemeConfig(config)).toEqual({
      ...DEFAULT_CONFIG,
      navbar: {
        ...DEFAULT_CONFIG.navbar,
        ...config.navbar,
      },
    });
  });

  test('should reject unknown navbar item type', () => {
    const config = {
      navbar: {
        items: [
          {
            type: 'joke',
            position: 'left',
            label: 'haha',
          },
        ],
      },
    };
    expect(() =>
      testValidateThemeConfig(config),
    ).toThrowErrorMatchingInlineSnapshot(`"Bad navbar item type joke"`);
  });

  test('should reject nested dropdowns', () => {
    const config = {
      navbar: {
        items: [
          {
            position: 'left',
            label: 'Nested',
            items: [
              {
                label: 'Still a dropdown',
                items: [
                  {
                    label: 'Should reject this',
                    to: '/rejected',
                  },
                ],
              },
            ],
          },
        ],
      },
    };
    expect(() =>
      testValidateThemeConfig(config),
    ).toThrowErrorMatchingInlineSnapshot(`"Nested dropdowns are not allowed"`);
  });

  test('should reject nested dropdowns', () => {
    const config = {
      navbar: {
        items: [
          {
            position: 'left',
            label: 'Nested',
            items: [{type: 'docsVersionDropdown'}],
          },
        ],
      },
    };
    expect(() =>
      testValidateThemeConfig(config),
    ).toThrowErrorMatchingInlineSnapshot(`"Nested dropdowns are not allowed"`);
  });

  test('should reject position attribute within dropdown', () => {
    const config = {
      navbar: {
        items: [
          {
            position: 'left',
            label: 'Dropdown',
            items: [
              {
                label: 'Hi',
                position: 'left',
                to: '/link',
              },
            ],
          },
        ],
      },
    };
    expect(() =>
      testValidateThemeConfig(config),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"navbar.items[0].items[0].position\\" is not allowed"`,
    );
  });

  test('should give friendly error when href and to coexist', () => {
    const config = {
      navbar: {
        items: [
          {
            position: 'left',
            label: 'Nested',
            to: '/link',
            href: 'http://example.com/link',
          },
        ],
      },
    };
    expect(() =>
      testValidateThemeConfig(config),
    ).toThrowErrorMatchingInlineSnapshot(
      `"One and only one between \\"to\\" and \\"href\\" should be provided"`,
    );
  });

  test('should allow empty alt tags for the logo image in the header', () => {
    const altTagConfig = {
      navbar: {
        logo: {
          alt: '',
          src: '/arbitrary-logo.png',
        },
        hideOnScroll: false,
      },
    };
    expect(testValidateThemeConfig(altTagConfig)).toEqual({
      ...DEFAULT_CONFIG,
      navbar: {
        ...DEFAULT_CONFIG.navbar,
        ...altTagConfig.navbar,
      },
    });
  });

  test('should allow empty alt tags for the logo image in the footer', () => {
    const partialConfig = {
      footer: {
        logo: {
          alt: '',
          src: '/arbitrary-logo.png',
        },
      },
    };
    const normalizedConfig = testValidateThemeConfig(partialConfig);

    expect(normalizedConfig).toEqual({
      ...normalizedConfig,
      footer: {
        ...normalizedConfig.footer,
        ...partialConfig.footer,
      },
    });
  });

  test('should allow width and height specification for logo ', () => {
    const altTagConfig = {
      navbar: {
        logo: {
          alt: '',
          src: '/arbitrary-logo.png',
          srcDark: '/arbitrary-dark-logo.png',
          width: '20px',
          height: '20%',
        },
      },
    };
    expect(testValidateThemeConfig(altTagConfig)).toEqual({
      ...DEFAULT_CONFIG,
      navbar: {
        ...DEFAULT_CONFIG.navbar,
        ...altTagConfig.navbar,
      },
    });
  });

  test('should accept valid prism config', () => {
    const prismConfig = {
      prism: {
        additionalLanguages: ['kotlin', 'java'],
      },
    };
    expect(testValidateThemeConfig(prismConfig)).toEqual({
      ...DEFAULT_CONFIG,
      ...prismConfig,
    });
  });

  describe('customCss config', () => {
    test('should accept customCss undefined', () => {
      testOk({
        customCss: undefined,
      });
    });

    test('should accept customCss string', () => {
      testOk({
        customCss: './path/to/cssFile.css',
      });
    });

    test('should accept customCss string array', () => {
      testOk({
        customCss: ['./path/to/cssFile.css', './path/to/cssFile2.css'],
      });
    });

    test('should reject customCss number', () => {
      expect(() =>
        testValidateThemeConfig({
          customCss: 42,
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"\\"customCss\\" must be one of [array, string]"`,
      );
    });
  });

  describe('color mode config', () => {
    const withDefaultValues = (colorMode) =>
      merge({}, DEFAULT_CONFIG.colorMode, colorMode);

    test('minimal config', () => {
      const colorMode = {
        switchConfig: {
          darkIcon: '🌙',
        },
      };
      expect(testValidateThemeConfig({colorMode})).toEqual({
        ...DEFAULT_CONFIG,
        colorMode: withDefaultValues(colorMode),
      });
    });

    test('max config', () => {
      const colorMode = {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
        switchConfig: {
          darkIcon: '🌙',
          darkIconStyle: {
            marginTop: '1px',
            marginLeft: '2px',
          },
          lightIcon: '☀️',
          lightIconStyle: {
            marginLeft: '1px',
          },
        },
      };
      expect(testValidateThemeConfig({colorMode})).toEqual({
        ...DEFAULT_CONFIG,
        colorMode: withDefaultValues(colorMode),
      });
    });

    test('undefined config', () => {
      const colorMode = undefined;
      expect(testValidateThemeConfig({colorMode})).toEqual({
        ...DEFAULT_CONFIG,
        colorMode: withDefaultValues(colorMode),
      });
    });

    test('empty config', () => {
      const colorMode = {};
      expect(testValidateThemeConfig({colorMode})).toEqual({
        ...DEFAULT_CONFIG,
        colorMode: {
          ...DEFAULT_CONFIG.colorMode,
          ...colorMode,
        },
      });
    });

    test('empty switch config', () => {
      const colorMode = {
        switchConfig: {},
      };
      expect(testValidateThemeConfig({colorMode})).toEqual({
        ...DEFAULT_CONFIG,
        colorMode: withDefaultValues(colorMode),
      });
    });
  });
});

describe('themeConfig tableOfContents', () => {
  test('toc undefined', () => {
    const tableOfContents = undefined;
    expect(testValidateThemeConfig({tableOfContents})).toEqual({
      ...DEFAULT_CONFIG,
      tableOfContents: {
        minHeadingLevel: DEFAULT_CONFIG.tableOfContents.minHeadingLevel,
        maxHeadingLevel: DEFAULT_CONFIG.tableOfContents.maxHeadingLevel,
      },
    });
  });

  test('toc empty', () => {
    const tableOfContents = {};
    expect(testValidateThemeConfig({tableOfContents})).toEqual({
      ...DEFAULT_CONFIG,
      tableOfContents: {
        minHeadingLevel: DEFAULT_CONFIG.tableOfContents.minHeadingLevel,
        maxHeadingLevel: DEFAULT_CONFIG.tableOfContents.maxHeadingLevel,
      },
    });
  });

  test('toc with min', () => {
    const tableOfContents = {
      minHeadingLevel: 3,
    };
    expect(testValidateThemeConfig({tableOfContents})).toEqual({
      ...DEFAULT_CONFIG,
      tableOfContents: {
        minHeadingLevel: 3,
        maxHeadingLevel: DEFAULT_CONFIG.tableOfContents.maxHeadingLevel,
      },
    });
  });

  test('toc with max', () => {
    const tableOfContents = {
      maxHeadingLevel: 5,
    };
    expect(testValidateThemeConfig({tableOfContents})).toEqual({
      ...DEFAULT_CONFIG,
      tableOfContents: {
        minHeadingLevel: DEFAULT_CONFIG.tableOfContents.minHeadingLevel,
        maxHeadingLevel: 5,
      },
    });
  });

  test('toc with min 2.5', () => {
    const tableOfContents = {
      minHeadingLevel: 2.5,
    };
    expect(() =>
      testValidateThemeConfig({tableOfContents}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"tableOfContents.minHeadingLevel\\" must be an integer"`,
    );
  });

  test('toc with max 2.5', () => {
    const tableOfContents = {
      maxHeadingLevel: 2.5,
    };
    expect(() =>
      testValidateThemeConfig({tableOfContents}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"tableOfContents.maxHeadingLevel\\" must be an integer"`,
    );
  });

  test('toc with min 1', () => {
    const tableOfContents = {
      minHeadingLevel: 1,
    };
    expect(() =>
      testValidateThemeConfig({tableOfContents}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"tableOfContents.minHeadingLevel\\" must be greater than or equal to 2"`,
    );
  });

  test('toc with min 7', () => {
    const tableOfContents = {
      minHeadingLevel: 7,
    };
    expect(() =>
      testValidateThemeConfig({tableOfContents}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"tableOfContents.minHeadingLevel\\" must be less than or equal to ref:maxHeadingLevel"`,
    );
  });

  test('toc with max 1', () => {
    const tableOfContents = {
      maxHeadingLevel: 1,
    };
    expect(() =>
      testValidateThemeConfig({tableOfContents}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"tableOfContents.maxHeadingLevel\\" must be greater than or equal to 2"`,
    );
  });

  test('toc with max 7', () => {
    const tableOfContents = {
      maxHeadingLevel: 7,
    };
    expect(() =>
      testValidateThemeConfig({tableOfContents}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"tableOfContents.maxHeadingLevel\\" must be less than or equal to 6"`,
    );
  });

  test('toc with bad min 5 + max 3', () => {
    const tableOfContents = {
      minHeadingLevel: 5,
      maxHeadingLevel: 3,
    };
    expect(() =>
      testValidateThemeConfig({tableOfContents}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"tableOfContents.minHeadingLevel\\" must be less than or equal to ref:maxHeadingLevel"`,
    );
  });
});
