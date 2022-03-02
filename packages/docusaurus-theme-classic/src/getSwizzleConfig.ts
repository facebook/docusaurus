/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {SwizzleConfig} from '@docusaurus/types';

/* eslint sort-keys: "error" */

export default function getSwizzleConfig(): SwizzleConfig {
  return {
    components: {
      CodeBlock: {
        actions: {
          eject: 'safe',
          wrap: 'safe',
        },
        description:
          'The component used to render multi-line code blocks, generally used in Markdown files.',
      },
      ColorModeToggle: {
        actions: {
          eject: 'safe',
          wrap: 'safe',
        },
        description:
          'The color mode toggle to switch between light and dark mode.',
      },
      DocSidebar: {
        actions: {
          eject: 'unsafe', // too much technical code in sidebar, not very safe atm
          wrap: 'safe',
        },
        description: 'The sidebar component on docs pages',
      },
      Footer: {
        actions: {
          eject: 'unsafe', // TODO split footer into smaller parts
          wrap: 'safe',
        },
        description: "The footer component of you site's layout",
      },
      IconArrow: {
        actions: {
          eject: 'safe',
          wrap: 'safe',
        },
        description: 'The arrow icon component',
      },
      IconDarkMode: {
        actions: {
          eject: 'safe',
          wrap: 'safe',
        },
        description: 'The dark mode icon component.',
      },
      IconEdit: {
        actions: {
          eject: 'safe',
          wrap: 'safe',
        },
        description: 'The edit icon component',
      },
      IconLightMode: {
        actions: {
          eject: 'safe',
          wrap: 'safe',
        },
        description: 'The light mode icon component.',
      },
      IconMenu: {
        actions: {
          eject: 'safe',
          wrap: 'safe',
        },
        description: 'The menu icon component',
      },
      MDXComponents: {
        actions: {
          eject: 'safe',
          wrap: 'forbidden', /// TODO allow wrapping objects???
        },
        description:
          'The MDX components to use for rendering MDX files. Meant to be ejected.',
      },
      // TODO should probably not even appear here
      'NavbarItem/utils': {
        actions: {
          eject: 'forbidden',
          wrap: 'forbidden',
        },
      },
      NotFound: {
        actions: {
          eject: 'safe',
          wrap: 'safe',
        },
        description:
          'The global 404 page of your site, meant to be ejected and customized',
      },
      SearchBar: {
        actions: {
          eject: 'safe',
          wrap: 'safe',
        },
        // TODO how to describe this one properly?
        // By default it's an empty placeholder for the user to fill
        description:
          'The search bar component of your site, appearing in the navbar.',
      },
      'prism-include-languages': {
        actions: {
          eject: 'safe',
          wrap: 'forbidden', // not a component!
        },
        description:
          'The Prism languages to include for code block syntax highlighting. Meant to be ejected.',
      },
    },
  };
}
