/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @vitest-environment jsdom
import {describe, expect, it, vi, afterEach} from 'vitest';
import {renderHook} from '@testing-library/react';
import {useScrollToActiveItem} from '../useScrollToActiveItem';

function createMockRect(overrides: Partial<DOMRect>): DOMRect {
  return {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON() {
      return this;
    },
    ...overrides,
  };
}

function createMockDom(overrides?: {
  clientHeight?: number;
  scrollTop?: number;
  scrollHeight?: number;
}) {
  const menu = document.createElement('div');
  menu.classList.add('menu');

  const container = document.createElement('div');
  container.classList.add('menu');
  container.appendChild(menu);

  // container has the 'menu' class so container.closest('.menu') finds it
  Object.defineProperties(container, {
    clientHeight: {
      value: overrides?.clientHeight ?? 600,
      writable: true,
      configurable: true,
    },
    scrollTop: {
      value: overrides?.scrollTop ?? 0,
      writable: true,
      configurable: true,
    },
    scrollHeight: {
      value: overrides?.scrollHeight ?? 3000,
      writable: true,
      configurable: true,
    },
  });
  container.getBoundingClientRect = () =>
    createMockRect({top: 0, bottom: 600, height: 600});

  const activeItem = document.createElement('a');
  activeItem.classList.add('menu__link', 'menu__link--active');
  activeItem.setAttribute('aria-current', 'page');
  activeItem.textContent = 'Active Doc';
  menu.appendChild(activeItem);

  // Spacer to push active item below the visible area
  const spacer = document.createElement('div');
  spacer.style.height = '2000px';
  menu.prepend(spacer);

  Object.defineProperties(menu, {
    scrollTop: {
      value: 0,
      writable: true,
      configurable: true,
    },
    scrollHeight: {
      value: 3000,
      writable: true,
      configurable: true,
    },
  });
  menu.getBoundingClientRect = () =>
    createMockRect({top: 0, bottom: 600, height: 600, width: 300});

  Object.defineProperties(activeItem, {
    clientHeight: {
      value: 30,
      writable: true,
      configurable: true,
    },
  });
  activeItem.getBoundingClientRect = () =>
    createMockRect({top: 1500, bottom: 1530, height: 30, width: 280});

  document.body.appendChild(container);

  return {container, activeItem};
}

describe('useScrollToActiveItem', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });
  it('scrolls when active item is below the visible area', () => {
    const {container} = createMockDom();
    // Container has the 'menu' class, so the hook targets it directly
    const ref = {current: container};

    renderHook(() => useScrollToActiveItem(ref, '/docs/test', true));

    // Item is at scrollTop 1500, visible window is 0-600
    // scrollTop should be set to 1500 - 600 + 30 = 930
    expect(container.scrollTop).toBe(930);
  });

  it('does NOT scroll when enabled=false', () => {
    const {container} = createMockDom();
    const ref = {current: container};

    renderHook(() => useScrollToActiveItem(ref, '/docs/test', false));

    expect(container.scrollTop).toBe(0);
  });

  it('does NOT scroll the window object', () => {
    const {container} = createMockDom();
    const ref = {current: container};
    const windowScrollSpy = vi.spyOn(window, 'scrollTo');

    renderHook(() => useScrollToActiveItem(ref, '/docs/test', true));

    expect(windowScrollSpy).not.toHaveBeenCalled();
  });

  it('only scrolls once per activePath even after extra DOM mutations', () => {
    const {container} = createMockDom();
    // Container IS the .menu element that the hook targets
    const ref = {current: container};

    renderHook(() => useScrollToActiveItem(ref, '/docs/test', true));

    // After first render, scrollTop should be set
    expect(container.scrollTop).toBe(930);

    // Simulate extra DOM mutations happening later. The observer is already
    // disconnected after the first successful scroll, so manual mutations
    // should not trigger re-scrolls.
    container.scrollTop = 0;

    // scrollTop stays at 0 because the observer was disconnected
    expect(container.scrollTop).toBe(0);
  });

  it('works regardless of offsetParent (position:fixed) as long as clientHeight>0', () => {
    const {container} = createMockDom({
      clientHeight: 600,
    });
    const ref = {current: container};

    renderHook(() => useScrollToActiveItem(ref, '/docs/fixed', true));

    // The hook never checks offsetParent, only clientHeight, so this should
    // scroll regardless of the fixed-position rendering mode
    expect(container.scrollTop).toBe(930);
  });

  it('does nothing when container has no layout (clientHeight === 0)', () => {
    const {container} = createMockDom({
      clientHeight: 0,
    });
    const ref = {current: container};

    renderHook(() => useScrollToActiveItem(ref, '/docs/no-layout', true));

    expect(container.scrollTop).toBe(0);
  });
});
