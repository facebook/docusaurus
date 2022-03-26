/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import fs from 'fs-extra';
import prompts, {type Choice} from 'prompts';
import path from 'path';
import shell from 'shelljs';
import _ from 'lodash';
import supportsColor from 'supports-color';
import {fileURLToPath} from 'url';

const RecommendedTemplate = 'classic';
const TypeScriptTemplateSuffix = '-typescript';

// Only used in the rare, rare case of running globally installed create +
// using --skip-install. We need a default name to show the tip text
const DefaultPackageManager = 'npm';

const SupportedPackageManagers = {
  npm: 'package-lock.json',
  yarn: 'yarn.lock',
  pnpm: 'pnpm-lock.yaml',
};

type SupportedPackageManager = keyof typeof SupportedPackageManagers;

const PackageManagersList = Object.keys(
  SupportedPackageManagers,
) as SupportedPackageManager[];

async function findPackageManagerFromLockFile(): Promise<
  SupportedPackageManager | undefined
> {
  for (const packageManager of PackageManagersList) {
    const lockFilePath = path.resolve(SupportedPackageManagers[packageManager]);
    if (await fs.pathExists(lockFilePath)) {
      return packageManager;
    }
  }
  return undefined;
}

function findPackageManagerFromUserAgent():
  | SupportedPackageManager
  | undefined {
  return PackageManagersList.find((packageManager) =>
    process.env.npm_config_user_agent?.startsWith(packageManager),
  );
}

async function askForPackageManagerChoice(): Promise<SupportedPackageManager> {
  const hasYarn = shell.exec('yarn --version', {silent: true}).code === 0;
  const hasPNPM = shell.exec('pnpm --version', {silent: true}).code === 0;

  if (!hasYarn && !hasPNPM) {
    return 'npm';
  }
  const choices = ['npm', hasYarn && 'yarn', hasPNPM && 'pnpm']
    .filter((p): p is string => Boolean(p))
    .map((p) => ({title: p, value: p}));

  return (
    await prompts({
      type: 'select',
      name: 'packageManager',
      message: 'Select a package manager...',
      choices,
    })
  ).packageManager;
}

async function getPackageManager(
  packageManagerChoice: SupportedPackageManager | undefined,
  skipInstall: boolean = false,
): Promise<SupportedPackageManager> {
  if (
    packageManagerChoice &&
    !PackageManagersList.includes(packageManagerChoice)
  ) {
    throw new Error(
      `Invalid package manager choice ${packageManagerChoice}. Must be one of ${PackageManagersList.join(
        ', ',
      )}`,
    );
  }

  return (
    packageManagerChoice ??
    (await findPackageManagerFromLockFile()) ??
    findPackageManagerFromUserAgent() ??
    // This only happens if the user has a global installation in PATH
    (skipInstall ? DefaultPackageManager : askForPackageManagerChoice())
  );
}

function isValidGitRepoUrl(gitRepoUrl: string) {
  return ['https://', 'git@'].some((item) => gitRepoUrl.startsWith(item));
}

async function updatePkg(pkgPath: string, obj: {[key: string]: unknown}) {
  const content = await fs.readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(content);
  const newPkg = Object.assign(pkg, obj);

  await fs.outputFile(pkgPath, `${JSON.stringify(newPkg, null, 2)}\n`);
}

async function readTemplates(templatesDir: string) {
  const templates = (await fs.readdir(templatesDir)).filter(
    (d) =>
      !d.startsWith('.') &&
      !d.startsWith('README') &&
      !d.endsWith(TypeScriptTemplateSuffix) &&
      d !== 'shared',
  );

  // Classic should be first in list!
  return _.sortBy(templates, (t) => t !== RecommendedTemplate);
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
  await fs.copy(path.join(templatesDir, 'shared'), dest);

  // TypeScript variants will copy duplicate resources like CSS & config from
  // base template
  const tsBaseTemplate = getTypeScriptBaseTemplate(template);
  if (tsBaseTemplate) {
    const tsBaseTemplatePath = path.resolve(templatesDir, tsBaseTemplate);
    await fs.copy(tsBaseTemplatePath, dest, {
      filter: async (filePath) =>
        (await fs.stat(filePath)).isDirectory() ||
        path.extname(filePath) === '.css' ||
        path.basename(filePath) === 'docusaurus.config.js',
    });
  }

  await fs.copy(path.resolve(templatesDir, template), dest, {
    // Symlinks don't exist in published NPM packages anymore, so this is only
    // to prevent errors during local testing
    filter: async (filePath) => !(await fs.lstat(filePath)).isSymbolicLink(),
  });
}

const gitStrategies = ['deep', 'shallow', 'copy', 'custom'] as const;

async function getGitCommand(gitStrategy: typeof gitStrategies[number]) {
  switch (gitStrategy) {
    case 'shallow':
    case 'copy':
      return 'git clone --recursive --depth 1';
    case 'custom': {
      const {command} = await prompts({
        type: 'text',
        name: 'command',
        message:
          'Write your own git clone command. The repository URL and destination directory will be supplied. E.g. "git clone --depth 10"',
      });
      return command;
    }
    case 'deep':
    default:
      return 'git clone';
  }
}

