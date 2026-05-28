/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @vitest-environment jsdom
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import React from 'react';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {Collapsible, useCollapsible} from '../index';

function CollapsibleHarness({
  onTransitionEnd,
}: {
  onTransitionEnd: (collapsed: boolean) => void;
}) {
  const {collapsed, toggleCollapsed} = useCollapsible({initialState: true});

  return (
    <>
      <button type="button" onClick={toggleCollapsed}>
        toggle
      </button>
      <Collapsible
        lazy={false}
        collapsed={collapsed}
        onCollapseTransitionEnd={onTransitionEnd}>
        <div data-testid="collapsible-content">content</div>
      </Collapsible>
    </>
  );
}

function fireHeightTransitionEnd(element: HTMLElement) {
  const event = new Event('transitionend', {bubbles: true});
  Object.defineProperty(event, 'propertyName', {
    configurable: true,
    value: 'height',
  });
  fireEvent(element, event);
}

describe('Collapsible', () => {
  let transitionProperty: string;
  let transitionDuration: string;

  beforeEach(() => {
    transitionProperty = 'height';
    transitionDuration = '0ms';
    const getComputedStyle = window.getComputedStyle.bind(window);

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 0;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(
      () => undefined,
    );
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => ({matches: false}) as MediaQueryList),
    });
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      const style = getComputedStyle(element);
      Object.defineProperty(style, 'transitionDuration', {
        configurable: true,
        value: transitionDuration,
      });
      Object.defineProperty(style, 'transitionProperty', {
        configurable: true,
        value: transitionProperty,
      });
      return style;
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    Reflect.deleteProperty(window, 'matchMedia');
  });

  it('does not wait for transitionend when height transition duration is zero', () => {
    const onTransitionEnd = vi.fn();
    render(<CollapsibleHarness onTransitionEnd={onTransitionEnd} />);

    const collapsible = screen.getByTestId('collapsible-content')
      .parentElement as HTMLElement;
    Object.defineProperty(collapsible, 'scrollHeight', {
      configurable: true,
      value: 128,
    });

    expect(collapsible.style.display).toBe('none');
    expect(collapsible.style.height).toBe('0px');
    expect(collapsible.style.overflow).toBe('hidden');

    act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'toggle'}));
    });

    expect(onTransitionEnd).toHaveBeenLastCalledWith(false);
    expect(collapsible.style.display).toBe('block');
    expect(collapsible.style.height).toBe('auto');
    expect(collapsible.style.overflow).toBe('visible');

    fireHeightTransitionEnd(collapsible);

    expect(onTransitionEnd).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'toggle'}));
    });

    expect(onTransitionEnd).toHaveBeenLastCalledWith(true);
    expect(collapsible.style.display).toBe('none');
    expect(collapsible.style.height).toBe('0px');
    expect(collapsible.style.overflow).toBe('hidden');
  });

  it('does not wait for transitionend when height transition is not configured', () => {
    transitionProperty = 'opacity';
    transitionDuration = '200ms';
    const onTransitionEnd = vi.fn();
    render(<CollapsibleHarness onTransitionEnd={onTransitionEnd} />);

    const collapsible = screen.getByTestId('collapsible-content')
      .parentElement as HTMLElement;
    Object.defineProperty(collapsible, 'scrollHeight', {
      configurable: true,
      value: 128,
    });

    act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'toggle'}));
    });

    expect(onTransitionEnd).toHaveBeenLastCalledWith(false);
    expect(collapsible.style.display).toBe('block');
    expect(collapsible.style.height).toBe('auto');
    expect(collapsible.style.overflow).toBe('visible');

    act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'toggle'}));
    });

    expect(onTransitionEnd).toHaveBeenLastCalledWith(true);
    expect(collapsible.style.display).toBe('none');
    expect(collapsible.style.height).toBe('0px');
    expect(collapsible.style.overflow).toBe('hidden');
  });

  it('waits for height transition end when transition duration is not zero', () => {
    transitionDuration = '1ms';
    const onTransitionEnd = vi.fn();
    render(<CollapsibleHarness onTransitionEnd={onTransitionEnd} />);

    const collapsible = screen.getByTestId('collapsible-content')
      .parentElement as HTMLElement;
    Object.defineProperty(collapsible, 'scrollHeight', {
      configurable: true,
      value: 128,
    });

    act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'toggle'}));
    });

    expect(onTransitionEnd).not.toHaveBeenCalled();
    expect(collapsible.style.display).toBe('block');
    expect(collapsible.style.height).toBe('128px');
    expect(collapsible.style.overflow).toBe('hidden');

    fireHeightTransitionEnd(collapsible);

    expect(onTransitionEnd).toHaveBeenLastCalledWith(false);
    expect(collapsible.style.height).toBe('auto');
    expect(collapsible.style.overflow).toBe('visible');
  });

  it('waits for height transition end when zero duration belongs to another property', () => {
    transitionProperty = 'opacity, height';
    transitionDuration = '0ms, 1ms';
    const onTransitionEnd = vi.fn();
    render(<CollapsibleHarness onTransitionEnd={onTransitionEnd} />);

    const collapsible = screen.getByTestId('collapsible-content')
      .parentElement as HTMLElement;
    Object.defineProperty(collapsible, 'scrollHeight', {
      configurable: true,
      value: 128,
    });

    act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'toggle'}));
    });

    expect(onTransitionEnd).not.toHaveBeenCalled();

    fireHeightTransitionEnd(collapsible);

    expect(onTransitionEnd).toHaveBeenLastCalledWith(false);
    expect(collapsible.style.height).toBe('auto');
    expect(collapsible.style.overflow).toBe('visible');
  });
});
