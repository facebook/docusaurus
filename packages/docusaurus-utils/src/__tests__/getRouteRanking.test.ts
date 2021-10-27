/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getRouteRanking} from '..';

describe('getRouteRanking', () => {
  it('should return the lower ranking for / path', () => {
    expect(getRouteRanking('/')).toEqual(5);
  });
  it('should return higher ranking for /foo than / path', () => {
    expect(getRouteRanking('/')).toBeLessThan(getRouteRanking('/foo'));
  });
  it('should return higher ranking for /foo/compose than /foo path', () => {
    expect(getRouteRanking('/foo')).toBeLessThan(
      getRouteRanking('/foo/compose'),
    );
  });
  it('should return higher ranking for /foo/compose/foo than /foo path', () => {
    expect(getRouteRanking('/foo/compose')).toBeLessThan(
      getRouteRanking('/foo/compose/foo'),
    );
  });
});
