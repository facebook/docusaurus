/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi, URISchema} from '@docusaurus/utils-validation';
import type {ThemeConfig, Validate, ValidationResult} from '@docusaurus/types';

const DEFAULT_DOCS_CONFIG = {
  versionPersistence: 'localStorage',
};
const DocsSchema = Joi.object({
  versionPersistence: Joi.string()
    .equal('localStorage', 'none')
    .default(DEFAULT_DOCS_CONFIG.versionPersistence),
}).default(DEFAULT_DOCS_CONFIG);

const DEFAULT_COLOR_MODE_CONFIG = {
  defaultMode: 'light',
  disableSwitch: false,
  respectPrefersColorScheme: false,
  switchConfig: {
    darkIcon: '🌜',
    darkIconStyle: {},
    lightIcon: '🌞',
    lightIconStyle: {},
  },
};

const DEFAULT_CONFIG = {
  colorMode: DEFAULT_COLOR_MODE_CONFIG,
  docs: DEFAULT_DOCS_CONFIG,
  metadatas: [],
  prism: {
    additionalLanguages: [],
  },
  navbar: {
    hideOnScroll: false,
    items: [],
  },
  hideableSidebar: false,
  tableOfContents: {
    minHeadingLevel: 2,
    maxHeadingLevel: 3,
  },
};
exports.DEFAULT_CONFIG = DEFAULT_CONFIG;

const NavbarItemPosition = Joi.string().equal('left', 'right').default('left');

const NavbarItemBaseSchema = Joi.object({
  label: Joi.string(),
  className: Joi.string(),
})
  // We allow any unknown attributes on the links
  // (users may need additional attributes like target, aria-role, data-customAttribute...)
  .unknown();

const DefaultNavbarItemSchema = NavbarItemBaseSchema.append({
  to: Joi.string(),
  href: URISchema,
  activeBasePath: Joi.string(),
  activeBaseRegex: Joi.string(),
  prependBaseUrlToHref: Joi.bool(),
  // This is only triggered in case of a nested dropdown
  items: Joi.forbidden().messages({
    'any.unknown': 'Nested dropdowns are not allowed',
  }),
})
  .xor('href', 'to')
  .messages({
    'object.xor': 'One and only one between "to" and "href" should be provided',
  });

const DocsVersionNavbarItemSchema = NavbarItemBaseSchema.append({
  type: Joi.string().equal('docsVersion').required(),
  to: Joi.string(),
  docsPluginId: Joi.string(),
});

const DocItemSchema = NavbarItemBaseSchema.append({
  type: Joi.string().equal('doc').required(),
  docId: Joi.string().required(),
  docsPluginId: Joi.string(),
});

const itemWithType = (type: string | undefined) => {
  // because equal(undefined) is not supported :/
  const typeSchema = type
    ? Joi.string().required().equal(type)
    : Joi.string().forbidden();
  return Joi.object({
    type: typeSchema,
  })
    .unknown()
    .required();
};

const DropdownSubitemSchema = Joi.object({
  position: Joi.forbidden(),
}).when('.', {
  switch: [
    {
      is: itemWithType('docsVersion'),
      then: DocsVersionNavbarItemSchema,
    },
    {
      is: itemWithType('doc'),
      then: DocItemSchema,
    },
    {
      is: itemWithType(undefined),
      then: DefaultNavbarItemSchema,
    },
    {
      is: Joi.alternatives().try(
        itemWithType('dropdown'),
        itemWithType('docsVersionDropdown'),
        itemWithType('localeDropdown'),
        itemWithType('search'),
      ),
      then: Joi.forbidden().messages({
        'any.unknown': 'Nested dropdowns are not allowed',
      }),
    },
  ],
  otherwise: Joi.forbidden().messages({
    'any.unknown': 'Bad navbar item type {.type}',
  }),
});

const DropdownNavbarItemSchema = NavbarItemBaseSchema.append({
  items: Joi.array().items(DropdownSubitemSchema).required(),
});

const DocsVersionDropdownNavbarItemSchema = NavbarItemBaseSchema.append({
  type: Joi.string().equal('docsVersionDropdown').required(),
  docsPluginId: Joi.string(),
  dropdownActiveClassDisabled: Joi.boolean(),
  dropdownItemsBefore: Joi.array().items(DropdownSubitemSchema).default([]),
  dropdownItemsAfter: Joi.array().items(DropdownSubitemSchema).default([]),
});

