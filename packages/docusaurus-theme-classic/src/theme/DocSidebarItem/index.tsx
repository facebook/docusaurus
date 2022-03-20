/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useMemo} from 'react';
import clsx from 'clsx';
import {
  isActiveSidebarItem,
  usePrevious,
  Collapsible,
  useCollapsible,
  findFirstCategoryLink,
  ThemeClassNames,
  useThemeConfig,
  useDocSidebarItemsExpandedState,
  isSamePath,
  useDocsFilter,
} from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import {translate} from '@docusaurus/Translate';
import IconExternalLink from '@theme/IconExternalLink';
import TextHighlight from '@theme/TextHighlight';

import DocSidebarItems from '@theme/DocSidebarItems';
import type {Props} from '@theme/DocSidebarItem';
import type {
  PropSidebarItemCategory,
  PropSidebarItemLink,
} from '@docusaurus/plugin-content-docs';

import styles from './styles.module.css';
import useIsBrowser from '@docusaurus/useIsBrowser';
import type {SidebarItemHtml} from '@docusaurus/plugin-content-docs/src/sidebars/types';

export default function DocSidebarItem({
  item,
  ...props
}: Props): JSX.Element | null {
  switch (item.type) {
    case 'category':
      return <DocSidebarItemCategory item={item} {...props} />;
    case 'html':
      return <DocSidebarItemHtml item={item} {...props} />;
    case 'link':
    default:
      return <DocSidebarItemLink item={item} {...props} />;
  }
}

// If we navigate to a category and it becomes active, it should automatically
// expand itself
function useAutoExpandActiveCategory({
  isActive,
  collapsed,
  setCollapsed,
}: {
  isActive: boolean;
  collapsed: boolean;
  setCollapsed: (b: boolean) => void;
}) {
  const wasActive = usePrevious(isActive);
  useEffect(() => {
    const justBecameActive = isActive && !wasActive;
    if (justBecameActive && collapsed) {
      setCollapsed(false);
    }
  }, [isActive, wasActive, collapsed, setCollapsed]);
}

/**
 * When a collapsible category has no link, we still link it to its first child
 * during SSR as a temporary fallback. This allows to be able to navigate inside
 * the category even when JS fails to load, is delayed or simply disabled
 * React hydration becomes an optional progressive enhancement
 * see https://github.com/facebookincubator/infima/issues/36#issuecomment-772543188
 * see https://github.com/facebook/docusaurus/issues/3030
 */
function useCategoryHrefWithSSRFallback(
  item: PropSidebarItemCategory,
): string | undefined {
  const isBrowser = useIsBrowser();
  return useMemo(() => {
    if (item.href) {
      return item.href;
    }
    // In these cases, it's not necessary to render a fallback
    // We skip the "findFirstCategoryLink" computation
    if (isBrowser || !item.collapsible) {
      return undefined;
    }
    return findFirstCategoryLink(item);
  }, [item, isBrowser]);
}

function DocSidebarItemCategory({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props & {item: PropSidebarItemCategory}) {
  const {items, label, collapsible, className, href} = item;
  const hrefWithSSRFallback = useCategoryHrefWithSSRFallback(item);
  const {filterTerm} = useDocsFilter();

  const isActive = isActiveSidebarItem(item, activePath);
  const isCurrentPage = isSamePath(href, activePath);

  const {collapsed, setCollapsed} = useCollapsible({
    // active categories are always initialized as expanded
    // the default (item.collapsed) is only used for non-active categories
    initialState: () => {
      if (!collapsible) {
        return false;
      }
      return isActive ? false : item.collapsed;
    },
  });

  // todo: this hook should not be there at all, when re-rendering
  // (= clearing filter input), the `collapsed` state is not calculated
  // correctly (if input of `item.collapsed` is `true`, it is `false` here)
  useEffect(() => {
    if (filterTerm === '' && !isActive && item.collapsible) {
      setCollapsed(item.collapsed);
    }
  }, [filterTerm, isActive, item.collapsible, setCollapsed, item.collapsed]);

  useAutoExpandActiveCategory({isActive, collapsed, setCollapsed});
  const {expandedItem, setExpandedItem} = useDocSidebarItemsExpandedState();
  function updateCollapsed(toCollapsed: boolean = !collapsed) {
    setExpandedItem(toCollapsed ? null : index);
    setCollapsed(toCollapsed);
  }
  const {autoCollapseSidebarCategories} = useThemeConfig();
  useEffect(() => {
    if (
      collapsible &&
      expandedItem &&
      expandedItem !== index &&
      autoCollapseSidebarCategories &&
      !filterTerm
    ) {
      setCollapsed(true);
    }
  }, [
    collapsible,
    expandedItem,
    index,
    setCollapsed,
    autoCollapseSidebarCategories,
    filterTerm,
  ]);

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemCategory,
        ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
        'menu__list-item',
        {
          'menu__list-item--collapsed': collapsed,
        },
        className,
      )}>
      <div
        className={clsx('menu__list-item-collapsible', {
          'menu__list-item-collapsible--active': isCurrentPage,
        })}>
        <Link
          className={clsx('menu__link', {
            'menu__link--sublist': collapsible && !href,
            'menu__link--active': isActive,
          })}
          onClick={
            collapsible
              ? (e) => {
                  onItemClick?.(item);
                  if (href) {
                    updateCollapsed(false);
                  } else {
                    e.preventDefault();
                    updateCollapsed();
                  }
                }
              : () => {
                  onItemClick?.(item);
                }
          }
          aria-current={isCurrentPage ? 'page' : undefined}
          aria-expanded={collapsible ? !collapsed : undefined}
          href={collapsible ? hrefWithSSRFallback ?? '#' : hrefWithSSRFallback}
          {...props}>
          <TextHighlight text={label} highlight={filterTerm} />
        </Link>
        {href && collapsible && (
          <button
            aria-label={translate(
              {
                id: 'theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel',
                message: "Toggle the collapsible sidebar category '{label}'",
                description:
                  'The ARIA label to toggle the collapsible sidebar category',
              },
              {label},
            )}
            type="button"
            className="clean-btn menu__caret"
            onClick={(e) => {
              e.preventDefault();
              updateCollapsed();
            }}
          />
        )}
      </div>

      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        <DocSidebarItems
          items={items}
          tabIndex={collapsed ? -1 : 0}
          onItemClick={onItemClick}
          activePath={activePath}
          level={level + 1}
        />
      </Collapsible>
    </li>
  );
}

function DocSidebarItemHtml({
  item,
  level,
  index,
}: Props & {item: SidebarItemHtml}) {
  const {value, defaultStyle, className} = item;
  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        defaultStyle && `${styles.menuHtmlItem} menu__list-item`,
        className,
      )}
      key={index}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: value}}
    />
  );
}

function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props & {item: PropSidebarItemLink}) {
  const {href, label, className} = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const {filterTerm} = useDocsFilter();
  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        className,
      )}
      key={label}>
      <Link
        className={clsx('menu__link', {
          'menu__link--active': isActive,
        })}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalUrl(href) && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}>
        <span>
          <TextHighlight text={label} highlight={filterTerm} />
          {!isInternalUrl(href) && <IconExternalLink />}
        </span>
      </Link>
    </li>
  );
}
