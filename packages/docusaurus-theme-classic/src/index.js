/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const Module = require('module');
const Joi = require('@hapi/joi');

const createRequire = Module.createRequire || Module.createRequireFromPath;
const requireFromDocusaurusCore = createRequire(
  require.resolve('@docusaurus/core/package.json'),
);
const ContextReplacementPlugin = requireFromDocusaurusCore(
  'webpack/lib/ContextReplacementPlugin',
);

// Need to be inlined to prevent dark mode FOUC
// Make sure that the 'storageKey' is the same as the one in `/theme/hooks/useTheme.js`
const storageKey = 'theme';
const noFlashColorMode = ({defaultMode, respectPrefersColorScheme}) => {
  return `(function() {
  var defaultMode = '${defaultMode}';
  var respectPrefersColorScheme = ${respectPrefersColorScheme};

  function setDataThemeAttribute(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function getStoredTheme() {
    var theme = null;
    try {
      theme = localStorage.getItem('${storageKey}');
    } catch (err) {}
    return theme;
  }

  var storedTheme = getStoredTheme();
  if (storedTheme !== null) {
    setDataThemeAttribute(storedTheme);
  }
  else {
    if ( respectPrefersColorScheme && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
      setDataThemeAttribute('dark');
    }
    else if ( respectPrefersColorScheme && window.matchMedia('(prefers-color-scheme: light)').matches ) {
      setDataThemeAttribute('light');
    }
    else {
      setDataThemeAttribute(defaultMode === 'dark' ? 'dark' : 'light');
    }
  }
})();`;
};

module.exports = function (context, options) {
  const {
    siteConfig: {themeConfig},
  } = context;
  const {colorMode, prism: {additionalLanguages = []} = {}} = themeConfig || {};
  const {customCss} = options || {};

  return {
    name: 'docusaurus-theme-classic',

    getThemePath() {
      return path.join(__dirname, '..', 'lib', 'theme');
    },

    getTypeScriptThemePath() {
      return path.resolve(__dirname, './theme');
    },

    getClientModules() {
      const modules = [
        require.resolve('infima/dist/css/default/default.css'),
        path.resolve(__dirname, './prism-include-languages'),
      ];

      if (customCss) {
        modules.push(customCss);
      }

      return modules;
    },

    configureWebpack() {
      const prismLanguages = additionalLanguages
        .map((lang) => `prism-${lang}`)
        .join('|');

      return {
        plugins: [
          new ContextReplacementPlugin(
            /prismjs[\\/]components$/,
            new RegExp(`^./(${prismLanguages})$`),
          ),
        ],
      };
    },

    injectHtmlTags() {
      return {
        preBodyTags: [
          {
            tagName: 'script',
            attributes: {
              type: 'text/javascript',
            },
            innerHTML: noFlashColorMode(colorMode),
          },
        ],
      };
    },
  };
};

const NavbarLinkSchema = Joi.object({
  items: Joi.array().optional().items(Joi.link('#navbarLinkSchema')),
  to: Joi.string(),
  href: Joi.string().uri(),
  prependBaseUrlToHref: Joi.bool().default(true),
  label: Joi.string(),
  position: Joi.string().equal('left', 'right').default('left'),
  activeBasePath: Joi.string(),
  activeBaseRegex: Joi.string(),
  className: Joi.string(),
  'aria-label': Joi.string(),
})
  .xor('href', 'to')
  .id('navbarLinkSchema');

const ColorModeSchema = Joi.object({
  defaultMode: Joi.string().equal('dark', 'light').default('light'),
  disableSwitch: Joi.bool().default(false),
  respectPrefersColorScheme: Joi.bool().default(false),
}).default({
  defaultMode: 'light',
  disableSwitch: false,
  respectPrefersColorScheme: false,
});

const ThemeConfigSchema = Joi.object({
  disableDarkMode: Joi.any().forbidden(false).messages({
    'any.unknown':
      'disableDarkMode theme config is deprecated. Please use the new colorMode attribute. You likely want: config.themeConfig.colorMode.disableSwitch = true',
  }),
  defaultDarkMode: Joi.any().forbidden(false).messages({
    'any.unknown':
      'defaultDarkMode theme config is deprecated. Please use the new colorMode attribute. You likely want: config.themeConfig.colorMode.defaultMode = "dark"',
  }),
  colorMode: ColorModeSchema,
  image: Joi.string(),
  announcementBar: Joi.object({
    id: Joi.string(),
    content: Joi.string(),
    backgroundColor: Joi.string().default('#fff'),
    textColor: Joi.string().default('#000'),
  }).optional(),
  navbar: Joi.object({
    hideOnScroll: Joi.bool().default(false),
    links: Joi.array().items(NavbarLinkSchema),
    title: Joi.string().required(),
    logo: Joi.object({
      alt: Joi.string(),
      src: Joi.string().required(),
      srcDark: Joi.string(),
      href: Joi.string(),
      target: Joi.string(),
    }),
  }),
  footer: Joi.object({
    style: Joi.string().equal('dark', 'light').default('light'),
    logo: Joi.object({
      alt: Joi.string(),
      src: Joi.string(),
      href: Joi.string(),
    }),
    copyright: Joi.string(),
    links: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        items: Joi.array().items(
          Joi.object({
            to: Joi.string(),
            href: Joi.string().uri(),
            html: Joi.string(),
            label: Joi.string(),
          })
            .xor('to', 'href', 'html')
            .with('to', 'label')
            .with('href', 'label')
            .nand('html', 'label'),
        ),
      }),
    ),
  }),
});

module.exports.validateThemeConfig = ({validate, themeConfig}) => {
  return validate(ThemeConfigSchema, themeConfig);
};
