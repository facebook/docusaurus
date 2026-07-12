/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @vitest-environment jsdom

import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest';
import {
  getViewTransitionTypes,
  isViewTransitionsEnabled,
  resetViewTransitionStateForTesting,
  runRouteUpdateWithViewTransition,
  shouldAnimateRouteTransition,
} from '../viewTransitionUtils';
import type {Location} from 'history';

vi.mock('@generated/docusaurus.config', () => ({
  default: {
    future: {
      ['experimental_viewTransitions']: true,
    },
  },
}));

vi.mock('../exports/ExecutionEnvironment', () => ({
  default: {
    canUseDOM: true,
  },
}));

function createLocation(pathname: string): Location {
  return {
    pathname,
    search: '',
    hash: '',
    state: null,
    key: 'default',
  };
}

function createMockViewTransition({
  finished = Promise.resolve(),
  skipTransition = vi.fn(),
}: {
  finished?: Promise<void>;
  skipTransition?: () => void;
} = {}): ViewTransition {
  return {
    finished,
    ready: Promise.resolve(),
    updateCallbackDone: Promise.resolve(),
    types: new Set<string>(),
    skipTransition,
  };
}

describe('viewTransitionUtils', () => {
  const previousLocation = createLocation('/docs/intro');
  const nextLocation = createLocation('/docs/installation');

  beforeEach(() => {
    resetViewTransitionStateForTesting();
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: vi.fn((callbackOrOptions) => {
        if (typeof callbackOrOptions === 'function') {
          callbackOrOptions();
        } else {
          callbackOrOptions?.update?.();
        }
        return createMockViewTransition();
      }),
    });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    resetViewTransitionStateForTesting();
  });

  it('reports whether view transitions are enabled in config', () => {
    expect(isViewTransitionsEnabled()).toBe(true);
  });

  it('maps history actions to view transition types', () => {
    expect(getViewTransitionTypes('PUSH')).toEqual([
      'navigate',
      'navigate-push',
    ]);
    expect(getViewTransitionTypes('POP')).toEqual(['navigate', 'navigate-pop']);
    expect(getViewTransitionTypes('REPLACE')).toEqual([
      'navigate',
      'navigate-replace',
    ]);
  });

  it('animates cross-pathname navigations when enabled', () => {
    expect(shouldAnimateRouteTransition({previousLocation, nextLocation})).toBe(
      true,
    );
  });

  it('skips animation when previous location is null', () => {
    expect(
      shouldAnimateRouteTransition({
        previousLocation: null,
        nextLocation,
      }),
    ).toBe(false);
  });

  it('skips animation for hash-only navigations', () => {
    expect(
      shouldAnimateRouteTransition({
        previousLocation: createLocation('/docs/intro'),
        nextLocation: {
          ...createLocation('/docs/intro'),
          hash: '#setup',
        },
      }),
    ).toBe(false);
  });

  it('skips animation when user prefers reduced motion', () => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    expect(shouldAnimateRouteTransition({previousLocation, nextLocation})).toBe(
      false,
    );
  });

  it('skips animation when View Transition API is unavailable', () => {
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: undefined,
    });

    expect(shouldAnimateRouteTransition({previousLocation, nextLocation})).toBe(
      false,
    );
  });

  it('runs DOM update inside startViewTransition with navigation types', () => {
    const updateDom = vi.fn();

    runRouteUpdateWithViewTransition(updateDom, {
      previousLocation,
      nextLocation,
      navigationAction: 'PUSH',
    });

    expect(document.startViewTransition).toHaveBeenCalledTimes(1);
    expect(document.startViewTransition).toHaveBeenCalledWith({
      update: expect.any(Function),
      types: ['navigate', 'navigate-push'],
    });
    expect(updateDom).toHaveBeenCalledTimes(1);
  });

  it('skips the previous transition on rapid consecutive navigations', () => {
    const firstSkipTransition = vi.fn();
    const secondSkipTransition = vi.fn();

    vi.mocked(document.startViewTransition)
      .mockImplementationOnce(() =>
        createMockViewTransition({
          finished: new Promise(() => {}),
          skipTransition: firstSkipTransition,
        }),
      )
      .mockImplementationOnce((callbackOrOptions) => {
        if (typeof callbackOrOptions === 'function') {
          callbackOrOptions();
        } else {
          callbackOrOptions?.update?.();
        }
        return createMockViewTransition({
          skipTransition: secondSkipTransition,
        });
      });

    const firstUpdate = vi.fn();
    const secondUpdate = vi.fn();

    runRouteUpdateWithViewTransition(firstUpdate, {
      previousLocation,
      nextLocation,
      navigationAction: 'PUSH',
    });

    runRouteUpdateWithViewTransition(secondUpdate, {
      previousLocation: nextLocation,
      nextLocation: createLocation('/docs/advanced'),
      navigationAction: 'PUSH',
    });

    expect(firstSkipTransition).toHaveBeenCalledTimes(1);
    expect(secondUpdate).toHaveBeenCalledTimes(1);
  });

  it('falls back to a direct DOM update when animation is skipped', () => {
    const updateDom = vi.fn();

    runRouteUpdateWithViewTransition(updateDom, {
      previousLocation: null,
      nextLocation,
      navigationAction: 'PUSH',
    });

    expect(document.startViewTransition).not.toHaveBeenCalled();
    expect(updateDom).toHaveBeenCalledTimes(1);
  });
});