const LocaleDropdownNavbarItemSchema = NavbarItemBaseSchema.append({
  type: Joi.string().equal('localeDropdown').required(),
  dropdownItemsBefore: Joi.array().items(DropdownSubitemSchema).default([]),
  dropdownItemsAfter: Joi.array().items(DropdownSubitemSchema).default([]),
});

const SearchItemSchema = Joi.object({
  type: Joi.string().equal('search').required(),
});

const NavbarItemSchema = Joi.object({
  position: NavbarItemPosition,
}).when('.', {
  switch: [
    {
      is: itemWithType('docsVersion'),
      then: DocsVersionNavbarItemSchema,
    },
    {
      is: itemWithType('dropdown'),
      then: DropdownNavbarItemSchema,
    },
    {
      is: itemWithType('docsVersionDropdown'),
      then: DocsVersionDropdownNavbarItemSchema,
    },
    {
      is: itemWithType('doc'),
      then: DocItemSchema,
    },
    {
      is: itemWithType('localeDropdown'),
      then: LocaleDropdownNavbarItemSchema,
    },
    {
      is: itemWithType('search'),
      then: SearchItemSchema,
    },
    {
      is: itemWithType(undefined),
      then: Joi.object().when('.', {
        // Dropdown item can be specified without type field
        is: Joi.object({
          items: Joi.array().required(),
        }).unknown(),
        then: DropdownNavbarItemSchema,
        otherwise: DefaultNavbarItemSchema,
      }),
    },
  ],
  otherwise: Joi.forbidden().messages({
    'any.unknown': 'Bad navbar item type {.type}',
  }),
});

const ColorModeSchema = Joi.object({
  defaultMode: Joi.string()
    .equal('dark', 'light')
    .default(DEFAULT_COLOR_MODE_CONFIG.defaultMode),
  disableSwitch: Joi.bool().default(DEFAULT_COLOR_MODE_CONFIG.disableSwitch),
  respectPrefersColorScheme: Joi.bool().default(
    DEFAULT_COLOR_MODE_CONFIG.respectPrefersColorScheme,
  ),
  switchConfig: Joi.object({
    darkIcon: Joi.string().default(
      DEFAULT_COLOR_MODE_CONFIG.switchConfig.darkIcon,
    ),
    darkIconStyle: Joi.object().default(
      DEFAULT_COLOR_MODE_CONFIG.switchConfig.darkIconStyle,
    ),
    lightIcon: Joi.string().default(
      DEFAULT_COLOR_MODE_CONFIG.switchConfig.lightIcon,
    ),
    lightIconStyle: Joi.object().default(
      DEFAULT_COLOR_MODE_CONFIG.switchConfig.lightIconStyle,
    ),
  }).default(DEFAULT_COLOR_MODE_CONFIG.switchConfig),
}).default(DEFAULT_COLOR_MODE_CONFIG);

// schema can probably be improved
const HtmlMetadataSchema = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  property: Joi.string(),
  content: Joi.string(),
  itemprop: Joi.string(),
}).unknown();

const FooterLinkItemSchema = Joi.object({
  to: Joi.string(),
  href: URISchema,
  html: Joi.string(),
  label: Joi.string(),
})
  .xor('to', 'href', 'html')
  .with('to', 'label')
  .with('href', 'label')
  .nand('html', 'label')
  // We allow any unknown attributes on the links
  // (users may need additional attributes like target, aria-role, data-customAttribute...)
  .unknown();

const CustomCssSchema = Joi.alternatives()
  .try(Joi.array().items(Joi.string().required()), Joi.string().required())
  .optional();

