/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const renderMarkdown = require('./renderMarkdown.js');

class Remarkable extends React.Component {
  content() {
    if (this.props.source) {
      return (
        <span
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(this.props.source),
          }}
        />
      );
    }

    return React.Children.map(this.props.children, (child) => {
      if (typeof child === 'string') {
        return (
          <span dangerouslySetInnerHTML={{__html: renderMarkdown(child)}} />
        );
      }

      return child;
    });
  }

  render() {
    const Container = this.props.container;
    return <Container>{this.content()}</Container>;
  }
}

Remarkable.defaultProps = {
  container: 'div',
};

module.exports = Remarkable;
