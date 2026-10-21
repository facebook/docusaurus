/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @vitest-environment jsdom
import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {render, screen, act, cleanup} from '@testing-library/react';
import {
  MemoryRouter,
  StaticRouter,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import PendingNavigation, {
  prefersReducedMotion,
  shouldAnimateRouteTransition,
} from '../PendingNavigation';
import preload from '../preload';
import * as ClientLifecyclesDispatcherModule from '../ClientLifecyclesDispatcher';
import type {Location} from 'history';

vi.mock('../preload', () => ({
  default: vi.fn(() => Promise.resolve([])),
}));

vi.mock('@generated/client-modules', () => ({
  default: [],
}));

function createLocation(pathname: string, hash = '', search = ''): Location {
  return {
    pathname,
    search,
    hash,
    state: null,
    key: Math.random().toString(36).slice(2),
  };
}

describe('shouldAnimateRouteTransition and prefersReducedMotion', () => {
  beforeEach(() => {
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
  });

  it('detects reduced motion preference via matchMedia', () => {
    expect(prefersReducedMotion()).toBe(false);

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

    expect(prefersReducedMotion()).toBe(true);
  });

  it('skips animation if previousLocation is null (initial load/hydration)', () => {
    expect(
      shouldAnimateRouteTransition({
        previousLocation: null,
        nextLocation: createLocation('/docs/intro'),
      }),
    ).toBe(false);
  });

  it('animates qualifying cross-page navigation when pathnames differ', () => {
    expect(
      shouldAnimateRouteTransition({
        previousLocation: createLocation('/docs/intro'),
        nextLocation: createLocation('/docs/getting-started'),
      }),
    ).toBe(true);
  });

  it('skips animation for hash-only navigation on the same pathname', () => {
    expect(
      shouldAnimateRouteTransition({
        previousLocation: createLocation('/docs/intro'),
        nextLocation: createLocation('/docs/intro', '#section-1'),
      }),
    ).toBe(false);

    expect(
      shouldAnimateRouteTransition({
        previousLocation: createLocation('/docs/intro', '#section-1'),
        nextLocation: createLocation('/docs/intro', '#section-2'),
      }),
    ).toBe(false);
  });

  it('skips animation for query-only navigation on the same pathname', () => {
    expect(
      shouldAnimateRouteTransition({
        previousLocation: createLocation('/search', '', '?q=docusaurus'),
        nextLocation: createLocation('/search', '', '?q=react'),
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

    expect(
      shouldAnimateRouteTransition({
        previousLocation: createLocation('/docs/intro'),
        nextLocation: createLocation('/docs/getting-started'),
      }),
    ).toBe(false);
  });
});

describe('PendingNavigation component', () => {
  let startTransitionSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    startTransitionSpy = vi.spyOn(React, 'startTransition');
    vi.mocked(preload).mockClear();
    vi.mocked(preload).mockImplementation(() => Promise.resolve([]));
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
    cleanup();
    vi.restoreAllMocks();
  });

  function renderApp({
    initialEntries = ['/'],
    viewTransitions = false,
  }: {
    initialEntries?: string[];
    viewTransitions?: boolean;
  } = {}) {
    let historyRef!: ReturnType<typeof useHistory>;

    function TestContent() {
      const history = useHistory();
      const location = useLocation();
      historyRef = history;

      return (
        <PendingNavigation
          location={location}
          viewTransitions={viewTransitions}>
          <Switch>
            <Route
              exact
              path="/"
              render={() => <div data-testid="page-home">Home Page</div>}
            />
            <Route
              path="/docs/intro"
              render={() => <div data-testid="page-docs">Docs Intro</div>}
            />
            <Route
              path="/docs/guide"
              render={() => <div data-testid="page-guide">Docs Guide</div>}
            />
          </Switch>
        </PendingNavigation>
      );
    }

    const utils = render(
      <MemoryRouter initialEntries={initialEntries}>
        <TestContent />
      </MemoryRouter>,
    );

    return {
      ...utils,
      get history() {
        return historyRef;
      },
    };
  }

  it('is disabled by default and does not use startTransition', async () => {
    const {history} = renderApp({viewTransitions: false});
    expect(screen.getByTestId('page-home')).not.toBeNull();

    startTransitionSpy.mockClear();

    await act(async () => {
      history.push('/docs/intro');
    });

    expect(screen.getByTestId('page-docs')).not.toBeNull();
    expect(startTransitionSpy).not.toHaveBeenCalled();
  });

  it('uses React startTransition for eligible route change when enabled', async () => {
    const {history} = renderApp({viewTransitions: true});
    expect(screen.getByTestId('page-home')).not.toBeNull();

    startTransitionSpy.mockClear();

    await act(async () => {
      history.push('/docs/intro');
    });

    expect(screen.getByTestId('page-docs')).not.toBeNull();
    expect(startTransitionSpy).toHaveBeenCalledTimes(1);
  });

  it('keeps old route visible while preload is in progress, then renders new route', async () => {
    let resolvePreload!: () => void;
    vi.mocked(preload).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePreload = () => resolve([]);
        }),
    );

    const {history} = renderApp({viewTransitions: true});
    expect(screen.getByTestId('page-home')).not.toBeNull();

    // Trigger navigation to /docs/intro
    act(() => {
      history.push('/docs/intro');
    });

    // While preload has not resolved, old page remains visible!
    expect(screen.getByTestId('page-home')).not.toBeNull();
    expect(screen.queryByTestId('page-docs')).toBeNull();

    // Now complete the preload
    await act(async () => {
      resolvePreload();
    });

    // New page is rendered!
    expect(screen.getByTestId('page-docs')).not.toBeNull();
    expect(screen.queryByTestId('page-home')).toBeNull();
  });

  it('skips React Transition for hash-only navigation', async () => {
    const {history} = renderApp({
      initialEntries: ['/docs/intro'],
      viewTransitions: true,
    });
    expect(screen.getByTestId('page-docs')).not.toBeNull();

    startTransitionSpy.mockClear();

    await act(async () => {
      history.push('/docs/intro#heading-1');
    });

    expect(screen.getByTestId('page-docs')).not.toBeNull();
    expect(startTransitionSpy).not.toHaveBeenCalled();
  });

  it('skips React Transition for search query-only navigation', async () => {
    const {history} = renderApp({
      initialEntries: ['/docs/intro'],
      viewTransitions: true,
    });
    expect(screen.getByTestId('page-docs')).not.toBeNull();

    startTransitionSpy.mockClear();

    await act(async () => {
      history.push('/docs/intro?filter=true');
    });

    expect(screen.getByTestId('page-docs')).not.toBeNull();
    expect(startTransitionSpy).not.toHaveBeenCalled();
  });

  it('skips React Transition when user prefers reduced motion', async () => {
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

    const {history} = renderApp({viewTransitions: true});
    expect(screen.getByTestId('page-home')).not.toBeNull();

    startTransitionSpy.mockClear();

    await act(async () => {
      history.push('/docs/intro');
    });

    expect(screen.getByTestId('page-docs')).not.toBeNull();
    // Because reduced motion is active, startTransition should not be used
    expect(startTransitionSpy).not.toHaveBeenCalled();
  });

  it('handles back and forward navigation correctly', async () => {
    const {history} = renderApp({viewTransitions: true});
    expect(screen.getByTestId('page-home')).not.toBeNull();

    await act(async () => {
      history.push('/docs/intro');
    });
    expect(screen.getByTestId('page-docs')).not.toBeNull();

    startTransitionSpy.mockClear();

    await act(async () => {
      history.goBack();
    });
    expect(screen.getByTestId('page-home')).not.toBeNull();
    expect(startTransitionSpy).toHaveBeenCalledTimes(1);

    startTransitionSpy.mockClear();

    await act(async () => {
      history.goForward();
    });
    expect(screen.getByTestId('page-docs')).not.toBeNull();
    expect(startTransitionSpy).toHaveBeenCalledTimes(1);
  });

  it('preserves routeUpdateCleanupCb and lifecycle dispatchers', async () => {
    const cleanupSpy = vi.fn();
    const dispatchSpy = vi
      .spyOn(ClientLifecyclesDispatcherModule, 'dispatchLifecycleAction')
      .mockReturnValue(cleanupSpy);

    const {history} = renderApp({viewTransitions: true});

    await act(async () => {
      history.push('/docs/intro');
    });

    expect(dispatchSpy).toHaveBeenCalledWith(
      'onRouteUpdate',
      expect.any(Object),
    );
    expect(cleanupSpy).toHaveBeenCalled();
  });

  it('renders ViewTransition boundary when viewTransitions is enabled', () => {
    const location = createLocation('/');
    const component = new PendingNavigation({
      location,
      children: <div>Content</div>,
      viewTransitions: true,
    });
    const rendered = component.render() as React.ReactElement<{
      children: React.ReactElement;
    }>;
    expect(rendered.props.children.type).toBe(React.ViewTransition);
  });

  it('does not render ViewTransition boundary when viewTransitions is disabled', () => {
    const location = createLocation('/');
    const component = new PendingNavigation({
      location,
      children: <div>Content</div>,
      viewTransitions: false,
    });
    const rendered = component.render() as React.ReactElement<{
      children: React.ReactElement;
    }>;
    expect(rendered.props.children.type).not.toBe(React.ViewTransition);
    expect(rendered.props.children.type).toBe(Route);
  });

  it('handles rapid consecutive navigations gracefully', async () => {
    let resolveFirstPreload!: () => void;
    let resolveSecondPreload!: () => void;

    vi.mocked(preload)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirstPreload = () => resolve([]);
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSecondPreload = () => resolve([]);
          }),
      );

    const {history} = renderApp({viewTransitions: true});
    expect(screen.getByTestId('page-home')).not.toBeNull();

    // User navigates to /docs/intro
    act(() => {
      history.push('/docs/intro');
    });

    // Before /docs/intro finishes preloading,
    // user rapidly navigates to /docs/guide
    act(() => {
      history.push('/docs/guide');
    });

    // Finish first preload
    await act(async () => {
      resolveFirstPreload();
    });

    // Finish second preload
    await act(async () => {
      resolveSecondPreload();
    });

    // The final route /docs/guide is rendered without getting stuck
    expect(screen.getByTestId('page-guide')).not.toBeNull();
  });

  it('reloads window if preload fails', async () => {
    const originalReload = window.location.reload;
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...window.location,
        reload: reloadMock,
      },
    });

    vi.mocked(preload).mockRejectedValueOnce(new Error('Chunk loading failed'));
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const {history} = renderApp({viewTransitions: true});

    await act(async () => {
      history.push('/docs/intro');
    });

    expect(reloadMock).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...window.location,
        reload: originalReload,
      },
    });
  });

  it('renders safely in SSR / SSG without DOM errors', () => {
    const location = createLocation('/docs/intro');
    const html = ReactDOMServer.renderToString(
      <StaticRouter location={location.pathname}>
        <PendingNavigation location={location} viewTransitions={true}>
          <div data-testid="ssr-content">SSR Content</div>
        </PendingNavigation>
      </StaticRouter>,
    );
    expect(html).toContain('SSR Content');
  });
});
