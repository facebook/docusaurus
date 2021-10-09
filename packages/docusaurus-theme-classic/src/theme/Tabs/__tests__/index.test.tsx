/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import renderer from 'react-test-renderer';
import Tabs from '../index';
import TabItem from '../../TabItem';

describe('Tabs validation', () => {
  test('Should reject bad Tabs child', () => {
    expect(() => {
      renderer.create(
        <Tabs>
          <div>Naughty</div>
          <TabItem>Good</TabItem>
        </Tabs>,
      );
    }).toThrowErrorMatchingInlineSnapshot(
      `"Bad <Tabs> child <div>: all children of the <Tabs> component should be <TabItem>."`,
    );
  });
  test('Should reject bad Tabs defaultValue', () => {
    expect(() => {
      renderer.create(
        <Tabs defaultValue="bad">
          <TabItem value="v1">Tab 1</TabItem>
          <TabItem value="v2">Tab 2</TabItem>
        </Tabs>,
      );
    }).toThrowErrorMatchingInlineSnapshot(
      `"Docusaurus error: the <Tabs> has a defaultValue set (\\"bad\\") but none of its children has the corresponding value. Available values are: v1, v2. If you intend to show no default tab, use defaultValue={null} instead."`,
    );
  });
});
