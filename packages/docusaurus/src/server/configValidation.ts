/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  DEFAULT_PARSE_FRONT_MATTER,
  DEFAULT_STATIC_DIR_NAME,
  DEFAULT_I18N_DIR_NAME,
} from '@docusaurus/utils';
import {Joi, printWarning} from '@docusaurus/utils-validation';
import {
  addTrailingSlash,
  addLeadingSlash,
  removeTrailingSlash,
} from '@docusaurus/utils-common';
import logger from '@docusaurus/logger';
import type {
  FasterConfig,
  FutureConfig,
  FutureV4Config,
  StorageConfig,
} from '@docusaurus/types/src/config';
import type {
  DocusaurusConfig,
  I18nConfig,
  MarkdownConfig,
} from '@docusaurus/types';

const DEFAULT_I18N_LOCALE = 'en';

export const DEFAULT_I18N_CONFIG: I18nConfig = {
  defaultLocale: DEFAULT_I18N_LOCALE,
  path: DEFAULT_I18N_DIR_NAME,
  locales: [DEFAULT_I18N_LOCALE],
  localeConfigs: {},
};

export const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  type: 'localStorage',
  namespace: false,
};

export const DEFAULT_FASTER_CONFIG: FasterConfig = {
  swcJsLoader: false,
  swcJsMinimizer: false,
  swcHtmlMinimizer: false,
  lightningCssMinimizer: false,
  mdxCrossCompilerCache: false,
  rspackBundler: false,
  ssgWorkerThreads: false,
};

// When using the "faster: true" shortcut
export const DEFAULT_FASTER_CONFIG_TRUE: FasterConfig = {
  swcJsLoader: true,
  swcJsMinimizer: true,
  swcHtmlMinimizer: true,
  lightningCssMinimizer: true,
  mdxCrossCompilerCache: true,
  rspackBundler: true,
  ssgWorkerThreads: true,
};

export const DEFAULT_FUTURE_V4_CONFIG: FutureV4Config = {
  removeLegacyPostBuildHeadAttribute: false,
};

// When using the "v4: true" shortcut
export const DEFAULT_FUTURE_V4_CONFIG_TRUE: FutureV4Config = {
  removeLegacyPostBuildHeadAttribute: true,
};

export const DEFAULT_FUTURE_CONFIG: FutureConfig = {
  v4: DEFAULT_FUTURE_V4_CONFIG,
  experimental_faster: DEFAULT_FASTER_CONFIG,
  experimental_storage: DEFAULT_STORAGE_CONFIG,
  experimental_router: 'browser',
};

export const DEFAULT_MARKDOWN_CONFIG: MarkdownConfig = {
  format: 'mdx', // TODO change this to "detect" in Docusaurus v4?
  mermaid: false,
  preprocessor: undefined,
  parseFrontMatter: DEFAULT_PARSE_FRONT_MATTER,
  mdx1Compat: {
    comments: true,
    admonitions: true,
    headingIds: true,
  },
  anchors: {
    maintainCase: false,
  },
  remarkRehypeOptions: undefined,
};

export const DEFAULT_CONFIG: Pick<
  DocusaurusConfig,
  | 'i18n'
  | 'future'
  | 'onBrokenLinks'
  | 'onBrokenAnchors'
  | 'onBrokenMarkdownLinks'
  | 'onDuplicateRoutes'
  | 'plugins'
  | 'themes'
  | 'presets'
  | 'headTags'
  | 'stylesheets'
  | 'scripts'
  | 'clientModules'
  | 'customFields'
  | 'themeConfig'
  | 'titleDelimiter'
  | 'noIndex'
  | 'tagline'
  | 'baseUrlIssueBanner'
  | 'staticDirectories'
  | 'markdown'
> = {
  i18n: DEFAULT_I18N_CONFIG,
  future: DEFAULT_FUTURE_CONFIG,
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn', // TODO Docusaurus v4: change to throw
  onBrokenMarkdownLinks: 'warn',
  onDuplicateRoutes: 'warn',
  plugins: [],
  themes: [],
  presets: [],
  headTags: [],
  stylesheets: [],
  scripts: [],
  clientModules: [],
  customFields: {},
  themeConfig: {},
  titleDelimiter: '|',
  noIndex: false,
  tagline: '',
  baseUrlIssueBanner: true,
  staticDirectories: [DEFAULT_STATIC_DIR_NAME],
  markdown: DEFAULT_MARKDOWN_CONFIG,
};

