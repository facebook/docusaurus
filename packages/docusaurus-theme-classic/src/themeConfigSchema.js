/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Joi = require('@hapi/joi');

const NavbarItemPosition = Joi.string().equal('left', 'right').default('left');

const DefaultNavbarItemSchema = Joi.object({
  items: Joi.array().optional().items(Joi.link('...')),
  to: Joi.string(),
  href: Joi.string().uri(),
  prependBaseUrlToHref: Joi.bool().default(true),
  label: Joi.string(),
  position: NavbarItemPosition,
  activeBasePath: Joi.string(),
  activeBaseRegex: Joi.string(),
  className: Joi.string(),
  'aria-label': Joi.string(),
}).xor('href', 'to');

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
  defaultMode: Joi.string().equal('dark', 'light').default('light'),
  disableSwitch: Joi.bool().default(false),
  respectPrefersColorScheme: Joi.bool().default(false),
}).default({
  defaultMode: 'light',
  disableSwitch: false,
  respectPrefersColorScheme: false,
});

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

module.exports = ThemeConfigSchema;
