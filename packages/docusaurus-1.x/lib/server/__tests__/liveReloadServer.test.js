/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

jest.mock('gaze');
jest.mock('../readMetadata.js');
jest.mock('tiny-lr');

// When running Jest the siteConfig import fails because siteConfig doesn't exist
// relative to the cwd of the tests. Rather than mocking out cwd just mock
// siteConfig virtually.
jest.mock(`${process.cwd()}/siteConfig.js`, () => jest.fn(), {virtual: true});

const liveReloadServer = require('../liveReloadServer.js');

describe('get reload script', () => {
  test('when server started, returns url with correct port', () => {
    const port = 1234;
    liveReloadServer.start(port);
    const expectedUrl = `http://localhost:${port}/livereload.js`;
    expect(liveReloadServer.getReloadScriptUrl()).toBe(expectedUrl);
  });
});
