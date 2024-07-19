/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, {type ReactNode} from 'react';
import renderer from 'react-test-renderer';
import {fromPartial} from '@total-typescript/shoehorn';
import {StaticRouter} from 'react-router-dom';
import Link from '../Link';
import {Context} from '../../docusaurusContext';
import type {DocusaurusContext} from '@docusaurus/types';

type Options = {
  trailingSlash: boolean | undefined;
  baseUrl: string;
  router: DocusaurusContext['siteConfig']['future']['experimental_router'];
  currentLocation: string;
};

const defaultOptions: Options = {
  trailingSlash: undefined,
  baseUrl: '/',
  router: 'browser',
  // currentLocation is nested on purpose, shows relative link resolution
  currentLocation: '/sub/category/currentPathname',
};

function createDocusaurusContext(
  partialOptions: Partial<Options>,
): DocusaurusContext {
  const options: Options = {...defaultOptions, ...partialOptions};
  return fromPartial({
    siteConfig: {
      baseUrl: options.baseUrl,
      trailingSlash: options.trailingSlash,
      future: {
        experimental_router: options.router,
      },
    },
  });
}

function createLinkRenderer(defaultRendererOptions: Partial<Options> = {}) {
  return (linkJsx: ReactNode, testOptions: Partial<Options> = {}) => {
    const options: Options = {
      ...defaultOptions,
      ...defaultRendererOptions,
      ...testOptions,
    };
    const docusaurusContext = createDocusaurusContext(options);
    return renderer
      .create(
        <StaticRouter location={options.currentLocation} context={{}}>
          <Context.Provider value={docusaurusContext}>
            {linkJsx}
          </Context.Provider>
        </StaticRouter>,
      )
      .toJSON();
  };
}

