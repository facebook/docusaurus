/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Link, {type Props as LinkProps} from '@docusaurus/Link';
import type {Props} from '@theme/Blog/Components/Author/GeneratedImage';

function MaybeLink(props: LinkProps): JSX.Element {
  if (props.href) {
    return <Link {...props} />;
  }
  return <>{props.children}</>;
}

export default function GeneratedImage({
  name,
  link,
  className,
}: Props): JSX.Element {
  return (
    <MaybeLink href={link} className="avatar__photo-link">
      <svg
        className={clsx('avatar__photo', className)}
        viewBox="0 0 72 72"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="greyGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{stopColor: '#ccc', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#777', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        <circle cx="36" cy="36" r="36" fill="url(#greyGradient)" />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize="2rem"
          fill="#fff">
          {name[0]?.toLocaleUpperCase()}
        </text>
      </svg>
    </MaybeLink>
  );
}
