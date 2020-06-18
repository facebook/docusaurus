/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const Module = require('module');
const yup = require('yup');

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
const noFlash = (defaultDarkMode) => `(function() {
  var defaultDarkMode = ${defaultDarkMode};

  function setDataThemeAttribute(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function getPreferredTheme() {
    var theme = null;
    try {
      theme = localStorage.getItem('${storageKey}');
    } catch (err) {}

    return theme;
  }

  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  var preferredTheme = getPreferredTheme();
  if (preferredTheme !== null) {
    setDataThemeAttribute(preferredTheme);
  } else if (darkQuery.matches || defaultDarkMode) {
    setDataThemeAttribute('dark');
  }
})();`;

module.exports = function (context, options) {
  const {
    siteConfig: {themeConfig},
  } = context;
  const {
    disableDarkMode = false,
    defaultDarkMode = false,
    prism: {additionalLanguages = []} = {},
  } = themeConfig || {};
  const {customCss} = options || {};

  return {
    name: 'docusaurus-theme-classic',

    getThemePath() {
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
      if (disableDarkMode) {
        return {};
      }
      return {
        preBodyTags: [
          {
            tagName: 'script',
            attributes: {
              type: 'text/javascript',
            },
            innerHTML: noFlash(defaultDarkMode),
          },
        ],
      };
    },
  };
};

const NavbarLinkSchema = yup.object().shape({
  items: yup
    .array()
    .optional()
    .of(yup.lazy(() => NavbarLinkSchema.default(undefined))),
  to: yup.string(),
  href: yup.string().url(),
  prependBaseUrlToHref: yup.bool().default(true),
  label: yup.string(),
  position: yup.string().oneOf(['left', 'right']).default('left'),
  activeBasePath: yup.string(),
  activeBaseRegex: yup.string(),
  className: yup.string(),
  'aria-label': yup.string(),
});

const ThemeConfigSchema = yup
  .object()
  .shape({
    disableDarkMode: yup.bool().default(false),
    image: yup.string(),
    announcementBar: yup
      .object()
      .shape({
        id: yup.string().required(),
        content: yup.string().required(),
        backgroundColor: yup.string().default('#fff'),
        textColor: yup.string().default('#000'),
      })
      .optional(),
    navbar: yup.object().shape({
      hideOnScroll: yup.bool().default(false),
      links: yup.array().of(NavbarLinkSchema),
      title: yup.string().required(),
      logo: yup.object().shape({
        alt: yup.string(),
        src: yup.string().required(),
        srcDark: yup
          .string()
          .when('src', (value, schema) => schema.default(value)),
        href: yup.string(),
        target: yup.string(),
      }),
    }),
    footer: yup.object().shape({
      style: yup.string().oneOf(['dark', 'light']).default('light'),
      logo: yup.object().shape({
        alt: yup.string(),
        src: yup.string().required(),
        href: yup.string(),
      }),
      copyright: yup.string(),
      link: yup.array().of(
        yup.object().shape({
          title: yup.string().required(),
          items: yup.array().of(
            yup.object().shape({
              to: yup.string(),
              href: yup.string().url(),
              html: yup.string(),
              label: yup.string(),
            }),
          ),
        }),
      ),
    }),
  })
  .defined();

module.exports.validateThemeConfig = ({validate, themeConfig}) => {
  return validate(ThemeConfigSchema, themeConfig);
};