function createPluginSchema(theme: boolean) {
  return Joi.alternatives()
    .try(
      Joi.function(),
      Joi.array()
        .ordered(Joi.function().required(), Joi.object().required())
        .length(2),
      Joi.string(),
      Joi.array()
        .ordered(Joi.string().required(), Joi.object().required())
        .length(2),
      Joi.any().valid(false, null),
    )
    .error((errors) => {
      errors.forEach((error) => {
        const validConfigExample = theme
          ? `Example valid theme config:
{
  themes: [
    ["@docusaurus/theme-classic",options],
    "./myTheme",
    ["./myTheme",{someOption: 42}],
    function myTheme() { },
    [function myTheme() { },options]
  ],
};`
          : `Example valid plugin config:
{
  plugins: [
    ["@docusaurus/plugin-content-docs",options],
    "./myPlugin",
    ["./myPlugin",{someOption: 42}],
    function myPlugin() { },
    [function myPlugin() { },options]
  ],
};`;

        error.message = ` => Bad Docusaurus ${
          theme ? 'theme' : 'plugin'
        } value ${error.path.reduce((acc, cur) =>
          typeof cur === 'string' ? `${acc}.${cur}` : `${acc}[${cur}]`,
        )}.
${validConfigExample}
`;
      });
      return errors;
    });
}

const PluginSchema = createPluginSchema(false);

const ThemeSchema = createPluginSchema(true);

const PresetSchema = Joi.alternatives()
  .try(
    Joi.string(),
    Joi.array()
      .items(Joi.string().required(), Joi.object().required())
      .length(2),
    Joi.any().valid(false, null),
  )
  .messages({
    'alternatives.types': `{#label} does not look like a valid preset config. A preset config entry should be one of:
- A tuple of [presetName, options], like \`["classic", \\{ blog: false \\}]\`, or
- A simple string, like \`"classic"\``,
  });

const LocaleConfigSchema = Joi.object({
  label: Joi.string(),
  htmlLang: Joi.string(),
  direction: Joi.string().equal('ltr', 'rtl').default('ltr'),
  calendar: Joi.string(),
  path: Joi.string(),
});

const I18N_CONFIG_SCHEMA = Joi.object<I18nConfig>({
  defaultLocale: Joi.string().required(),
  path: Joi.string().default(DEFAULT_I18N_CONFIG.path),
  locales: Joi.array().items().min(1).items(Joi.string().required()).required(),
  localeConfigs: Joi.object()
    .pattern(/.*/, LocaleConfigSchema)
    .default(DEFAULT_I18N_CONFIG.localeConfigs),
})
  .optional()
  .default(DEFAULT_I18N_CONFIG);

const FASTER_CONFIG_SCHEMA = Joi.alternatives()
  .try(
    Joi.object<FasterConfig>({
      swcJsLoader: Joi.boolean().default(DEFAULT_FASTER_CONFIG.swcJsLoader),
      swcJsMinimizer: Joi.boolean().default(
        DEFAULT_FASTER_CONFIG.swcJsMinimizer,
      ),
      swcHtmlMinimizer: Joi.boolean().default(
        DEFAULT_FASTER_CONFIG.swcHtmlMinimizer,
      ),
      lightningCssMinimizer: Joi.boolean().default(
        DEFAULT_FASTER_CONFIG.lightningCssMinimizer,
      ),
      mdxCrossCompilerCache: Joi.boolean().default(
        DEFAULT_FASTER_CONFIG.mdxCrossCompilerCache,
      ),
      rspackBundler: Joi.boolean().default(DEFAULT_FASTER_CONFIG.rspackBundler),
      ssgWorkerThreads: Joi.boolean().default(
        DEFAULT_FASTER_CONFIG.ssgWorkerThreads,
      ),
    }),
    Joi.boolean()
      .required()
      .custom((bool) =>
        bool ? DEFAULT_FASTER_CONFIG_TRUE : DEFAULT_FASTER_CONFIG,
      ),
  )
  .optional()
  .default(DEFAULT_FASTER_CONFIG);

const FUTURE_V4_SCHEMA = Joi.alternatives()
  .try(
    Joi.object<FutureV4Config>({
      removeLegacyPostBuildHeadAttribute: Joi.boolean().default(
        DEFAULT_FUTURE_V4_CONFIG.removeLegacyPostBuildHeadAttribute,
      ),
    }),
    Joi.boolean()
      .required()
      .custom((bool) =>
        bool ? DEFAULT_FUTURE_V4_CONFIG_TRUE : DEFAULT_FUTURE_V4_CONFIG,
      ),
  )
  .optional()
  .default(DEFAULT_FUTURE_V4_CONFIG);

const STORAGE_CONFIG_SCHEMA = Joi.object({
  type: Joi.string()
    .equal('localStorage', 'sessionStorage')
    .default(DEFAULT_STORAGE_CONFIG.type),
  namespace: Joi.alternatives()
    .try(Joi.string(), Joi.boolean())
    .default(DEFAULT_STORAGE_CONFIG.namespace),
})
  .optional()
  .default(DEFAULT_STORAGE_CONFIG);

