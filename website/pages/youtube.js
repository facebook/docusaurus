/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable */
import React from 'react';
import Head from '@docusaurus/Head';
import YouTube from 'react-youtube';

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
      <div>
        <Head>
          <title>My Youtube</title>
        </Head>
        <div className="container margin-vert-xl text-center">
          {/* this is a React-youtube component */}
          <YouTube videoId="d9IxdwEFk1c" opts={opts} onReady={this._onReady} />
        </div>
      </div>
    );
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.playVideo();
  }
}
