/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment jsdom
 */

// Jest doesn't allow pragma below other comments. https://github.com/facebook/jest/issues/12573
// eslint-disable-next-line header/header
import React from 'react';
import {act, render, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import Mermaid from '../index';

jest.mock(
  '@docusaurus/ErrorBoundary',
  () => {
    function MockErrorBoundary({children}: {children: React.ReactNode}) {
      return <>{children}</>;
    }

    return MockErrorBoundary;
  },
  {virtual: true},
);

jest.mock('@docusaurus/theme-common', () => ({
  ...jest.requireActual('@docusaurus/theme-common'),
  useColorMode: () => ({colorMode: 'light'}),
  useThemeConfig: () => ({
    mermaid: {
      theme: {
        light: 'default',
        dark: 'dark',
      },
      options: {},
    },
  }),
}));

jest.mock(
  '@docusaurus/theme-common/internal',
  () => ({
    ErrorBoundaryErrorMessageFallback: () => null,
    useTabBecameVisibleCallback:
      require('../../../../../docusaurus-theme-common/src/hooks/useTabBecameVisibleCallback')
        .useTabBecameVisibleCallback,
  }),
  {virtual: true},
);

jest.mock(
  '@docusaurus/theme-mermaid/client',
  () => ({
    MermaidContainerClassName: 'mermaid',
    useMermaidRenderResult: jest.fn(
      ({renderCounter}: {renderCounter: number}) => ({
        svg: `<svg data-render-counter="${renderCounter}"></svg>`,
        bindFunctions: undefined,
      }),
    ),
  }),
  {virtual: true},
);

const {useMermaidRenderResult: mockUseMermaidRenderResult} = jest.requireMock(
  '@docusaurus/theme-mermaid/client',
) as {
  useMermaidRenderResult: jest.Mock;
};

describe('Mermaid', () => {
  beforeEach(() => {
    mockUseMermaidRenderResult.mockClear();
  });

  it('re-renders when a hidden tab becomes visible', async () => {
    const tabPanel = document.createElement('div');
    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.setAttribute('hidden', '');
    document.body.appendChild(tabPanel);

    const {unmount} = render(<Mermaid value={'graph LR\n  a --> b'} />, {
      container: tabPanel,
    });

    expect(mockUseMermaidRenderResult).toHaveBeenCalledWith({
      text: 'graph LR\n  a --> b',
      renderCounter: 0,
    });
    expect(tabPanel.querySelector('svg')).toHaveAttribute(
      'data-render-counter',
      '0',
    );

    await act(async () => {
      tabPanel.removeAttribute('hidden');
    });

    await waitFor(() => {
      expect(mockUseMermaidRenderResult).toHaveBeenCalledWith({
        text: 'graph LR\n  a --> b',
        renderCounter: 1,
      });
      expect(tabPanel.querySelector('svg')).toHaveAttribute(
        'data-render-counter',
        '1',
      );
    });

    unmount();
    tabPanel.remove();
  });
});
