/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {type FilledContext, HelmetProvider} from 'react-helmet-async';
import renderer from 'react-test-renderer';
import Head from '../Head';

describe('Head', () => {
  it('does exactly what Helmet does', () => {
    const context = {};
    expect(
      renderer
        .create(
          <HelmetProvider context={context}>
            <Head>
              <meta property="og:type" content="article" />
              <meta property="og:description" content="some description" />
            </Head>
            <Head>
              <meta
                property="og:description"
                content="some description overridden"
              />
            </Head>
            <Head>
              <meta
                property="duplicated?"
                content="this property is duplicated"
              />
              <meta property="duplicated?" content="another one" />
            </Head>
            <div>Content</div>
          </HelmetProvider>,
        )
        .toJSON(),
    ).toMatchSnapshot();
    expect((context as FilledContext).helmet).toMatchSnapshot();
  });
});
