/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it, vi} from 'vitest';
import {render} from '@inquirer/testing';
import {askInput, askSelect} from '../prompts';

// Throws like a real exit would stop the prompt function
function mockExit() {
  return vi.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`process.exit(${code})`);
  });
}

describe('askSelect', () => {
  const config = {
    message: 'Which language do you want to use?',
    choices: [
      {name: 'JavaScript', value: 'javascript'},
      {name: 'TypeScript', value: 'typescript'},
    ],
    answerHint: 'the --javascript or --typescript option',
  };

  it('returns the selected value', async () => {
    const {answer, events, getScreen} = await render(askSelect, config);

    events.keypress('down');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Which language do you want to use?
        JavaScript
      ❯ TypeScript

      ↑↓ navigate • ⏎ select"
    `);
    events.keypress('enter');

    await expect(answer).resolves.toBe('typescript');
  });

  it('exits with code 1 when the prompt is cancelled', async () => {
    using _exit = mockExit();
    using error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const {answer, events} = await render(askSelect, config);

    events.keypress({name: 'c', ctrl: true});

    await expect(answer).rejects.toThrow('process.exit(1)');

    expect(error.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "[ERROR] No answer to the prompt: Which language do you want to use?
      Answer it with the --javascript or --typescript option.",
        ],
      ]
    `);
  });
});

describe('askInput', () => {
  const config = {
    message: 'What should we name this site?',
    default: 'website',
    validate: async (siteName: string) =>
      siteName === 'existing-site' ? 'Directory already exists!' : true,
    answerHint: 'the [siteName] argument',
  };

  it('returns the default value', async () => {
    const {answer, events} = await render(askInput, config);

    events.keypress('enter');

    await expect(answer).resolves.toBe('website');
  });

  it('shows the validation error until the value is valid', async () => {
    const {answer, events, getScreen, nextRender} = await render(
      askInput,
      config,
    );

    events.type('existing-site');
    events.keypress('enter');
    await nextRender();
    expect(getScreen()).toMatchInlineSnapshot(`
      "? What should we name this site? existing-site
      > Directory already exists!"
    `);

    events.keypress({name: 'u', ctrl: true});
    events.type('new-site');
    events.keypress('enter');

    await expect(answer).resolves.toBe('new-site');
  });

  it('exits with code 1 when the prompt is cancelled', async () => {
    using _exit = mockExit();
    using error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const {answer, events} = await render(askInput, config);

    events.keypress({name: 'c', ctrl: true});

    await expect(answer).rejects.toThrow('process.exit(1)');

    expect(error.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "[ERROR] No answer to the prompt: What should we name this site?
      Answer it with the [siteName] argument.",
        ],
      ]
    `);
  });
});
