/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const program = require('commander');
const openBrowser = require('react-dev-utils/openBrowser');
const findUnusedPort = require('../../findUnusedPort.js');
const liveReloadServer = require('../liveReloadServer.js');
const server = require('../server.js');

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

// When running Jest the siteConfig import fails because siteConfig doesn't exist
// relative to the cwd of the tests. Rather than mocking out cwd just mock
// siteConfig virtually.
jest.mock(`${process.cwd()}/siteConfig.js`, () => jest.fn(), {virtual: true});

jest.mock('commander');
jest.mock('react-dev-utils/openBrowser');
jest.mock('../../findUnusedPort.js');
jest.mock('../liveReloadServer.js');
jest.mock('../server.js');
jest.mock('process');

console.log = jest.fn();

const start = require('../start.js');

beforeEach(() => jest.resetAllMocks());

describe('start live reload', () => {
  test('uses inital port 35729', () => {
    findUnusedPort.mockResolvedValue();
    start.startLiveReloadServer();
    expect(findUnusedPort).toHaveBeenCalledWith(35729);
  });

  test('when an unused port is found, starts the live reload server on that port', () => {
    expect.assertions(1);
    const unusedPort = 1234;
    findUnusedPort.mockResolvedValue(unusedPort);
    return start.startLiveReloadServer().then(() => {
      expect(liveReloadServer.start).toHaveBeenCalledWith(unusedPort);
    });
  });

  test('when no unused port found, returns error', () => {
    expect.assertions(1);
    const unusedPortError = new Error('no unused port');
    findUnusedPort.mockRejectedValue(unusedPortError);
    return expect(start.startLiveReloadServer()).rejects.toEqual(
      unusedPortError
    );
  });
});

describe('start server', () => {
  test('when custom port provided as parameter, uses as inital port', () => {
    const customPort = 1234;
    program.port = customPort;
    findUnusedPort.mockResolvedValue();
    start.startServer();
    expect(findUnusedPort).toBeCalledWith(customPort);
    delete program.port;
  });

  test('when port environment variable set and no custom port, used as inital port', () => {
    const customPort = '4321';
    process.env.PORT = customPort;
    findUnusedPort.mockResolvedValue();
    start.startServer();
    expect(findUnusedPort).toBeCalledWith(customPort);
    delete process.env.PORT;
  });

  test('when no custom port specified, uses port 3000', () => {
    findUnusedPort.mockResolvedValue();
    start.startServer();
    expect(findUnusedPort).toBeCalledWith(3000);
  });

  test('when unused port found, starts server on that port', () => {
    expect.assertions(1);
    const port = 1357;
    findUnusedPort.mockResolvedValue(port);
    return start.startServer().then(() => {
      expect(server).toHaveBeenCalledWith(port);
    });
  });

  test('when unused port found, opens browser to server address', () => {
    expect.assertions(1);
    const baseUrl = '/base_url';
    siteConfig.baseUrl = baseUrl;
    const port = 2468;
    findUnusedPort.mockResolvedValue(port);
    const expectedServerAddress = `http://localhost:${port}${baseUrl}`;
    return start.startServer().then(() => {
      expect(openBrowser).toHaveBeenCalledWith(expectedServerAddress);
    });
  });
});

describe('start docusaurus', () => {
  test('when watch enabled, starts live reload server', () => {
    expect.assertions(1);
    program.watch = true;
    findUnusedPort.mockResolvedValue();
    return start.startDocusaurus().then(() => {
      expect(liveReloadServer.start).toBeCalled();
    });
  });

  test('when live reload fails to start, server still started', () => {
    expect.assertions(1);
    program.watch = true;
    console.warn = jest.fn();
    findUnusedPort
      .mockRejectedValueOnce('could not find live reload port')
      .mockResolvedValueOnce();
    return start.startDocusaurus().then(() => {
      expect(server).toBeCalled();
    });
  });

  test('live reload disabled, only starts docusarus server', () => {
    expect.assertions(2);
    program.watch = false;
    findUnusedPort.mockResolvedValue();
    return start.startDocusaurus().then(() => {
      expect(liveReloadServer.start).not.toBeCalled();
      expect(server).toBeCalled();
    });
  });
});