const ThemeConfigSchema = Joi.object({
  // TODO temporary (@alpha-58)
  disableDarkMode: Joi.any().forbidden().messages({
    'any.unknown':
      'disableDarkMode theme config is deprecated. Please use the new colorMode attribute. You likely want: config.themeConfig.colorMode.disableSwitch = true',
  }),
  // TODO temporary (@alpha-58)
  defaultDarkMode: Joi.any().forbidden().messages({
    'any.unknown':
      'defaultDarkMode theme config is deprecated. Please use the new colorMode attribute. You likely want: config.themeConfig.colorMode.defaultMode = "dark"',
  }),
  customCss: CustomCssSchema,
  colorMode: ColorModeSchema,
  image: Joi.string(),
  docs: DocsSchema,
  metadatas: Joi.array()
    .items(HtmlMetadataSchema)
    .default(DEFAULT_CONFIG.metadatas),
  announcementBar: Joi.object({
    id: Joi.string().default('announcement-bar'),
    content: Joi.string().required(),
    backgroundColor: Joi.string(),
    textColor: Joi.string(),
    isCloseable: Joi.bool().default(true),
  }).optional(),
  navbar: Joi.object({
    style: Joi.string().equal('dark', 'primary'),
    hideOnScroll: Joi.bool().default(DEFAULT_CONFIG.navbar.hideOnScroll),
    // TODO temporary (@alpha-58)
    links: Joi.any().forbidden().messages({
      'any.unknown':
        'themeConfig.navbar.links has been renamed as themeConfig.navbar.items',
    }),
    items: Joi.array()
      .items(NavbarItemSchema)
      .default(DEFAULT_CONFIG.navbar.items),
    title: Joi.string().allow('', null),
    logo: Joi.object({
      alt: Joi.string().allow(''),
      src: Joi.string().required(),
      srcDark: Joi.string(),
      width: Joi.alternatives().try(Joi.string(), Joi.number()),
      height: Joi.alternatives().try(Joi.string(), Joi.number()),
      href: Joi.string(),
      target: Joi.string(),
    }),
  }).default(DEFAULT_CONFIG.navbar),
  footer: Joi.object({
    style: Joi.string().equal('dark', 'light').default('light'),
    logo: Joi.object({
      alt: Joi.string().allow(''),
      src: Joi.string(),
      srcDark: Joi.string(),
      // TODO infer this from reading the image
      width: Joi.alternatives().try(Joi.string(), Joi.number()),
      height: Joi.alternatives().try(Joi.string(), Joi.number()),
      href: Joi.string(),
    }),
    copyright: Joi.string(),
    links: Joi.array()
      .items(
        Joi.object({
          title: Joi.string().allow(null),
          items: Joi.array().items(FooterLinkItemSchema).default([]),
        }),
      )
      .default([]),
  }).optional(),
  prism: Joi.object({
    theme: Joi.object({
      plain: Joi.alternatives().try(Joi.array(), Joi.object()).required(),
      styles: Joi.alternatives().try(Joi.array(), Joi.object()).required(),
    }),
    darkTheme: Joi.object({
      plain: Joi.alternatives().try(Joi.array(), Joi.object()).required(),
      styles: Joi.alternatives().try(Joi.array(), Joi.object()).required(),
    }),
    defaultLanguage: Joi.string(),
    additionalLanguages: Joi.array()
      .items(Joi.string())
      .default(DEFAULT_CONFIG.prism.additionalLanguages),
  })
    .default(DEFAULT_CONFIG.prism)
    .unknown(),
  hideableSidebar: Joi.bool().default(DEFAULT_CONFIG.hideableSidebar),
  sidebarCollapsible: Joi.forbidden().messages({
    'any.unknown':
      'The themeConfig.sidebarCollapsible has been moved to docs plugin options. See: https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs',
  }),
  tableOfContents: Joi.object({
    minHeadingLevel: Joi.number()
      .default(DEFAULT_CONFIG.tableOfContents.minHeadingLevel)
      .when('maxHeadingLevel', {
        is: Joi.exist(),
        then: Joi.number()
          .integer()
          .min(2)
          .max(6)
          .max(Joi.ref('maxHeadingLevel')),
        otherwise: Joi.number().integer().min(2).max(6),
      }),
    maxHeadingLevel: Joi.number()
      .integer()
      .min(2)
      .max(6)
      .default(DEFAULT_CONFIG.tableOfContents.maxHeadingLevel),
  }).default(DEFAULT_CONFIG.tableOfContents),
});

export {ThemeConfigSchema};

export function validateThemeConfig({
  validate,
  themeConfig,
}: {
  validate: Validate<ThemeConfig>;
  themeConfig: ThemeConfig;
}): ValidationResult<ThemeConfig> {
  return validate(ThemeConfigSchema, themeConfig);
}