const FUTURE_CONFIG_SCHEMA = Joi.object<FutureConfig>({
  v4: FUTURE_V4_SCHEMA,
  experimental_faster: FASTER_CONFIG_SCHEMA,
  experimental_storage: STORAGE_CONFIG_SCHEMA,
  experimental_router: Joi.string()
    .equal('browser', 'hash')
    .default(DEFAULT_FUTURE_CONFIG.experimental_router),
})
  .optional()
  .default(DEFAULT_FUTURE_CONFIG);

const SiteUrlSchema = Joi.string()
  .required()
  .custom((value: string, helpers) => {
    try {
      const {pathname} = new URL(value);
      if (pathname !== '/') {
        return helpers.error('docusaurus.subPathError', {pathname});
      }
    } catch {
      return helpers.error('any.invalid');
    }
    return removeTrailingSlash(value);
  })
  .messages({
    'any.invalid':
      '"{#value}" does not look like a valid URL. Make sure it has a protocol; for example, "https://example.com".',
    'docusaurus.subPathError':
      'The url is not supposed to contain a sub-path like "{#pathname}". Please use the baseUrl field for sub-paths.',
  });

// TODO move to @docusaurus/utils-validation
export const ConfigSchema = Joi.object<DocusaurusConfig>({
  baseUrl: Joi
    // Weird Joi trick needed, otherwise value '' is not normalized...
    .alternatives()
    .try(Joi.string().required().allow(''))
    .required()
    .custom((value: string) => addLeadingSlash(addTrailingSlash(value))),
  baseUrlIssueBanner: Joi.boolean().default(DEFAULT_CONFIG.baseUrlIssueBanner),
  favicon: Joi.string().optional(),
  title: Joi.string().required(),
  url: SiteUrlSchema,
  trailingSlash: Joi.boolean(), // No default value! undefined = retrocompatible legacy behavior!
  i18n: I18N_CONFIG_SCHEMA,
  future: FUTURE_CONFIG_SCHEMA,
  onBrokenLinks: Joi.string()
    .equal('ignore', 'log', 'warn', 'throw')
    .default(DEFAULT_CONFIG.onBrokenLinks),
  onBrokenAnchors: Joi.string()
    .equal('ignore', 'log', 'warn', 'throw')
    .default(DEFAULT_CONFIG.onBrokenAnchors),
  onBrokenMarkdownLinks: Joi.string()
    .equal('ignore', 'log', 'warn', 'throw')
    .default(DEFAULT_CONFIG.onBrokenMarkdownLinks),
  onDuplicateRoutes: Joi.string()
    .equal('ignore', 'log', 'warn', 'throw')
    .default(DEFAULT_CONFIG.onDuplicateRoutes),
  organizationName: Joi.string().allow(''),
  staticDirectories: Joi.array()
    .items(Joi.string())
    .default(DEFAULT_CONFIG.staticDirectories),
  projectName: Joi.string().allow(''),
  deploymentBranch: Joi.string().optional(),
  customFields: Joi.object().unknown().default(DEFAULT_CONFIG.customFields),
  githubHost: Joi.string(),
  githubPort: Joi.string(),
  plugins: Joi.array().items(PluginSchema).default(DEFAULT_CONFIG.plugins),
  themes: Joi.array().items(ThemeSchema).default(DEFAULT_CONFIG.themes),
  presets: Joi.array().items(PresetSchema).default(DEFAULT_CONFIG.presets),
  themeConfig: Joi.object().unknown().default(DEFAULT_CONFIG.themeConfig),
  scripts: Joi.array()
    .items(
      Joi.string(),
      Joi.object({
        src: Joi.string().required(),
        async: Joi.bool(),
        defer: Joi.bool(),
      })
        // See https://github.com/facebook/docusaurus/issues/3378
        .unknown(),
    )
    .messages({
      'array.includes':
        '{#label} is invalid. A script must be a plain string (the src), or an object with at least a "src" property.',
    })
    .default(DEFAULT_CONFIG.scripts),
  ssrTemplate: Joi.string(),
  headTags: Joi.array()
    .items(
      Joi.object({
        tagName: Joi.string().required(),
        attributes: Joi.object()
          .pattern(/[\w-]+/, Joi.string())
          .required(),
      }).unknown(),
    )
    .messages({
      'array.includes':
        '{#label} is invalid. A headTag must be an object with at least a "tagName" and an "attributes" property.',
    })
    .default(DEFAULT_CONFIG.headTags),
  stylesheets: Joi.array()
    .items(
      Joi.string(),
      Joi.object({
        href: Joi.string().required(),
        type: Joi.string(),
      }).unknown(),
    )
    .messages({
      'array.includes':
        '{#label} is invalid. A stylesheet must be a plain string (the href), or an object with at least a "href" property.',
    })
    .default(DEFAULT_CONFIG.stylesheets),
  clientModules: Joi.array()
    .items(Joi.string())
    .default(DEFAULT_CONFIG.clientModules),
  tagline: Joi.string().allow('').default(DEFAULT_CONFIG.tagline),
  titleDelimiter: Joi.string().default(DEFAULT_CONFIG.titleDelimiter),
  noIndex: Joi.bool().default(DEFAULT_CONFIG.noIndex),
  webpack: Joi.object({
    jsLoader: Joi.alternatives()
      .try(Joi.string().equal('babel'), Joi.function())
      .optional(),
  }).optional(),
  markdown: Joi.object({
    format: Joi.string()
      .equal('mdx', 'md', 'detect')
      .default(DEFAULT_CONFIG.markdown.format),
    parseFrontMatter: Joi.function().default(
      () => DEFAULT_CONFIG.markdown.parseFrontMatter,
    ),
    mermaid: Joi.boolean().default(DEFAULT_CONFIG.markdown.mermaid),
    preprocessor: Joi.function()
      .arity(1)
      .optional()
      .default(() => DEFAULT_CONFIG.markdown.preprocessor),
    mdx1Compat: Joi.object({
      comments: Joi.boolean().default(
        DEFAULT_CONFIG.markdown.mdx1Compat.comments,
      ),
      admonitions: Joi.boolean().default(
        DEFAULT_CONFIG.markdown.mdx1Compat.admonitions,
      ),
      headingIds: Joi.boolean().default(
        DEFAULT_CONFIG.markdown.mdx1Compat.headingIds,
      ),
    }).default(DEFAULT_CONFIG.markdown.mdx1Compat),
    remarkRehypeOptions:
      // add proper external options validation?
      // Not sure if it's a good idea, validation is likely to become stale
      // See https://github.com/remarkjs/remark-rehype#options
      Joi.object().unknown(),
    anchors: Joi.object({
      maintainCase: Joi.boolean().default(
        DEFAULT_CONFIG.markdown.anchors.maintainCase,
      ),
    }).default(DEFAULT_CONFIG.markdown.anchors),
  }).default(DEFAULT_CONFIG.markdown),
}).messages({
  'docusaurus.configValidationWarning':
    'Docusaurus config validation warning. Field {#label}: {#warningMessage}',
});

