import React from 'react';

export default class Layout extends React.Component {
  render() {
    const {children} = this.props;
    return <div>{children}</div>;
  }
}
