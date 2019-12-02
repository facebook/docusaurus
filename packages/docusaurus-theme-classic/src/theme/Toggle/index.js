/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Toggle from 'react-toggle';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import './styles.css';

const Moon = () => <span className="toggle moon" />;
const Sun = () => <span className="toggle sun" />;

export default function(props) {
  const {isClient} = useDocusaurusContext();
  return (
    <Toggle
      disabled={!isClient}
      icons={{
        checked: <Moon />,
        unchecked: <Sun />,
      }}
      {...props}
    />
  );
}