// Expressing this kind of logic in Joi is a pain
// We also want to decouple logic from Joi: easier to remove it later!
function ensureDocusaurusConfigConsistency(config: DocusaurusConfig) {
  if (
    config.future.experimental_faster.ssgWorkerThreads &&
    !config.future.v4.removeLegacyPostBuildHeadAttribute
  ) {
    throw new Error(
      `Docusaurus config ${logger.code(
        'future.experimental_faster.ssgWorkerThreads',
      )} requires the future flag ${logger.code(
        'future.v4.removeLegacyPostBuildHeadAttribute',
      )} to be turned on.
If you use Docusaurus Faster, we recommend that you also activate Docusaurus v4 future flags: ${logger.code(
        '{future: {v4: true}}',
      )}`,
    );
  }
}

// TODO move to @docusaurus/utils-validation
export function validateConfig(
  config: unknown,
  siteConfigPath: string,
): DocusaurusConfig {
  const {error, warning, value} = ConfigSchema.validate(config, {
    abortEarly: false,
  });

  printWarning(warning);

  if (error) {
    const unknownFields = error.details.reduce((formattedError, err) => {
      if (err.type === 'object.unknown') {
        return `${formattedError}"${err.path.reduce((acc, cur) =>
          typeof cur === 'string' ? `${acc}.${cur}` : `${acc}[${cur}]`,
        )}",`;
      }
      return formattedError;
    }, '');
    let formattedError = error.details.reduce(
      (accumulatedErr, err) =>
        err.type !== 'object.unknown'
          ? `${accumulatedErr}${err.message}\n`
          : accumulatedErr,
      '',
    );
    formattedError = unknownFields
      ? `${formattedError}These field(s) (${unknownFields}) are not recognized in ${siteConfigPath}.\nIf you still want these fields to be in your configuration, put them in the "customFields" field.\nSee https://docusaurus.io/docs/api/docusaurus-config/#customfields`
      : formattedError;
    throw new Error(formattedError);
  }

  ensureDocusaurusConfigConsistency(value);

  return value;
}
