/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const tcpPortUsed = require('tcp-port-used');
const findUnusedPort = require('../findUnusedPort.js');

jest.mock('tcp-port-used');

describe('find unused port', () => {
  test('when initial port is unused, returns initial port', () => {
    expect.assertions(1);
    const initialPort = 12345;
    const portInUse = false;
    tcpPortUsed.check.mockResolvedValue(portInUse);

    return expect(findUnusedPort(initialPort)).resolves.toBe(initialPort);
  });

  test('when initial port is used, checks the next port', () => {
    expect.assertions(1);
    const initialPort = 12345;
    tcpPortUsed.check.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

    const expectedPort = initialPort + 1;
    return expect(findUnusedPort(initialPort)).resolves.toBe(expectedPort);
  });

  test('when the first two ports are used, checks the third in sequence', () => {
    expect.assertions(1);
    const initialPort = 12345;
    tcpPortUsed.check
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    const expectedPort = initialPort + 2;
    return expect(findUnusedPort(initialPort)).resolves.toBe(expectedPort);
  });

  test('when the first 9 ports are in use, checks the tenth in sequence', () => {
    expect.assertions(1);
    const initialPort = 12345;
    tcpPortUsed.check
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    const expectedPort = initialPort + 9;
    return expect(findUnusedPort(initialPort)).resolves.toBe(expectedPort);
  });

  test('when 10 subsequent ports are in use, returns error', () => {
    expect.assertions(1);
    const initialPort = 12345;
    tcpPortUsed.check
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);

    const expectedError = new Error(
      'cannot find unused port: max attempts exceeded'
    );
    return expect(findUnusedPort(initialPort)).rejects.toEqual(expectedError);
  });
});
