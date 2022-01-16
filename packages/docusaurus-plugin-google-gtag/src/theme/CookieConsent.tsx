/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import {createStorageSlot} from '@docusaurus/theme-common';

const storage = createStorageSlot('docusaurus.cookieConsent');

export default function CookieConsent(): JSX.Element {
  return (
    <div className={styles.banner}>
      <p className={styles.text}>
        This website uses Cookies to help the developers improve.
      </p>
      <div className={styles.buttons}>
        <button
          type="button"
          className={clsx('clean-btn', styles.button)}
          onClick={() => {
            storage.set('true');
          }}>
          Accept
        </button>
        <button
          type="button"
          className={clsx('clean-btn', styles.button)}
          onClick={() => {
            storage.set('true');
          }}>
          Deny
        </button>
      </div>
    </div>
  );
}
