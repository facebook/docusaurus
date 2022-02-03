/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import fs from 'fs-extra';
import {execSync} from 'child_process';
import prompts, {type Choice} from 'prompts';
import path from 'path';
import shell from 'shelljs';
import {kebabCase, sortBy} from 'lodash';
import supportsColor from 'supports-color';

const RecommendedTemplate = 'classic';
const TypeScriptTemplateSuffix = '-typescript';

function hasYarn() {
  try {
    execSync('yarnpkg --version', {stdio: 'ignore'});
    return true;
  } catch (e) {
    return false;
  }
}

function isValidGitRepoUrl(gitRepoUrl: string) {
  return ['https://', 'git@'].some((item) => gitRepoUrl.startsWith(item));
}

async function updatePkg(pkgPath: string, obj: Record<string, unknown>) {
  const content = await fs.readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(content);
  const newPkg = Object.assign(pkg, obj);

  await fs.outputFile(pkgPath, `${JSON.stringify(newPkg, null, 2)}\n`);
}

function readTemplates(templatesDir: string) {
  const templates = fs
    .readdirSync(templatesDir)
    .filter(
      (d) =>
        !d.startsWith('.') &&
        !d.startsWith('README') &&
        !d.endsWith(TypeScriptTemplateSuffix) &&
        d !== 'shared',
    );

  // Classic should be first in list!
  return sortBy(templates, (t) => t !== RecommendedTemplate);
}

function createTemplateChoices(templates: string[]) {
  function makeNameAndValueChoice(value: string): Choice {
    const title =
      value === RecommendedTemplate ? `${value} (recommended)` : value;
    return {title, value};
  }

  return [
    ...templates.map((template) => makeNameAndValueChoice(template)),
    makeNameAndValueChoice('Git repository'),
    makeNameAndValueChoice('Local template'),
  ];
}

function getTypeScriptBaseTemplate(template: string): string | undefined {
  if (template.endsWith(TypeScriptTemplateSuffix)) {
    return template.replace(TypeScriptTemplateSuffix, '');
  }
  return undefined;
}

async function copyTemplate(
  templatesDir: string,
  template: string,
  dest: string,
) {
  await fs.copy(path.resolve(templatesDir, 'shared'), dest);

  // TypeScript variants will copy duplicate resources like CSS & config from
  // base template
  const tsBaseTemplate = getTypeScriptBaseTemplate(template);
  if (tsBaseTemplate) {
    const tsBaseTemplatePath = path.resolve(templatesDir, tsBaseTemplate);
    await fs.copy(tsBaseTemplatePath, dest, {
      filter: (filePath) =>
        fs.statSync(filePath).isDirectory() ||
        path.extname(filePath) === '.css' ||
        path.basename(filePath) === 'docusaurus.config.js',
    });
  }

  await fs.copy(path.resolve(templatesDir, template), dest, {
    // Symlinks don't exist in published NPM packages anymore, so this is only
    // to prevent errors during local testing
    filter: (filePath) => !fs.lstatSync(filePath).isSymbolicLink(),
  });
}

