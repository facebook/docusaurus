/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizeSocials} from '../authorsSocials';
import type {AuthorSocials} from '@docusaurus/plugin-content-blog';

describe('normalizeSocials', () => {
  it('only username', () => {
    const socials: AuthorSocials = {
      twitter: 'ozakione',
      linkedin: 'ozakione',
      github: 'ozakione',
      stackoverflow: 'ozakione',
    };

    expect(normalizeSocials(socials)).toMatchInlineSnapshot(`
      {
        "github": "https://github.com/ozakione",
        "linkedin": "https://www.linkedin.com/in/ozakione/",
        "stackoverflow": "https://stackoverflow.com/users/ozakione",
        "twitter": "https://twitter.com/ozakione",
      }
    `);
  });

  it('only username - case insensitive', () => {
    const socials: AuthorSocials = {
      Twitter: 'ozakione',
      linkedIn: 'ozakione',
      gitHub: 'ozakione',
      STACKoverflow: 'ozakione',
    };

    expect(normalizeSocials(socials)).toMatchInlineSnapshot(`
      {
        "github": "https://github.com/ozakione",
        "linkedin": "https://www.linkedin.com/in/ozakione/",
        "stackoverflow": "https://stackoverflow.com/users/ozakione",
        "twitter": "https://twitter.com/ozakione",
      }
    `);
  });

  it('only links', () => {
    const socials: AuthorSocials = {
      twitter: 'https://x.com/ozakione',
      linkedin: 'https://linkedin.com/ozakione',
      github: 'https://github.com/ozakione',
      stackoverflow: 'https://stackoverflow.com/ozakione',
    };

    expect(normalizeSocials(socials)).toEqual(socials);
  });

  it('mixed links', () => {
    const socials: AuthorSocials = {
      twitter: 'ozakione',
      linkedin: 'ozakione',
      github: 'https://github.com/ozakione',
      stackoverflow: 'https://stackoverflow.com/ozakione',
    };

    expect(normalizeSocials(socials)).toMatchInlineSnapshot(`
      {
        "github": "https://github.com/ozakione",
        "linkedin": "https://www.linkedin.com/in/ozakione/",
        "stackoverflow": "https://stackoverflow.com/ozakione",
        "twitter": "https://twitter.com/ozakione",
      }
    `);
  });

  it('one link', () => {
    const socials: AuthorSocials = {
      twitter: 'ozakione',
    };

    expect(normalizeSocials(socials)).toMatchInlineSnapshot(`
      {
        "twitter": "https://twitter.com/ozakione",
      }
    `);
  });

  it('rejects strings that do not look like username/userId/handle or fully-qualified URLs', () => {
    const socials: AuthorSocials = {
      twitter: '/ozakione/XYZ',
    };

    expect(() => normalizeSocials(socials)).toThrowErrorMatchingInlineSnapshot(`
      "Author socials should be usernames/userIds/handles, or fully qualified HTTP(s) absolute URLs.
      Social platform 'twitter' has illegal value '/ozakione/XYZ'"
    `);
  });

  it('allow other form of urls', () => {
    const socials: AuthorSocials = {
      twitter: 'https://bit.ly/sebastienlorber-twitter',
    };

    expect(normalizeSocials(socials)).toEqual(socials);
  });

  it('allow unknown social platforms urls', () => {
    const socials: AuthorSocials = {
      twitch: 'https://www.twitch.tv/sebastienlorber',
      newsletter: 'https://thisweekinreact.com',
    };

    expect(normalizeSocials(socials)).toEqual(socials);
  });
});