describe('<Link>', () => {
  describe('using "browser" router', () => {
    const render = createLinkRenderer({router: 'browser'});

    it("can render '/docs/intro'", () => {
      expect(render(<Link to="/docs/intro" />)).toMatchInlineSnapshot(`
        <a
          data-test-link-type="react-router"
          href="/docs/intro"
          onClick={[Function]}
          onMouseEnter={[Function]}
          onTouchStart={[Function]}
        />
      `);
    });

    it("can render '/docs/intro' with baseUrl /baseUrl/", () => {
      expect(render(<Link to="/docs/intro" />, {baseUrl: '/baseUrl/'}))
        .toMatchInlineSnapshot(`
        <a
          data-test-link-type="react-router"
          href="/baseUrl/docs/intro"
          onClick={[Function]}
          onMouseEnter={[Function]}
          onTouchStart={[Function]}
        />
      `);
    });

    it("can render '/docs/intro' with baseUrl /docs/", () => {
      // TODO Docusaurus v4 ?
      //  Change weird historical baseUrl behavior
      //  we should link to /docs/docs/intro, not /docs/intro
      //  see https://github.com/facebook/docusaurus/issues/6294
      expect(render(<Link to="/docs/intro" />, {baseUrl: '/docs/'}))
        .toMatchInlineSnapshot(`
        <a
          data-test-link-type="react-router"
          href="/docs/intro"
          onClick={[Function]}
          onMouseEnter={[Function]}
          onTouchStart={[Function]}
        />
      `);
    });

    it("can render '/docs/intro' with trailingSlash true", () => {
      expect(render(<Link to="/docs/intro" />, {trailingSlash: true}))
        .toMatchInlineSnapshot(`
        <a
          data-test-link-type="react-router"
          href="/docs/intro/"
          onClick={[Function]}
          onMouseEnter={[Function]}
          onTouchStart={[Function]}
        />
      `);
    });

    it("can render '/docs/intro/' with trailingSlash false", () => {
      expect(render(<Link to="/docs/intro/" />, {trailingSlash: false}))
        .toMatchInlineSnapshot(`
        <a
          data-test-link-type="react-router"
          href="/docs/intro"
          onClick={[Function]}
          onMouseEnter={[Function]}
          onTouchStart={[Function]}
        />
      `);
    });

    it("can render '#anchor'", () => {
      expect(render(<Link to="#anchor" />)).toMatchInlineSnapshot(`
        <a
          data-test-link-type="regular"
          href="#anchor"
        />
      `);
    });

    it("can render '/docs/intro#anchor'", () => {
      expect(render(<Link to="/docs/intro#anchor" />)).toMatchInlineSnapshot(`
        <a
          data-test-link-type="react-router"
          href="/docs/intro#anchor"
          onClick={[Function]}
          onMouseEnter={[Function]}
          onTouchStart={[Function]}
        />
      `);
    });

    it("can render '/docs/intro/#anchor'", () => {
      expect(render(<Link to="/docs/intro/#anchor" />)).toMatchInlineSnapshot(`
        <a
          data-test-link-type="react-router"
          href="/docs/intro/#anchor"
          onClick={[Function]}
          onMouseEnter={[Function]}
          onTouchStart={[Function]}
        />
      `);
    });

    it("can render '/pathname?qs#anchor'", () => {
      expect(render(<Link to="/pathname?qs#anchor" />)).toMatchInlineSnapshot(`
        <a
          data-test-link-type="react-router"
          href="/pathname?qs#anchor"
          onClick={[Function]}
          onMouseEnter={[Function]}
          onTouchStart={[Function]}
        />
      `);
    });

    it("can render ''", () => {
      expect(render(<Link to="" />)).toMatchInlineSnapshot(`
        <a
          data-test-link-type="regular"
        />
      `);
    });

    it("can render 'relativeDoc'", () => {
      expect(render(<Link to="relativeDoc" />)).toMatchInlineSnapshot(`
        <a
          data-test-link-type="react-router"
          href="/sub/category/relativeDoc"
          onClick={[Function]}
          onMouseEnter={[Function]}
          onTouchStart={[Function]}
        />
      `);
    });

    it("can render './relativeDoc'", () => {
      expect(render(<Link to="./relativeDoc" />)).toMatchInlineSnapshot(`
        <a
          data-test-link-type="react-router"
          href="/sub/category/relativeDoc"
          onClick={[Function]}
          onMouseEnter={[Function]}
          onTouchStart={[Function]}
        />
      `);
    });

    it("can render './../relativeDoc?qs#anchor'", () => {
      expect(render(<Link to="./../relativeDoc?qs#anchor" />))
        .toMatchInlineSnapshot(`
        <a
          data-test-link-type="react-router"
          href="/sub/relativeDoc?qs#anchor"
          onClick={[Function]}
          onMouseEnter={[Function]}
          onTouchStart={[Function]}
        />
      `);
    });

    it("can render 'https://example.com/xyz'", () => {
      expect(render(<Link to="https://example.com/xyz" />))
        .toMatchInlineSnapshot(`
        <a
          data-test-link-type="regular"
          href="https://example.com/xyz"
          rel="noopener noreferrer"
          target="_blank"
        />
      `);
    });

    it("can render 'pathname:///docs/intro'", () => {
      expect(render(<Link to="pathname:///docs/intro" />))
        .toMatchInlineSnapshot(`
        <a
          data-test-link-type="regular"
          href="/docs/intro"
          rel="noopener noreferrer"
          target="_blank"
        />
      `);
    });

    it("can render 'pathname://docs/intro'", () => {
      expect(render(<Link to="pathname://docs/intro" />))
        .toMatchInlineSnapshot(`
        <a
          data-test-link-type="regular"
          href="docs/intro"
          rel="noopener noreferrer"
          target="_blank"
        />
      `);
    });

    it("can render 'pathname:///docs/intro' with baseUrl /baseUrl/", () => {
      expect(
        render(<Link to="pathname:///docs/intro" />, {baseUrl: '/baseUrl/'}),
      ).toMatchInlineSnapshot(`
        <a
          data-test-link-type="regular"
          href="/baseUrl/docs/intro"
          rel="noopener noreferrer"
          target="_blank"
        />
      `);
    });

    it("can render 'pathname:///docs/intro' with target _self", () => {
      expect(render(<Link to="pathname:///docs/intro" target="_self" />))
        .toMatchInlineSnapshot(`
        <a
          data-test-link-type="regular"
          href="/docs/intro"
          rel="noopener noreferrer"
          target="_self"
        />
      `);
    });

    it("can render 'pathname:///docs/intro with trailingSlash: true", () => {
      expect(
        render(<Link to="pathname:///docs/intro" />, {trailingSlash: true}),
      ).toMatchInlineSnapshot(`
        <a
          data-test-link-type="regular"
          href="/docs/intro"
          rel="noopener noreferrer"
          target="_blank"
        />
      `);
    });
  });

  describe('using "hash" router', () => {
    const render = createLinkRenderer({router: 'hash'});

    it("can render '/docs/intro'", () => {
      expect(render(<Link to="/docs/intro" />)).toMatchInlineSnapshot(`
        <a
          data-test-link-type="react-router"
          href="/docs/intro"
          onClick={[Function]}
          onMouseEnter={[Function]}
          onTouchStart={[Function]}
        />
      `);
    });

    it("can render '#anchor'", () => {
      // It's important to use React Router link for hash router anchors
      // See https://github.com/facebook/docusaurus/pull/10311
      expect(render(<Link to="#anchor" />)).toMatchInlineSnapshot(`
        <a
          data-test-link-type="react-router"
          href="/sub/category/currentPathname#anchor"
          onClick={[Function]}
          onMouseEnter={[Function]}
          onTouchStart={[Function]}
        />
      `);
    });

    it("can render './relativeDoc'", () => {
      // Not sure to remember exactly what's this edge case about
      // still worth it to capture behavior in tests
      expect(render(<Link to="./relativeDoc" />)).toMatchInlineSnapshot(`
        <a
          data-test-link-type="react-router"
          href="/relativeDoc"
          onClick={[Function]}
          onMouseEnter={[Function]}
          onTouchStart={[Function]}
        />
      `);
    });
  });
});
