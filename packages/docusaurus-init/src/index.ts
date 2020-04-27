/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chalk from 'chalk';
import fs from 'fs-extra';
import {execSync} from 'child_process';
import inquirer from 'inquirer';
import path from 'path';
import shell from 'shelljs';
import kebabCase from 'lodash.kebabcase';

function hasYarn(): boolean {
  try {
    execSync('yarnpkg --version', {stdio: 'ignore'});
    return true;
  } catch (e) {
    return false;
  }
}

function isValidGitRepoUrl(gitRepoUrl: string): boolean {
  return ['https://', 'git@'].some((item) => gitRepoUrl.startsWith(item));
}

async function updatePkg(pkgPath: string, obj: any): Promise<void> {
  const content = await fs.readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(content);
  const newPkg = Object.assign(pkg, obj);

  await fs.outputFile(pkgPath, JSON.stringify(newPkg, null, 2));
}

export default async function init(
  rootDir: string,
  siteName?: string,
  reqTemplate?: string,
): Promise<void> {
  const useYarn = hasYarn();
  const templatesDir = path.resolve(__dirname, '../templates');
  const templates = fs
    .readdirSync(templatesDir)
    .filter((d) => !d.startsWith('.') && !d.startsWith('README'));

  const gitChoice = 'Git repository';
  const templateChoices = [...templates, gitChoice];

  let name = siteName;

  // Prompt if siteName is not passed from CLI.
  if (!name) {
    const {name: promptedName} = await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: 'What should we name this site?',
      default: 'website',
    });
    name = promptedName;
  }

  if (!name) {
    throw new Error(chalk.red('A site name is required'));
  }

  const dest = path.resolve(rootDir, name);
  if (fs.existsSync(dest)) {
    throw new Error(`Directory already exists at ${dest} !`);
  }

  let template = reqTemplate;
  // Prompt if template is not provided from CLI.
  if (!template) {
    const {template: promptedTemplate} = await inquirer.prompt({
      type: 'list',
      name: 'template',
      message: 'Select a template below...',
      choices: templateChoices,
    });
    template = promptedTemplate;
  }

  // If user choose Git repository, we'll prompt for the url.
  if (template === gitChoice) {
    const {gitRepoUrl} = await inquirer.prompt({
      type: 'input',
      name: 'gitRepoUrl',
      validate: (url?: string) => {
        if (url && isValidGitRepoUrl(url)) {
          return true;
        }
        return chalk.red(`Invalid repository URL`);
      },
      message:
        'Enter a repository URL from GitHub, BitBucket, GitLab, or any other public repo. \n(e.g: https://github.com/ownerName/repoName.git)',
    });
    template = gitRepoUrl;
  }

  console.log();
  console.log(chalk.cyan('Creating new Docusaurus project ...'));
  console.log();

  if (template && isValidGitRepoUrl(template)) {
    console.log(`Cloning Git template: ${chalk.cyan(template)}`);
    if (
      shell.exec(`git clone --recursive ${template} ${dest}`, {silent: true})
        .code !== 0
    ) {
      throw new Error(chalk.red(`Cloning Git template: ${template} failed!`));
    }
  } else if (template && templates.includes(template)) {
    // Docusaurus templates.
    try {
      await fs.copy(path.resolve(templatesDir, template), dest);
    } catch (err) {
      console.log(
        `Copying Docusaurus template: ${chalk.cyan(template)} failed!`,
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
    console.log(chalk.red('Failed to update package.json'));
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

  console.log(`Installing dependencies with: ${chalk.cyan(pkgManager)}`);

  try {
    shell.exec(`cd "${name}" && ${useYarn ? 'yarn' : 'npm install'}`);
  } catch (err) {
    console.log(chalk.red('Installation failed'));
    throw err;
  }
  console.log();

  // Display the most elegant way to cd.
  const cdpath =
    path.join(process.cwd(), name) === dest
      ? name
      : path.relative(process.cwd(), name);

  console.log();
  console.log(`Success! Created ${chalk.cyan(cdpath)}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${pkgManager} start`));
  console.log('    Starts the development server.');
  console.log();
  console.log(chalk.cyan(`  ${pkgManager} ${useYarn ? '' : 'run '}build`));
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan(`  ${pkgManager} deploy`));
  console.log('    Publish website to GitHub pages.');
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(`  ${chalk.cyan(`${pkgManager} start`)}`);

  console.log();
  console.log('Happy hacking!');
}
