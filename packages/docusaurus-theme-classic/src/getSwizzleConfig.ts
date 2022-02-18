/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {SwizzleConfig} from '@docusaurus/types';

export default function getSwizzleConfig(): SwizzleConfig {
  return {
    components: {
      CodeBlock: {
        actions: {
          wrap: 'safe',
          eject: 'safe',
        },
        description:
          'The component used to render multi-line code blocks, generally used in Markdown files.',
      },
      DocSidebar: {
        actions: {
          wrap: 'safe',
          eject: 'unsafe', // too much technical code in sidebar, not very safe atm
        },
        description: 'The sidebar component on docs pages',
      },
      Footer: {
        actions: {
          wrap: 'safe',
          eject: 'unsafe', // TODO split footer into smaller parts
        },
        description: "The footer component of you site's layout",
      },
      NotFound: {
        actions: {
          wrap: 'safe',
          eject: 'safe',
        },
        description:
          'The global 404 page of your site, meant to be ejected and customized',
      },
      SearchBar: {
        actions: {
          wrap: 'safe',
          eject: 'safe',
        },
        // TODO how to describe this one properly?
        // By default it's an empty placeholder for the user to fill
        description:
          'The search bar component of your site, appearing in the navbar.',
      },
      IconArrow: {
        actions: {
          wrap: 'safe',
          eject: 'safe',
        },
        description: 'The arrow icon component',
      },
      IconEdit: {
        actions: {
          wrap: 'safe',
          eject: 'safe',
        },
        description: 'The edit icon component',
      },
      IconMenu: {
        actions: {
          wrap: 'safe',
          eject: 'safe',
        },
        description: 'The menu icon component',
      },

      'prism-include-languages': {
        actions: {
          wrap: 'forbidden', // not a component!
          eject: 'safe',
        },
        description:
          'The Prism languages to include for code block syntax highlighting. Meant to be ejected.',
      },
      MDXComponents: {
        actions: {
          wrap: 'forbidden', /// TODO allow wrapping objects???
          eject: 'safe',
        },
        description:
          'The MDX components to use for rendering MDX files. Meant to be ejected.',
      },

      // TODO should probably not even appear here
      'NavbarItem/utils': {
        actions: {
          wrap: 'forbidden',
          eject: 'forbidden',
        },
      },
    },
  };
}
