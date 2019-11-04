/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';

import classnames from 'classnames';

function Tabs(props) {
  const {block, children, defaultValue, values} = props;
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  return (
    <div>
      <ul
        className={classnames('tabs', {
          'tabs--block': block,
        })}>
        {values.map(({value, label}) => (
          <li
            className={classnames('tab-item', {
              'tab-item--active': selectedValue === value,
            })}
            key={value}
            onClick={() => setSelectedValue(value)}>
            {label}
          </li>
        ))}
      </ul>
      <div className="margin-vert--md">
        {
          Array.from(children).filter(
            child => child.props.value === selectedValue,
          )[0]
        }
      </div>
    </div>
  );
}

export default Tabs;
