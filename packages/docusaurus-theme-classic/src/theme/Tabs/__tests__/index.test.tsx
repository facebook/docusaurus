/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import renderer from 'react-test-renderer';
import {ScrollControllerProvider} from '@docusaurus/theme-common/internal';
import {StaticRouter} from 'react-router-dom';
import Tabs from '../index';
import TabItem from '../../TabItem';

function TestProviders({
  children,
  pathname = '/',
}: {
  children: ReactNode;
  pathname?: string;
}) {
  return (
    <StaticRouter location={{pathname}}>
      <ScrollControllerProvider>{children}</ScrollControllerProvider>
    </StaticRouter>
  );
}

describe('Tabs', () => {
  it('rejects bad Tabs child', () => {
    expect(() => {
      renderer.create(
        <TestProviders>
          <Tabs>
            <div>Naughty</div>
            <TabItem value="good">Good</TabItem>
          </Tabs>
        </TestProviders>,
      );
    }).toThrowErrorMatchingInlineSnapshot(
      `"Docusaurus error: Bad <Tabs> child <div>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop."`,
    );
  });
  it('rejects bad Tabs defaultValue', () => {
    expect(() => {
      renderer.create(
        <TestProviders>
          <Tabs defaultValue="bad">
            <TabItem value="v1">Tab 1</TabItem>
            <TabItem value="v2">Tab 2</TabItem>
          </Tabs>
        </TestProviders>,
      );
    }).toThrowErrorMatchingInlineSnapshot(
      `"Docusaurus error: The <Tabs> has a defaultValue "bad" but none of its children has the corresponding value. Available values are: v1, v2. If you intend to show no default tab, use defaultValue={null} instead."`,
    );
  });
  it('rejects duplicate values', () => {
    expect(() => {
      renderer.create(
        <TestProviders>
          <Tabs>
            <TabItem value="v1">Tab 1</TabItem>
            <TabItem value="v2">Tab 2</TabItem>
            <TabItem value="v3">Tab 3</TabItem>
            <TabItem value="v4">Tab 4</TabItem>
            <TabItem value="v1">Tab 5</TabItem>
            <TabItem value="v2">Tab 6</TabItem>
          </Tabs>
        </TestProviders>,
      );
    }).toThrowErrorMatchingInlineSnapshot(
      `"Docusaurus error: Duplicate values "v1, v2" found in <Tabs>. Every value needs to be unique."`,
    );
  });
  it('accepts valid Tabs config', () => {
    expect(() => {
      renderer.create(
        <TestProviders>
          <Tabs>
            <TabItem value="v1">Tab 1</TabItem>
            <TabItem value="v2">Tab 2</TabItem>
          </Tabs>
          <Tabs>
            <TabItem value="v1">Tab 1</TabItem>
            <TabItem value="v2" default>
              Tab 2
            </TabItem>
          </Tabs>
          <Tabs defaultValue="v1">
            <TabItem value="v1" label="V1">
              Tab 1
            </TabItem>
            <TabItem value="v2" label="V2">
              Tab 2
            </TabItem>
          </Tabs>
          <Tabs
            defaultValue="v1"
            values={[
              {value: 'v1', label: 'V1'},
              {value: 'v2', label: 'V2'},
            ]}>
            <TabItem value="v1">Tab 1</TabItem>
            <TabItem value="v2">Tab 2</TabItem>
          </Tabs>
          <Tabs
            defaultValue={null}
            values={[
              {value: 'v1', label: 'V1'},
              {value: 'v2', label: 'V2'},
            ]}>
            <TabItem value="v1">Tab 1</TabItem>
            <TabItem value="v2">Tab 2</TabItem>
          </Tabs>
          <Tabs defaultValue={null}>
            <TabItem value="v1" label="V1">
              Tab 1
            </TabItem>
            <TabItem value="v2" label="V2">
              Tab 2
            </TabItem>
          </Tabs>
        </TestProviders>,
      );
    }).not.toThrow(); // TODO Better Jest infrastructure to mock the Layout
  });
  // https://github.com/facebook/docusaurus/issues/5729
  it('accepts dynamic Tabs with number values', () => {
    expect(() => {
      const tabs = ['Apple', 'Banana', 'Carrot'];
      renderer.create(
        <TestProviders>
          <Tabs
            values={tabs.map((t, idx) => ({label: t, value: idx}))}
            defaultValue={0}>
            {tabs.map((t, idx) => (
              <TabItem key={idx} value={idx}>
                {t}
              </TabItem>
            ))}
          </Tabs>
        </TestProviders>,
      );
    }).not.toThrow();
  });
  it('rejects if querystring is true, but groupId falsy', () => {
    expect(() => {
      renderer.create(
        <TestProviders>
          <Tabs queryString>
            <TabItem value="val1">Val1</TabItem>
            <TabItem value="val2">Val2</TabItem>
          </Tabs>
        </TestProviders>,
      );
    }).toThrow(
      'Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".',
    );
  });

  it('accept querystring=true when groupId is defined', () => {
    expect(() => {
      renderer.create(
        <TestProviders>
          <Tabs queryString groupId="my-group-id">
            <TabItem value="val1">Val1</TabItem>
            <TabItem value="val2">Val2</TabItem>
          </Tabs>
        </TestProviders>,
      );
    }).not.toThrow();
  });

  it('accept querystring as string, but groupId falsy', () => {
    expect(() => {
      renderer.create(
        <TestProviders>
          <Tabs queryString="qsKey">
            <TabItem value="val1">Val1</TabItem>
            <TabItem value="val2">Val2</TabItem>
          </Tabs>
        </TestProviders>,
      );
    }).not.toThrow();
  });

  it('accepts a single TabItem', () => {
    expect(() => {
      renderer.create(
        <TestProviders>
          <Tabs>
            <TabItem value="val1">Val1</TabItem>
          </Tabs>
        </TestProviders>,
      );
    }).not.toThrow();
  });

  it('allows a tab to be falsy', () => {
    expect(() => {
      renderer.create(
        <TestProviders>
          <Tabs>
            <TabItem value="val1">Val1</TabItem>
            {null}
            {false}
            {undefined}
          </Tabs>
        </TestProviders>,
      );
    }).not.toThrow();
  });
});
