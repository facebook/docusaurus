/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useCallback,
  type ComponentProps,
  type ReactNode,
  type ReactElement,
} from 'react';
import type {TagType} from '@site/src/data/users';
import {useTags} from '../../_utils';

import styles from './styles.module.css';

interface Props extends ComponentProps<'input'> {
  icon: ReactElement<ComponentProps<'svg'>>;
  label: ReactNode;
  tag: TagType;
}

function ShowcaseTagSelect(
  {id, icon, label, tag, ...rest}: Props,
  ref: React.ForwardedRef<HTMLLabelElement>,
) {
  const [tags, setTags] = useTags();
  const isTagSelected = tags.includes(tag);

  const toggleTag = useCallback(() => {
    setTags((list) => {
      return list.includes(tag)
        ? list.filter((t) => t !== tag)
        : [...list, tag];
    });
  }, [tag, setTags]);

  return (
    <>
      <input
        type="checkbox"
        id={id}
        checked={isTagSelected}
        onChange={toggleTag}
        className="screen-reader-only"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            toggleTag();
          }
        }}
        onFocus={(e) => {
          if (e.relatedTarget) {
            e.target.nextElementSibling?.dispatchEvent(
              new KeyboardEvent('focus'),
            );
          }
        }}
        onBlur={(e) => {
          e.target.nextElementSibling?.dispatchEvent(new KeyboardEvent('blur'));
        }}
        {...rest}
      />
      <label ref={ref} htmlFor={id} className={styles.checkboxLabel}>
        {label}
        {icon}
      </label>
    </>
  );
}

export default React.forwardRef(ShowcaseTagSelect);
