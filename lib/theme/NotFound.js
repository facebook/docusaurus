import React from 'react';
import Layout from '@theme/Layout';

export default class NotFound extends React.Component {
  render() {
    return (
      <Layout>
        <div>404 Page Not Found</div>
        <div>
          <img alt="Not found" src="https://i.imgur.com/yG7L3Lb.gif" />
        </div>
      </Layout>
    );
  }
}
