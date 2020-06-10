/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import clsx from 'clsx';

import styles from './styles.module.css';

export default function PwaReloadPopup({onRefresh}) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    isVisible && (
      <div className={clsx('alert', 'alert--secondary', styles.popup)}>
        {/* TODO: put in i18n */}
        <p>New version available</p>
        <div className={styles.buttonContainer}>
          <button
            className="button button--link"
            type="button"
            onClick={() => {
              setIsVisible(false);
              onRefresh();
            }}>
            {/* TODO: put in i18n */}
            Refresh
          </button>

          <button
            aria-label="Close"
            className="close"
            type="button"
            onClick={() => setIsVisible(false)}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    )
  );
}
