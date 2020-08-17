/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import merge from 'lodash/merge';

const {
  validateThemeConfig,
  DEFAULT_COLOR_MODE_CONFIG,
} = require('../validateThemeConfig');

const mergeDefault = (config) => merge({}, DEFAULT_COLOR_MODE_CONFIG, config);

function testValidateThemeConfig(themeConfig) {
  function validate(schema, cfg) {
    const {value, error} = schema.validate(cfg, {
      convert: false,
    });
    if (error) {
      throw error;
    }
    return value;
  }

  return validateThemeConfig({themeConfig, validate});
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
      },
      image: 'img/docusaurus-soc.png',
      navbar: {
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
            nextVersionLabel: '2.0.0-next',
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
      colorMode: DEFAULT_COLOR_MODE_CONFIG,
      ...userConfig,
    });
  });

  test('should accept valid prism config', () => {
    const prismConfig = {
      prism: {
        additionalLanguages: ['kotlin', 'java'],
      },
    };
    expect(testValidateThemeConfig(prismConfig)).toEqual({
      colorMode: DEFAULT_COLOR_MODE_CONFIG,
      ...prismConfig,
    });
  });

  describe('color mode config', () => {
    test('minimal config', () => {
      const colorMode = {
        switchConfig: {
          darkIcon: '🌙',
        },
      };
      expect(testValidateThemeConfig({colorMode})).toEqual({
        colorMode: mergeDefault(colorMode),
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
        colorMode: mergeDefault(colorMode),
      });
    });

    test('undefined config', () => {
      const colorMode = undefined;
      expect(testValidateThemeConfig({colorMode})).toEqual({
        colorMode: mergeDefault(colorMode),
      });
    });

    test('empty config', () => {
      const colorMode = {};
      expect(testValidateThemeConfig({colorMode})).toEqual({
        colorMode: mergeDefault(colorMode),
      });
    });

    test('empty switch config', () => {
      const colorMode = {
        switchConfig: {},
      };
      expect(testValidateThemeConfig({colorMode})).toEqual({
        colorMode: mergeDefault(colorMode),
      });
    });
  });
});
