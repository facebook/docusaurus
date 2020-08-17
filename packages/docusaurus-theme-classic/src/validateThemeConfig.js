/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Joi = require('@hapi/joi');
const {URISchema} = require('@docusaurus/utils-validation');

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
exports.DEFAULT_COLOR_MODE_CONFIG = DEFAULT_COLOR_MODE_CONFIG;

const NavbarItemPosition = Joi.string().equal('left', 'right').default('left');

// TODO we should probably create a custom navbar item type "dropdown"
// having this recursive structure is bad because we only support 2 levels
// + parent/child don't have exactly the same props
const DefaultNavbarItemSchema = Joi.object({
  items: Joi.array().optional().items(Joi.link('...')),
  to: Joi.string(),
  href: URISchema,
  label: Joi.string(),
  position: NavbarItemPosition,
  activeBasePath: Joi.string(),
  activeBaseRegex: Joi.string(),
  className: Joi.string(),
  'aria-label': Joi.string(),
})
  // We allow any unknown attributes on the links
  // (users may need additional attributes like target, aria-role, data-customAttribute...)
  .unknown();
// TODO the dropdown parent item can have no href/to
// should check should not apply to dropdown parent item
// .xor('href', 'to');

const DocsVersionNavbarItemSchema = Joi.object({
  type: Joi.string().equal('docsVersion').required(),
  position: NavbarItemPosition,
  label: Joi.string(),
  to: Joi.string(),
  docsPluginId: Joi.string(),
});

const DocsVersionDropdownNavbarItemSchema = Joi.object({
  type: Joi.string().equal('docsVersionDropdown').required(),
  position: NavbarItemPosition,
  docsPluginId: Joi.string(),
  nextVersionLabel: Joi.string().default('Next'), // TODO remove soon
});

// Can this be made easier? :/
const isOfType = (type) => {
  let typeSchema = Joi.string().required();
  // because equal(undefined) is not supported :/
  if (type) {
    typeSchema = typeSchema.equal(type);
  }
  return Joi.object({
    type: typeSchema,
  })
    .unknown()
    .required();
};

const NavbarItemSchema = Joi.object().when({
  switch: [
    {
      is: isOfType('docsVersion'),
      then: DocsVersionNavbarItemSchema,
    },
    {
      is: isOfType('docsVersionDropdown'),
      then: DocsVersionDropdownNavbarItemSchema,
    },
    {
      is: isOfType(undefined),
      then: Joi.forbidden().messages({
        'any.unknown': 'Bad nav item type {.type}',
      }),
    },
  ],
  otherwise: DefaultNavbarItemSchema,
});

/*
const NavbarItemSchema = Joi.object({
  type: Joi.string().only(['docsVersion'])
})
  .when(Joi.object({ type: 'docsVersion' }).unknown(), {
    then: Joi.object({ pepperoni: Joi.boolean() })
  })
  .when(Joi.object().unknown(), {
    then: Joi.object({ croutons: Joi.boolean() })
  })

 */

/*
const NavbarItemSchema = Joi.object().when('type', {
  is: Joi.valid('docsVersion'),
  then: DocsVersionNavbarItemSchema,
  otherwise: DefaultNavbarItemSchema,
});
 */

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

const ThemeConfigSchema = Joi.object({
  // TODO temporary (@alpha-58)
  disableDarkMode: Joi.any().forbidden(false).messages({
    'any.unknown':
      'disableDarkMode theme config is deprecated. Please use the new colorMode attribute. You likely want: config.themeConfig.colorMode.disableSwitch = true',
  }),
  // TODO temporary (@alpha-58)
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
    // TODO temporary (@alpha-58)
    links: Joi.any().forbidden().messages({
      'any.unknown':
        'themeConfig.navbar.links has been renamed as themeConfig.navbar.items',
    }),
    items: Joi.array().items(NavbarItemSchema),
    title: Joi.string().allow('', null),
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
        items: Joi.array().items(FooterLinkItemSchema).default([]),
      }),
    ),
  }),
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
    additionalLanguages: Joi.array().items(Joi.string()),
  }).unknown(),
});

exports.validateThemeConfig = ({validate, themeConfig}) => {
  return validate(ThemeConfigSchema, themeConfig);
};
