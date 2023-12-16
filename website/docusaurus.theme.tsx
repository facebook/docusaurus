/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';

export default {
  announcementBar: {
    id: 'announcementBar-3', // Increment on change
    // content: `🎉️ <b><a target="_blank" href="https://docusaurus.io/blog/releases/3.0">Docusaurus v3.0</a> is now out!</b> 🥳️`,
    content: function AnnouncementBarContent(): ReactNode {
      return (
        <b>
          <Translate
            values={{
              link: (
                // eslint-disable-next-line @docusaurus/no-untranslated-text
                <Link to="/blog/releases/3.0">
                  TEST IT WORKS Docusaurus v3.0
                </Link>
              ),
            }}>
            {'🎉 {link}, is now out! 🥳'}
          </Translate>
        </b>
      );
    },
  },
};
