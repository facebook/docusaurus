/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReactNode, CSSProperties} from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import {
  useFilteredUsers,
  useSiteCountPlural,
  Tags,
  TagList,
} from '@docusaurus/plugin-content-showcase/client';
import FavoriteIcon from '@theme/Showcase/FavoriteIcon';
import Heading from '@theme/Heading';
import ShowcaseTagSelect from '@theme/Showcase/ShowcaseTagSelect';
import OperatorButton from '@theme/Showcase/OperatorButton';
import ClearAllButton from '@theme/Showcase/ClearAllButton';
import type {Props} from '@theme/Showcase/ShowcaseFilters';
import type {TagType} from '@docusaurus/plugin-content-showcase';

import styles from './styles.module.css';

function TagCircleIcon({color, style}: {color: string; style?: CSSProperties}) {
  return (
    <span
      style={{
        backgroundColor: color,
        width: 10,
        height: 10,
        borderRadius: '50%',
        ...style,
      }}
    />
  );
}

function ShowcaseTagListItem({tag}: {tag: TagType}) {
  const {label, description, color} = Tags[tag];
  return (
    <li className={styles.tagListItem}>
      <ShowcaseTagSelect
        tag={tag}
        label={label}
        description={description}
        icon={
          tag === 'favorite' ? (
            <FavoriteIcon size="small" style={{marginLeft: 8}} />
          ) : (
            <TagCircleIcon
              color={color}
              style={{
                backgroundColor: color,
                marginLeft: 8,
              }}
            />
          )
        }
      />
    </li>
  );
}

function ShowcaseTagList() {
  return (
    <ul className={clsx('clean-list', styles.tagList)}>
      {TagList.map((tag) => {
        return <ShowcaseTagListItem key={tag} tag={tag} />;
      })}
    </ul>
  );
}

function HeadingText(props: Props) {
  const filteredUsers = useFilteredUsers(props.users);
  const siteCountPlural = useSiteCountPlural();
  return (
    <div className={styles.headingText}>
      <Heading as="h2">
        <Translate id="showcase.filters.title">Filters</Translate>
      </Heading>
      <span>{siteCountPlural(filteredUsers.length)}</span>
    </div>
  );
}

function HeadingButtons() {
  return (
    <div className={styles.headingButtons} style={{alignItems: 'center'}}>
      <OperatorButton />
      <ClearAllButton />
    </div>
  );
}

function HeadingRow(props: Props) {
  return (
    <div className={clsx('margin-bottom--sm', styles.headingRow)}>
      <HeadingText users={props.users} />
      <HeadingButtons />
    </div>
  );
}

export default function ShowcaseFilters(props: Props): ReactNode {
  return (
    <section className="container margin-top--l margin-bottom--lg">
      <HeadingRow users={props.users} />
      <ShowcaseTagList />
    </section>
  );
}