export default async function init(
  rootDir: string,
  siteName?: string,
  reqTemplate?: string,
  cliOptions: Partial<{
    packageManager: SupportedPackageManager;
    skipInstall: boolean;
    typescript: boolean;
    gitStrategy: typeof gitStrategies[number];
  }> = {},
): Promise<void> {
  const templatesDir = fileURLToPath(new URL('../templates', import.meta.url));
  const templates = await readTemplates(templatesDir);
  const hasTS = (templateName: string) =>
    fs.pathExists(
      path.join(templatesDir, `${templateName}${TypeScriptTemplateSuffix}`),
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
  if (await fs.pathExists(dest)) {
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
    if (template && !useTS && (await hasTS(template))) {
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

  let gitStrategy = cliOptions.gitStrategy ?? 'deep';

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
(e.g: url=${'https://github.com/ownerName/repoName.git'})`,
    });
    ({gitStrategy} = await prompts({
      type: 'select',
      name: 'gitStrategy',
      message: 'How should we clone this repo?',
      choices: [
        {title: 'Deep clone: preserve full history', value: 'deep'},
        {title: 'Shallow clone: clone with --depth=1', value: 'shallow'},
        {
          title: 'Copy: do a shallow clone, but do not create a git repo',
          value: 'copy',
        },
        {title: 'Custom: enter your custom git clone command', value: 'custom'},
      ],
    }));
    template = repoPrompt.gitRepoUrl;
  } else if (template === 'Local template') {
    const dirPrompt = await prompts({
      type: 'text',
      name: 'templateDir',
      validate: async (dir?: string) => {
        if (dir) {
          const fullDir = path.resolve(dir);
          if (await fs.pathExists(fullDir)) {
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
    logger.info`Cloning Git template url=${template}...`;
    if (!gitStrategies.includes(gitStrategy)) {
      logger.error`Invalid git strategy: name=${gitStrategy}. Value must be one of ${gitStrategies.join(
        ', ',
      )}.`;
      process.exit(1);
    }
    const command = await getGitCommand(gitStrategy);
    if (shell.exec(`${command} ${template} ${dest}`).code !== 0) {
      logger.error`Cloning Git template name=${template} failed!`;
      process.exit(1);
    }
    if (gitStrategy === 'copy') {
      await fs.remove(path.join(dest, '.git'));
    }
  } else if (templates.includes(template)) {
    // Docusaurus templates.
    if (useTS) {
      if (!(await hasTS(template))) {
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
  } else if (await fs.pathExists(path.resolve(template))) {
    const templateDir = path.resolve(template);
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
      name: _.kebabCase(name),
      version: '0.0.0',
      private: true,
    });
  } catch (err) {
    logger.error('Failed to update package.json.');
    throw err;
  }

  // We need to rename the gitignore file to .gitignore
  if (
    !(await fs.pathExists(path.join(dest, '.gitignore'))) &&
    (await fs.pathExists(path.join(dest, 'gitignore')))
  ) {
    await fs.move(path.join(dest, 'gitignore'), path.join(dest, '.gitignore'));
  }
  if (await fs.pathExists(path.join(dest, 'gitignore'))) {
    await fs.remove(path.join(dest, 'gitignore'));
  }

  // Display the most elegant way to cd.
  const cdpath = path.relative('.', dest);
  const pkgManager = await getPackageManager(
    cliOptions.packageManager,
    cliOptions.skipInstall,
  );
  if (!cliOptions.skipInstall) {
    shell.cd(dest);
    logger.info`Installing dependencies with name=${pkgManager}...`;
    if (
      shell.exec(
        pkgManager === 'yarn' ? 'yarn' : `${pkgManager} install --color always`,
        {
          env: {
            ...process.env,
            // Force coloring the output, since the command is invoked,
            // by shelljs which is not the interactive shell
            ...(supportsColor.stdout ? {FORCE_COLOR: '1'} : {}),
          },
        },
      ).code !== 0
    ) {
      logger.error('Dependency installation failed.');
      logger.info`The site directory has already been created, and you can retry by typing:

  code=${`cd ${cdpath}`}
  code=${`${pkgManager} install`}`;
      process.exit(0);
    }
  }

  const useNpm = pkgManager === 'npm';
  logger.success`Created name=${cdpath}.`;
  logger.info`Inside that directory, you can run several commands:

  code=${`${pkgManager} start`}
    Starts the development server.

  code=${`${pkgManager} ${useNpm ? 'run ' : ''}build`}
    Bundles your website into static files for production.

  code=${`${pkgManager} ${useNpm ? 'run ' : ''}serve`}
    Serves the built website locally.

  code=${`${pkgManager} deploy`}
    Publishes the website to GitHub pages.

We recommend that you begin by typing:

  code=${`cd ${cdpath}`}
  code=${`${pkgManager} start`}

Happy building awesome websites!
`;
}
