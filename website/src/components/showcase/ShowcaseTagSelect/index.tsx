/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  ComponentProps,
  ReactNode,
  ReactElement,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
import {toggleListItem} from '@site/src/utils/jsUtils';
import type {TagType} from '@site/src/data/users';

import styles from './styles.module.css';

interface Props extends ComponentProps<'input'> {
  icon: ReactElement<ComponentProps<'svg'>>;
  label: ReactNode;
  tag: TagType;
}

export const TagQueryStringKey = 'tags';

export function readSearchTags(search: string): TagType[] {
  return new URLSearchParams(search).getAll(TagQueryStringKey) as TagType[];
}

function replaceSearchTags(search: string, newTags: TagType[]) {
  const searchParams = new URLSearchParams(search);
  searchParams.delete(TagQueryStringKey);
  newTags.forEach((tag) => searchParams.append(TagQueryStringKey, tag));
  return searchParams.toString();
}

const ShowcaseTagSelect = React.forwardRef<HTMLLabelElement, Props>(
  ({id, icon, label, tag, ...rest}, ref) => {
    const location = useLocation();
    const history = useHistory();
    const inputRef = useRef<HTMLInputElement>();
    useEffect(() => {
      const tags = readSearchTags(location.search);
      if (tags.includes(tag)) {
        inputRef.current.checked = true;
      }
    }, [tag, location]);
    const toggleTag = useCallback(() => {
      const tags = readSearchTags(location.search);
      const newTags = toggleListItem(tags, tag);
      const newSearch = replaceSearchTags(location.search, newTags);
      history.push({...location, search: newSearch});
    }, [tag, location, history]);
    return (
      <>
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              toggleTag();
              inputRef.current.checked = !inputRef.current.checked;
            }
          }}
          onChange={toggleTag}
          {...rest}
        />
        <label
          ref={ref}
          htmlFor={id}
          className={styles.checkboxLabel}
          aria-describedby={id}>
          {label}
          {icon}
        </label>
      </>
    );
  },
);

export default ShowcaseTagSelect;
