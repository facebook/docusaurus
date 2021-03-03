/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import styles from './styles.module.css';

const TAGS = [
  'highlight',
  'design',
  'i18n',
  'versioning',
  'multi-instance',
  'large',
  'facebook',
  'personal',
  'rtl',
];

function ToggleTags(props) {
  return (
    <div>
      {TAGS.map((tag) => (
        <div className={styles.tag} key={tag}>
          <input type="checkbox" id={tag} name={tag} />
          <label htmlFor={tag}>{tag}</label>
        </div>
      ))}
    </div>
  );
}

export default ToggleTags;
