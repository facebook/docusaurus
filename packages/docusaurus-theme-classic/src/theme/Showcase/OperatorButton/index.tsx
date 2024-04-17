/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useId} from 'react';
import clsx from 'clsx';
import {useOperator} from '@docusaurus/plugin-content-showcase/client';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

export default function OperatorButton(): JSX.Element {
  const id = useId();
  const [operator, toggleOperator] = useOperator();
  return (
    <>
      <input
        id={id}
        type="checkbox"
        className="screen-reader-only"
        aria-label="Toggle between or and and for the tags you selected"
        checked={operator === 'AND'}
        onChange={toggleOperator}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            toggleOperator();
          }
        }}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={id} className={clsx(styles.checkboxLabel, 'shadow--md')}>
        <span className={styles.checkboxLabelOr}>
          <Translate
            id="theme.Showcase.OrOperatorButton.label"
            description="The label for the OR operator button">
            OR
          </Translate>
        </span>
        <span className={styles.checkboxLabelAnd}>
          <Translate
            id="theme.Showcase.AndOperatorButton.label"
            description="The label for the AND operator button">
            AND
          </Translate>
        </span>
      </label>
    </>
  );
}
