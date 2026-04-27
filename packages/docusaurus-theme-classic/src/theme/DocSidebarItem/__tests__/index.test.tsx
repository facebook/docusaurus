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
import React, {type ReactNode} from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import DocSidebarItemCategory from '@theme/DocSidebarItem/Category';
import DocSidebarItemLink from '@theme/DocSidebarItem/Link';
import type {Props as CategoryProps} from '@theme/DocSidebarItem/Category';
import type {Props as LinkProps} from '@theme/DocSidebarItem/Link';

jest.mock('@docusaurus/Link', () => {
  const ReactActual = jest.requireActual<typeof import('react')>('react');

  return {
    __esModule: true,
    default({
      to,
      href,
      children,
      autoAddBaseUrl: _autoAddBaseUrl,
      ...props
    }: {
      to?: string;
      href?: string;
      children?: ReactNode;
      autoAddBaseUrl?: boolean;
      [key: string]: unknown;
    }) {
      return ReactActual.createElement(
        'a',
        {href: href ?? to, ...props},
        children,
      );
    },
  };
});

jest.mock('@docusaurus/plugin-content-docs/client', () => ({
  isActiveSidebarItem: jest.fn(() => false),
  findFirstSidebarItemLink: jest.fn(() => undefined),
  useDocSidebarItemsExpandedState: jest.fn(() => ({
    expandedItem: null,
    setExpandedItem: jest.fn(),
  })),
  useVisibleSidebarItems: jest.fn((items) => items),
}));

jest.mock(
  '@docusaurus/theme-common',
  () => {
    const ReactActual = jest.requireActual<typeof import('react')>('react');

    return {
      ThemeClassNames: {
        docs: {
          docSidebarItemCategory: 'docSidebarItemCategory',
          docSidebarItemCategoryLevel: (level: number) =>
            `docSidebarItemCategoryLevel${level}`,
          docSidebarItemLink: 'docSidebarItemLink',
          docSidebarItemLinkLevel: (level: number) =>
            `docSidebarItemLinkLevel${level}`,
        },
      },
      useThemeConfig: jest.fn(() => ({
        docs: {sidebar: {autoCollapseCategories: false}},
      })),
      usePrevious: jest.fn(() => undefined),
      Collapsible({children}: {children?: ReactNode}) {
        return ReactActual.createElement(ReactActual.Fragment, null, children);
      },
      useCollapsible({initialState}: {initialState: () => boolean}) {
        const [collapsed, setCollapsed] = ReactActual.useState(initialState);
        return {collapsed, setCollapsed};
      },
    };
  },
  {virtual: true},
);

jest.mock(
  '@docusaurus/theme-common/internal',
  () => ({
    isSamePath: jest.fn(() => false),
  }),
  {virtual: true},
);

jest.mock('@docusaurus/Translate', () => ({
  translate: ({message}: {message: string}) => message,
}));

jest.mock('@docusaurus/useIsBrowser', () => ({
  __esModule: true,
  default: jest.fn(() => true),
}));

jest.mock('@theme/DocSidebarItems', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

jest.mock('@theme/Icon/ExternalLink', () => ({
  __esModule: true,
  default: jest.fn(() => <span aria-hidden="true" />),
}));

describe('DocSidebarItem labels', () => {
  it('does not render title attributes for link labels', () => {
    const item: LinkProps['item'] = {
      type: 'link',
      label: 'Installation',
      href: '/docs/installation',
    };

    const {getByText} = render(
      <DocSidebarItemLink item={item} activePath="" level={1} index={0} />,
    );

    expect(getByText('Installation')).not.toHaveAttribute('title');
  });

  it('does not render title attributes for category labels', () => {
    const item: CategoryProps['item'] = {
      type: 'category',
      label: 'Guides',
      collapsible: false,
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'Child',
          href: '/docs/child',
        },
      ],
    };

    const {getByText} = render(
      <DocSidebarItemCategory item={item} activePath="" level={1} index={0} />,
    );

    expect(getByText('Guides')).not.toHaveAttribute('title');
  });
});
