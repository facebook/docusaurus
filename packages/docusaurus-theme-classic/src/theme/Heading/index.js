/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */

import React from 'react';

import './styles.css';

const Heading = Tag => ({id, ...props}) => {
  if (!id) {
    return <Tag {...props} />;
  }
  return (
    <Tag {...props}>
      <a aria-hidden="true" tabIndex="-1" className="anchor" id={id} />
      <a aria-hidden="true" tabIndex="-1" className="hash-link" href={`#${id}`} title="Direct link to section">
        #
      </a>
      {props.children}
    </Tag>
  );
};

export default Heading;
