/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import './styles.css';

export default ({checked, onChange}) => (
  <label
    htmlFor="dark-mode"
    className="dark-mode"
    aria-label="Toggle light / dark mode.">
    <input
      type="checkbox"
      checked={checked}
      id="dark-mode"
      onChange={onChange}
    />
    <span className="sun" role="img" aria-label="light-mode">
      🌞
    </span>
    <span className="moon" role="img" aria-label="dark-mode">
      🌛
    </span>
  </label>
);
