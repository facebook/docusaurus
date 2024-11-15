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
  //  new versions make it easier to intercept logs
  //  see https://github.com/tj/commander.js#override-exit-and-output-handling
  let stdout = '';
  let stderr = '';
  jest.spyOn(console, 'log').mockImplementation((msg: string) => {
    stdout += msg;
  });
  // @ts-expect-error: only used with strings
  jest.spyOn(process.stdout, 'write').mockImplementation((msg: string) => {
    stdout += String(msg);
  });
  jest.spyOn(console, 'error').mockImplementation((msg: string) => {
    stderr += msg;
  });

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
    await cli.parseAsync(cliArgs);
  } catch (e) {
    if (e !== ExitOverrideError) {
      throw e;
    }
  }

  jest.restoreAllMocks();

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
            "stderr": "",
            "stdout": "Usage: docusaurus <command> [options]

          Options:
            -V, --version                                            output the version number
            -h, --help                                               display help for command

          Commands:
            build [options] [siteDir]                                Build website.
            swizzle [options] [themeName] [componentName] [siteDir]  Wraps or ejects the original theme files into website folder for customization.
            deploy [options] [siteDir]                               Deploy website to GitHub pages.
            start [options] [siteDir]                                Start the development server.
            serve [options] [siteDir]                                Serve website locally.
            clear [siteDir]                                          Remove build artifacts.
            write-translations [options] [siteDir]                   Extract required translations of your site.
            write-heading-ids [options] [siteDir] [files...]         Generate heading ids in Markdown content.
            cliPlugin:test [options]                                 Run test cli command
          ",
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
            "stderr": "",
            "stdout": "Usage: docusaurus <command> [options]

          Options:
            -V, --version                                            output the version number
            -h, --help                                               display help for command

          Commands:
            build [options] [siteDir]                                Build website.
            swizzle [options] [themeName] [componentName] [siteDir]  Wraps or ejects the original theme files into website folder for customization.
            deploy [options] [siteDir]                               Deploy website to GitHub pages.
            start [options] [siteDir]                                Start the development server.
            serve [options] [siteDir]                                Serve website locally.
            clear [siteDir]                                          Remove build artifacts.
            write-translations [options] [siteDir]                   Extract required translations of your site.
            write-heading-ids [options] [siteDir] [files...]         Generate heading ids in Markdown content.
            cliPlugin:test [options]                                 Run test cli command
          ",
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
            "stderr": "",
            "stdout": "<CURRENT_VERSION>
          ",
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
            "stderr": "",
            "stdout": "<CURRENT_VERSION>
          ",
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
            "stderr": "error: unknown option '--unknown'",
            "stdout": "",
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
          "stderr": "",
          "stdout": "TEST ACTION
        ",
        }
      `);
    });

    it('docusaurus cliPlugin:test --test-option', async () => {
      const result = await testCommand(['cliPlugin:test', '--test-option']);
      expect(result).toMatchInlineSnapshot(`
        {
          "exit": undefined,
          "stderr": "",
          "stdout": "TEST ACTION
        ",
        }
      `);
    });
  });
});
