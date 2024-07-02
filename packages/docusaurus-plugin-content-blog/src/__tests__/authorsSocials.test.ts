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
        "linkedin": "https://www.linkedin.com/ozakione",
        "stackoverflow": "https://stackoverflow.com/ozakione",
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
        "linkedin": "https://www.linkedin.com/ozakione",
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

  it('normalize link url', () => {
    // stackoverflow doesn't like multiple slashes, as we have trailing slash
    // in socialPlatforms, if the user add a prefix slash the url will contain
    // multiple slashes causing a 404
    const socials: AuthorSocials = {
      twitter: '//ozakione',
      github: '/ozakione///',
      linkedin: '//ozakione///',
      stackoverflow: '///users///82609/sebastien-lorber',
    };

    expect(normalizeSocials(socials)).toMatchInlineSnapshot(`
      {
        "github": "https://github.com/ozakione/",
        "linkedin": "https://www.linkedin.com/ozakione/",
        "stackoverflow": "https://stackoverflow.com/users/82609/sebastien-lorber",
        "twitter": "https://twitter.com/ozakione",
      }
    `);
  });

  it('allow other form of urls', () => {
    const socials: AuthorSocials = {
      twitter: 'https://bit.ly/sebastienlorber-twitter',
    };

    expect(normalizeSocials(socials)).toEqual(socials);
  });
});
