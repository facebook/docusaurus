/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {DocusaurusContext, Plugin} from '@docusaurus/types';
import {ThemeConfig} from '@docusaurus/theme-common';
import {getTranslationFiles, translateThemeConfig} from './translations';
import path from 'path';
import Module from 'module';
import type {AcceptedPlugin, Result, Plugin as PostCssPlugin} from 'postcss';
import rtlcss from 'rtlcss';
import {readDefaultCodeTranslationMessages} from '@docusaurus/utils';

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
  } else {
    if (
      respectPrefersColorScheme &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setDataThemeAttribute('dark');
    } else if (
      respectPrefersColorScheme &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      setDataThemeAttribute('light');
    } else {
      setDataThemeAttribute(defaultMode === 'dark' ? 'dark' : 'light');
    }
  }
})();`;
};

function getInfimaCSSFile(direction) {
  return `infima/dist/css/default/default${
    direction === 'rtl' ? '-rtl' : ''
  }.css`;
}

type PluginOptions = {
  customCss?: string;
};

export default function docusaurusThemeClassic(
  context: DocusaurusContext, // TODO: LoadContext is missing some of properties
  options: PluginOptions,
): Plugin<void> {
  const {
    siteConfig: {themeConfig: roughlyTypedThemeConfig},
    i18n: {currentLocale, localeConfigs},
  } = context;
  const themeConfig = (roughlyTypedThemeConfig || {}) as ThemeConfig;
  const {colorMode, prism: {additionalLanguages = []} = {}} = themeConfig;
  const {customCss} = options || {};
  const {direction} = localeConfigs[currentLocale];

  return {
    name: 'docusaurus-theme-classic',

    /*
    Does not seem needed: webpack can already hot reload theme files
    getPathsToWatch() {
      return [
        path.join(__dirname, '..', 'lib'),
        path.join(__dirname, '..', 'lib-next'),
      ];
    },
     */

    getThemePath() {
      return path.join(__dirname, '..', 'lib-next', 'theme');
    },

    getTypeScriptThemePath() {
      return path.resolve(__dirname, '..', 'src', 'theme');
    },

    getTranslationFiles: async () => getTranslationFiles({themeConfig}),
    translateThemeConfig,

    getDefaultCodeTranslationMessages: () => {
      return readDefaultCodeTranslationMessages({
        dirPath: path.resolve(__dirname, '..', 'codeTranslations'),
        locale: currentLocale,
      });
    },

    getClientModules() {
      const modules = [
        require.resolve(getInfimaCSSFile(direction)),
        path.resolve(__dirname, './prism-include-languages'),
      ];

      if (customCss) {
        if (Array.isArray(customCss)) {
          modules.push(...customCss);
        } else {
          modules.push(customCss);
        }
      }

      return modules;
    },

    configureWebpack() {
      const prismLanguages = additionalLanguages
        .map((lang) => `prism-${lang}`)
        .join('|');

      return {
        ignoreWarnings: [
          // See https://github.com/facebook/docusaurus/pull/3382
          (e) => e.message.includes("Can't resolve '@theme-init/hooks/useDocs"),
        ],
        plugins: [
          new ContextReplacementPlugin(
            /prismjs[\\/]components$/,
            new RegExp(`^./(${prismLanguages})$`),
          ),
        ],
      };
    },

    configurePostCss(postCssOptions: {plugins: AcceptedPlugin[]}) {
      if (direction === 'rtl') {
        const resolvedInfimaFile = require.resolve(getInfimaCSSFile(direction));
        const plugin: PostCssPlugin = {
          postcssPlugin: 'RtlCssPlugin',
          prepare: (result: Result) => {
            const file = result.root?.source?.input?.file;
            // Skip Infima as we are using the its RTL version.
            if (file === resolvedInfimaFile) {
              return {};
            }
            return rtlcss(result.root);
          },
        };
        postCssOptions.plugins.push(plugin);
      }

      return postCssOptions;
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
}

const swizzleAllowedComponents = [
  'CodeBlock',
  'DocSidebar',
  'Footer',
  'NotFound',
  'SearchBar',
  'IconArrow',
  'IconEdit',
  'IconMenu',
  'hooks/useTheme',
  'prism-include-languages',
];

export function getSwizzleComponentList(): string[] {
  return swizzleAllowedComponents;
}

export {validateThemeConfig} from './validateThemeConfig';
