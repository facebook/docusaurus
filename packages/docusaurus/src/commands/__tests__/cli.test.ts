/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {Command, type CommanderStatic} from 'commander';
import {createCLIProgram} from '../cli';

const ExitOverrideError = new Error('exitOverride');

async function testCommand(args: string[]) {
  const cliArgs: [string, string, ...string[]] = [
    'node',
    'docusaurus',
    ...args,
  ];
  const siteDir = path.resolve(__dirname, '__fixtures__', 'site');

  // TODO Docusaurus v4: upgrade Commander
  //  unfortunately we can't assert console output because current (v5) doesn't
  //  let us do so easily
  //  see https://github.com/tj/commander.js#override-exit-and-output-handling
  const stdout = 'todo';
  const stderr = 'todo';

  const cli = await createCLIProgram({
    cli: new Command() as CommanderStatic,
    cliArgs,
    siteDir,
    config: undefined,
  });

  let exit: undefined | {code: string; exitCode: number};
  cli.exitOverride((err) => {
    exit = {code: err.code, exitCode: err.exitCode};
    // If you don't throw here, commander will still exit :/
    throw ExitOverrideError;
  });

  try {
    cli.parse(cliArgs);
  } catch (e) {
    if (e !== ExitOverrideError) {
      throw e;
    }
  }

  return {
    exit,
    stdout,
    stderr,
  };
}

describe('CLI', () => {
  describe('general', () => {
    describe('help', () => {
      it('docusaurus --help', async () => {
        const result = await testCommand(['--help']);

        expect(result).toMatchInlineSnapshot(`
                {
                  "exit": {
                    "code": "commander.helpDisplayed",
                    "exitCode": 0,
                  },
                  "stderr": "todo",
                  "stdout": "todo",
                }
            `);
      });

      it('docusaurus -h', async () => {
        const result = await testCommand(['-h']);

        expect(result).toMatchInlineSnapshot(`
                {
                  "exit": {
                    "code": "commander.helpDisplayed",
                    "exitCode": 0,
                  },
                  "stderr": "todo",
                  "stdout": "todo",
                }
            `);
      });
    });

    describe('version', () => {
      it('docusaurus --version', async () => {
        const result = await testCommand(['--version']);

        expect(result).toMatchInlineSnapshot(`
          {
            "exit": {
              "code": "commander.version",
              "exitCode": 0,
            },
            "stderr": "todo",
            "stdout": "todo",
          }
        `);
      });

      it('docusaurus -V', async () => {
        const result = await testCommand(['-V']);

        expect(result).toMatchInlineSnapshot(`
          {
            "exit": {
              "code": "commander.version",
              "exitCode": 0,
            },
            "stderr": "todo",
            "stdout": "todo",
          }
        `);
      });
    });

    describe('errors', () => {
      it('docusaurus', async () => {
        await expect(
          testCommand(['']),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"Missing Docusaurus CLI command."`,
        );
      });

      it('docusaurus unknown', async () => {
        await expect(
          testCommand(['unknown']),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"Unknown Docusaurus CLI command \`unknown\`"`,
        );
      });

      it('docusaurus --unknown', async () => {
        const result = await testCommand(['--unknown']);
        expect(result).toMatchInlineSnapshot(`
          {
            "exit": {
              "code": "commander.unknownOption",
              "exitCode": 1,
            },
            "stderr": "todo",
            "stdout": "todo",
          }
        `);
      });
    });
  });

  describe('extendCLI', () => {
    it('docusaurus cliPlugin:test', async () => {
      const result = await testCommand(['cliPlugin:test']);
      expect(result).toMatchInlineSnapshot(`
        {
          "exit": undefined,
          "stderr": "todo",
          "stdout": "todo",
        }
      `);
    });

    it('docusaurus cliPlugin:test --test-option', async () => {
      const result = await testCommand(['cliPlugin:test', '--test-option']);
      expect(result).toMatchInlineSnapshot(`
        {
          "exit": undefined,
          "stderr": "todo",
          "stdout": "todo",
        }
      `);
    });
  });
});
