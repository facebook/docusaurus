import React from 'react';
import Layout from '@theme/Layout';

export default class Docs extends React.Component {
  render() {
    return <Layout>{this.props.children}</Layout>;
  }
}
