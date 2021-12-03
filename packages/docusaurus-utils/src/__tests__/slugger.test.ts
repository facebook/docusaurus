/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createSlugger} from '../slugger';

describe('createSlugger', () => {
  test('can create unique slugs', () => {
    const slugger = createSlugger();
    expect(slugger.slug('Some$/vaLue$!^')).toEqual('somevalue');
    expect(slugger.slug('Some$/vaLue$!^')).toEqual('somevalue-1');
    expect(slugger.slug('Some$/vaLue$!^')).toEqual('somevalue-2');
    expect(slugger.slug('Some$/vaLue$!^-1')).toEqual('somevalue-1-1');
  });

  test('can create unique slugs respecting case', () => {
    const slugger = createSlugger();
    const opt = {maintainCase: true};
    expect(slugger.slug('Some$/vaLue$!^', opt)).toEqual('SomevaLue');
    expect(slugger.slug('Some$/vaLue$!^', opt)).toEqual('SomevaLue-1');
    expect(slugger.slug('Some$/vaLue$!^', opt)).toEqual('SomevaLue-2');
    expect(slugger.slug('Some$/vaLue$!^-1', opt)).toEqual('SomevaLue-1-1');
  });
});
