/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import {
  removeSuffix,
  removePrefix,
  getElementsAround,
  mapAsyncSequential,
  findAsyncSequential,
  reportMessage,
} from '../jsUtils';
import _ from 'lodash';

describe('removeSuffix', () => {
  it("is no-op when suffix doesn't exist", () => {
    expect(removeSuffix('abcdef', 'ijk')).toBe('abcdef');
    expect(removeSuffix('abcdef', 'abc')).toBe('abcdef');
    expect(removeSuffix('abcdef', '')).toBe('abcdef');
  });
  it('removes suffix', () => {
    expect(removeSuffix('abcdef', 'ef')).toBe('abcd');
  });
});

describe('removePrefix', () => {
  it("is no-op when prefix doesn't exist", () => {
    expect(removePrefix('abcdef', 'ijk')).toBe('abcdef');
    expect(removePrefix('abcdef', 'def')).toBe('abcdef');
    expect(removePrefix('abcdef', '')).toBe('abcdef');
  });
  it('removes prefix', () => {
    expect(removePrefix('abcdef', 'ab')).toBe('cdef');
  });
});

describe('getElementsAround', () => {
  it('returns elements around', () => {
    expect(getElementsAround(['a', 'b', 'c', 'd'], 0)).toEqual({
      previous: undefined,
      next: 'b',
    });
    expect(getElementsAround(['a', 'b', 'c', 'd'], 1)).toEqual({
      previous: 'a',
      next: 'c',
    });
    expect(getElementsAround(['a', 'b', 'c', 'd'], 2)).toEqual({
      previous: 'b',
      next: 'd',
    });
    expect(getElementsAround(['a', 'b', 'c', 'd'], 3)).toEqual({
      previous: 'c',
      next: undefined,
    });
  });

  it('throws if bad index is provided', () => {
    expect(() =>
      getElementsAround(['a', 'b', 'c', 'd'], -1),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Valid \\"aroundIndex\\" for array (of size 4) are between 0 and 3, but you provided -1."`,
    );
    expect(() =>
      getElementsAround(['a', 'b', 'c', 'd'], 4),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Valid \\"aroundIndex\\" for array (of size 4) are between 0 and 3, but you provided 4."`,
    );
  });
});

describe('mapAsyncSequential', () => {
  function sleep(timeout: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  it('maps sequentially', async () => {
    const itemToTimeout: Record<string, number> = {
      '1': 200,
      '2': 600,
      '3': 400,
    };
    const items = Object.keys(itemToTimeout);

    const itemMapStartsAt: Record<string, number> = {};
    const itemMapEndsAt: Record<string, number> = {};

    const timeBefore = Date.now();
    await expect(
      mapAsyncSequential(items, async (item) => {
        const itemTimeout = itemToTimeout[item];
        itemMapStartsAt[item] = Date.now();
        await sleep(itemTimeout);
        itemMapEndsAt[item] = Date.now();
        return `${item} mapped`;
      }),
    ).resolves.toEqual(['1 mapped', '2 mapped', '3 mapped']);
    const timeAfter = Date.now();

    const timeTotal = timeAfter - timeBefore;

    const totalTimeouts = _.sum(Object.values(itemToTimeout));
    expect(timeTotal).toBeGreaterThanOrEqual(totalTimeouts - 100);

    expect(itemMapStartsAt['1']).toBeGreaterThanOrEqual(0);
    expect(itemMapStartsAt['2']).toBeGreaterThanOrEqual(
      itemMapEndsAt['1'] - 100,
    );
    expect(itemMapStartsAt['3']).toBeGreaterThanOrEqual(
      itemMapEndsAt['2'] - 100,
    );
  });
});

describe('findAsyncSequential', () => {
  function sleep(timeout: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  it('finds sequentially', async () => {
    const items = ['1', '2', '3'];

    const findFn = jest.fn(async (item: string) => {
      await sleep(400);
      return item === '2';
    });

    const timeBefore = Date.now();
    await expect(findAsyncSequential(items, findFn)).resolves.toBe('2');
    const timeAfter = Date.now();

    expect(findFn).toHaveBeenCalledTimes(2);
    expect(findFn).toHaveBeenNthCalledWith(1, '1');
    expect(findFn).toHaveBeenNthCalledWith(2, '2');

    const timeTotal = timeAfter - timeBefore;
    expect(timeTotal).toBeGreaterThanOrEqual(600);
    expect(timeTotal).toBeLessThan(1000);
  });
});

describe('reportMessage', () => {
  it('works with all severities', () => {
    const consoleLog = jest.spyOn(console, 'info').mockImplementation(() => {});
    const consoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    reportMessage('hey', 'ignore');
    reportMessage('hey', 'log');
    reportMessage('hey', 'warn');
    reportMessage('hey', 'error');
    expect(() =>
      reportMessage('hey', 'throw'),
    ).toThrowErrorMatchingInlineSnapshot(`"hey"`);
    expect(() =>
      // @ts-expect-error: for test
      reportMessage('hey', 'foo'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected \\"reportingSeverity\\" value: foo."`,
    );
    expect(consoleLog).toBeCalledTimes(1);
    expect(consoleLog).toBeCalledWith(expect.stringMatching(/.*\[INFO].* hey/));
    expect(consoleWarn).toBeCalledTimes(1);
    expect(consoleWarn).toBeCalledWith(
      expect.stringMatching(/.*\[WARNING].* hey/),
    );
    expect(consoleError).toBeCalledTimes(1);
    expect(consoleError).toBeCalledWith(
      expect.stringMatching(/.*\[ERROR].* hey/),
    );
  });
});