export default async function init(
  rootDir: string,
  siteName?: string,
  reqTemplate?: string,
  cliOptions: Partial<{
    useNpm: boolean;
    skipInstall: boolean;
    typescript: boolean;
  }> = {},
): Promise<void> {
  const useYarn = cliOptions.useNpm ? false : hasYarn();
  const templatesDir = path.resolve(__dirname, '../templates');
  const templates = readTemplates(templatesDir);
  const hasTS = (templateName: string) =>
    fs.pathExistsSync(
      path.resolve(templatesDir, `${templateName}${TypeScriptTemplateSuffix}`),
    );

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
    logger.error('A website name is required.');
    process.exit(1);
  }

  const dest = path.resolve(rootDir, name);
  if (fs.existsSync(dest)) {
    logger.error`Directory already exists at path=${dest}!`;
    process.exit(1);
  }

  let template = reqTemplate;
  let useTS = cliOptions.typescript;
  // Prompt if template is not provided from CLI.
  if (!template) {
    const templatePrompt = await prompts({
      type: 'select',
      name: 'template',
      message: 'Select a template below...',
      choices: createTemplateChoices(templates),
    });
    template = templatePrompt.template;
    if (template && !useTS && hasTS(template)) {
      const tsPrompt = await prompts({
        type: 'confirm',
        name: 'useTS',
        message:
          'This template is available in TypeScript. Do you want to use the TS variant?',
        initial: false,
      });
      useTS = tsPrompt.useTS;
    }
  }

  // If user choose Git repository, we'll prompt for the url.
  if (template === 'Git repository') {
    const repoPrompt = await prompts({
      type: 'text',
      name: 'gitRepoUrl',
      validate: (url?: string) => {
        if (url && isValidGitRepoUrl(url)) {
          return true;
        }
        return logger.red('Invalid repository URL');
      },
      message: logger.interpolate`Enter a repository URL from GitHub, Bitbucket, GitLab, or any other public repo.
(e.g: path=${'https://github.com/ownerName/repoName.git'})`,
    });
    template = repoPrompt.gitRepoUrl;
  } else if (template === 'Local template') {
    const dirPrompt = await prompts({
      type: 'text',
      name: 'templateDir',
      validate: (dir?: string) => {
        if (dir) {
          const fullDir = path.resolve(process.cwd(), dir);
          if (fs.existsSync(fullDir)) {
            return true;
          }
          return logger.red(
            logger.interpolate`path=${fullDir} does not exist.`,
          );
        }
        return logger.red('Please enter a valid path.');
      },
      message:
        'Enter a local folder path, relative to the current working directory.',
    });
    template = dirPrompt.templateDir;
  }

  if (!template) {
    logger.error('Template should not be empty');
    process.exit(1);
  }

  logger.info('Creating new Docusaurus project...');

  if (isValidGitRepoUrl(template)) {
    logger.info`Cloning Git template path=${template}...`;
    if (
      shell.exec(`git clone --recursive ${template} ${dest}`, {silent: true})
        .code !== 0
    ) {
      logger.error`Cloning Git template name=${template} failed!`;
      process.exit(1);
    }
  } else if (templates.includes(template)) {
    // Docusaurus templates.
    if (useTS) {
      if (!hasTS(template)) {
        logger.error`Template name=${template} doesn't provide the Typescript variant.`;
        process.exit(1);
      }
      template = `${template}${TypeScriptTemplateSuffix}`;
    }
    try {
      await copyTemplate(templatesDir, template, dest);
    } catch (err) {
      logger.error`Copying Docusaurus template name=${template} failed!`;
      throw err;
    }
  } else if (fs.existsSync(path.resolve(process.cwd(), template))) {
    const templateDir = path.resolve(process.cwd(), template);
    try {
      await fs.copy(templateDir, dest);
    } catch (err) {
      logger.error`Copying local template path=${templateDir} failed!`;
      throw err;
    }
  } else {
    logger.error('Invalid template.');
    process.exit(1);
  }

  // Update package.json info.
  try {
    await updatePkg(path.join(dest, 'package.json'), {
      name: kebabCase(name),
      version: '0.0.0',
      private: true,
    });
  } catch (err) {
    logger.error('Failed to update package.json.');
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
  // Display the most elegant way to cd.
  const cdpath = path.relative('.', dest);
  if (!cliOptions.skipInstall) {
    shell.cd(dest);
    logger.info`Installing dependencies with name=${pkgManager}...`;
    if (
      shell.exec(useYarn ? 'yarn' : 'npm install --color always', {
        env: {
          ...process.env,
          // Force coloring the output, since the command is invoked by shelljs,
          // which is not the interactive shell
          ...(supportsColor.stdout ? {FORCE_COLOR: '1'} : {}),
        },
      }).code !== 0
    ) {
      logger.error('Dependency installation failed.');
      logger.info`The site directory has already been created, and you can retry by typing:

  code=${`cd ${cdpath}`}
  code=${`${pkgManager} install`}`;
      process.exit(0);
    }
  }

  logger.success`Created path=${cdpath}.`;
  logger.info`Inside that directory, you can run several commands:

  code=${`${pkgManager} start`}
    Starts the development server.

  code=${`${pkgManager} ${useYarn ? '' : 'run '}build`}
    Bundles your website into static files for production.

  code=${`${pkgManager} ${useYarn ? '' : 'run '}serve`}
    Serves the built website locally.

  code=${`${pkgManager} deploy`}
    Publishes the website to GitHub pages.

We recommend that you begin by typing:

  code=${`cd ${cdpath}`}
  code=${`${pkgManager} start`}

Happy building awesome websites!
`;
}
