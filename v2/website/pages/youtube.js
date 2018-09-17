import React from 'react';
import Helmet from 'react-helmet';
import YouTube from 'react-youtube';
import Layout from '@theme/Layout';

export default class Player extends React.Component {
  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 1,
      },
    };

    return (
      <Layout {...this.props}>
        <Helmet>
          <title>My Youtube</title>
        </Helmet>
        <p align="center">
          {/* this is a React-youtube component */}
          <YouTube videoId="d9IxdwEFk1c" opts={opts} onReady={this._onReady} />
        </p>
      </Layout>
    );
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.playVideo();
  }
}
