/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import colorette from 'colorette';
import fs from 'fs-extra';
import {execSync} from 'child_process';
import prompts, {Choice} from 'prompts';
import path from 'path';
import shell from 'shelljs';
import {kebabCase} from 'lodash';
import type {CliOptions} from './types/index';

function hasYarn(): boolean {
  try {
    execSync('yarnpkg --version', {stdio: 'ignore'});
    return true;
  } catch (e) {
    return false;
  }
}

function isValidGitRepoUrl(gitRepoUrl?: string): boolean {
  return /^((https|git):\/\/)|(git@)/g.test(gitRepoUrl ?? '');
}

async function updatePkg(
  pkgPath: string,
  obj: Record<string, unknown>,
): Promise<void> {
  const content = await fs.readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(content);
  const newPkg = Object.assign(pkg, obj);

  await fs.outputFile(pkgPath, JSON.stringify(newPkg, null, 2));
}

export default async function init(
  rootDir: string,
  siteName?: string,
  reqTemplate?: string,
  cliOptions: CliOptions = {},
): Promise<void> {
  const useYarn = !cliOptions.useNpm && hasYarn();
  const templatesDir = path.resolve(__dirname, '../templates');
  const templates = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const entry of await fs.opendir(templatesDir)) {
    if (entry.isDirectory()) {
      templates.push(entry.name);
    }
  }

  function makeChoice(value: string): Choice {
    return {title: value, value} as Choice;
  }

  let name = siteName;

  // Prompt if siteName is not passed from CLI.
  if (!name) {
    const prompt = await prompts({
      type: 'text',
      name: 'name',
      message: 'What should we name this site?',
      initial: 'website',
    });
    name = prompt.name;
  }

  if (!name) {
    throw new Error(colorette.red('A site name is required'));
  }

  const dest = path.resolve(rootDir, name);
  if (fs.existsSync(dest)) {
    throw new Error(`Directory already exists at ${dest}!`);
  }

  let template = reqTemplate;
  // Prompt if template is not provided from CLI.
  if (!template) {
    const templatePrompt = await prompts({
      type: 'select',
      name: 'template',
      message: 'Select a template below...',
      choices: [
        ...templates.map((templateDir) => makeChoice(templateDir)),
        makeChoice('Git repository'),
      ],
    });
    template = templatePrompt.template as string;
  }

  // If user choose Git repository, we'll prompt for the url.
  if (template === 'Git repository') {
    const repoPrompt = await prompts({
      type: 'text',
      name: 'gitRepoUrl',
      validate: (url?: string) => {
        if (isValidGitRepoUrl(url)) {
          return true;
        }
        return colorette.red(`Invalid repository URL`);
      },
      message:
        'Enter a repository URL from GitHub, BitBucket, GitLab, or any other public repo.\n(e.g: https://github.com/owner/repo.git)',
    });
    template = repoPrompt.gitRepoUrl as string;
  }

  console.log(`\n${colorette.cyan('Creating new Docusaurus project ...')}\n`);

  if (isValidGitRepoUrl(template)) {
    console.log(`Cloning Git template: ${colorette.cyan(template)}`);
    if (
      shell.exec(`git clone --recursive ${template} ${dest}`, {silent: true})
        .code !== 0
    ) {
      throw new Error(
        colorette.red(`Cloning Git template: ${template} failed!`),
      );
    }
  } else if (templates?.includes(template)) {
    // Docusaurus templates.
    try {
      await fs.copy(path.resolve(templatesDir, template), dest);
    } catch (err) {
      console.log(
        `Copying Docusaurus template: ${colorette.cyan(template)} failed!`,
      );
      throw err;
    }
  } else {
    throw new Error('Invalid template');
  }

  // Update package.json info.
  try {
    await updatePkg(path.join(dest, 'package.json'), {
      name: kebabCase(name),
      version: '0.0.0',
      private: true,
    });
  } catch (err) {
    console.log(colorette.red('Failed to update package.json'));
    throw err;
  }

  // We need to rename the gitignore file to .gitignore
  if (
    !fs.pathExistsSync(path.join(dest, '.gitignore')) &&
    fs.pathExistsSync(path.join(dest, 'gitignore'))
  ) {
    await fs.move(path.join(dest, 'gitignore'), path.join(dest, '.gitignore'));
  }
  if (fs.pathExistsSync(path.join(dest, 'gitignore'))) {
    fs.removeSync(path.join(dest, 'gitignore'));
  }

  const pkgManager = useYarn ? 'yarn' : 'npm';
  if (!cliOptions.skipInstall) {
    console.log(`Installing dependencies with: ${colorette.cyan(pkgManager)}`);

    try {
      shell.exec(`cd "${name}" && ${useYarn ? 'yarn' : 'npm install'}`);
    } catch (err) {
      console.log(colorette.red('Installation failed'));
      throw err;
    }
  }
  // Display the most elegant way to cd.
  const cdpath =
    path.join(process.cwd(), name) === dest
      ? name
      : path.relative(process.cwd(), name);

  console.log(`\n\nSuccess! Created ${colorette.cyan(cdpath)}`);
  console.log('Inside that directory, you can run several commands:\n');
  console.log(`  ${colorette.cyan(`${pkgManager} start`)}`);
  console.log('    Starts the development server.\n');
  console.log(
    `  ${colorette.cyan(`${pkgManager} ${!useYarn && 'run '}build`)}`,
  );
  console.log('    Bundles the app into static files for production.');
  console.log(`  ${colorette.cyan(`${pkgManager} deploy`)}`);
  console.log('    Publish website to GitHub pages.\n');
  console.log('We suggest that you begin by typing:\n');
  console.log(`  ${colorette.cyan('cd')} ${cdpath}`);
  console.log(`  ${colorette.cyan(`${pkgManager} start`)}\n`);
  console.log('Happy hacking!');
}
