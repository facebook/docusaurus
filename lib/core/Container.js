/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require('react');
const classNames = require('classnames');

class Container extends React.Component {
  render() {
    const containerClasses = classNames('container', this.props.className, {
      'darkBackground': this.props.background === 'dark',
      'highlightBackground': this.props.background === 'highlight',
      'lightBackground': this.props.background === 'light',
      'paddingAll': this.props.padding.indexOf('all') >= 0,
      'paddingBottom': this.props.padding.indexOf('bottom') >= 0,
      'paddingLeft': this.props.padding.indexOf('left') >= 0,
      'paddingRight': this.props.padding.indexOf('right') >= 0,
      'paddingTop': this.props.padding.indexOf('top') >= 0,
    });
    let wrappedChildren;

    if (this.props.wrapper) {
      wrappedChildren =
        <div className="wrapper">{this.props.children}</div>;
    } else {
      wrappedChildren = this.props.children;
    }
    return (
      <div className={containerClasses} id={this.props.id}>
        {wrappedChildren}
      </div>
    );
  }
}

Container.defaultProps = {
  background: 'transparent',
  padding: [],
  wrapper: true,
};

module.exports = Container;
