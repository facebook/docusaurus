/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import merge from 'lodash/merge';

const {ThemeConfigSchema, DEFAULT_CONFIG} = require('../validateThemeConfig');

const {normalizeThemeConfig} = require('@docusaurus/utils-validation');

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
        theme: require('prism-react-renderer/themes/github'),
        darkTheme: require('prism-react-renderer/themes/dracula'),
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
    };
    expect(testValidateThemeConfig(userConfig)).toEqual({
      ...DEFAULT_CONFIG,
      ...userConfig,
    });
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
