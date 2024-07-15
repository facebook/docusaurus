/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Link, {type Props as LinkProps} from '@docusaurus/Link';
import type {Props} from '@theme/Author';

import styles from './styles.module.css';

function MaybeLink(props: LinkProps): JSX.Element {
  if (props.href) {
    return <Link {...props} />;
  }
  return <>{props.children}</>;
}

export default function Author({
  author: {page, name, count, title, imageURL},
}: Props): JSX.Element {
  const permalink = page?.permalink;
  return (
    <div className={clsx('avatar margin-bottom--sm')}>
      {imageURL && (
        <MaybeLink href={permalink} className="avatar__photo-link">
          <img className="avatar__photo" src={imageURL} alt={name} />
        </MaybeLink>
      )}

      {name && (
        <div className="avatar__intro">
          <div className="avatar__name">
            <MaybeLink href={permalink}>
              <span>{name}</span>
            </MaybeLink>
            <span className={clsx(styles.count)}>{count}</span>
          </div>
          <small className="avatar__subtitle">{title}</small>
        </div>
      )}
    </div>
  );
}
