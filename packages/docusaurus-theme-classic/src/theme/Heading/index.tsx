/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */

import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {HeadingType, Props} from '@theme/Heading';

import './styles.css';
import styles from './styles.module.css';

const Heading = (Tag: HeadingType): ((props: Props) => JSX.Element) =>
  function TargetComponent({id, ...props}) {
    const {
      hideOnScroll = false,
    } = useDocusaurusContext().siteConfig.themeConfig.navbar;

    if (!id) {
      return <Tag {...props} />;
    }

    return (
      <Tag {...props}>
        <a
          aria-hidden="true"
          tabIndex={-1}
          className={clsx('anchor', {
            [styles.enhancedAnchor]: !hideOnScroll,
          })}
          id={id}
        />
        {props.children}
        <a
          aria-hidden="true"
          tabIndex={-1}
          className="hash-link"
          href={`#${id}`}
          title="Direct link to heading">
          #
        </a>
      </Tag>
    );
  };

export default Heading;
