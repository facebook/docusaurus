/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-extraneous-dependencies */

const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const {mapValues, pickBy, difference, orderBy} = require('lodash');

const LocalesDirPath = path.join(__dirname, 'locales');
const Themes = [
  {
    name: 'theme-common',
    src: [
      getPackageCodePath('docusaurus-theme-classic'),
      getPackageCodePath('docusaurus-theme-common'),
    ],
  },
  {
    name: 'theme-search-algolia',
    src: [getPackageCodePath('docusaurus-theme-search-algolia')],
  },
  {
    name: 'theme-live-codeblock',
    src: [getPackageCodePath('docusaurus-theme-live-codeblock')],
  },
  {
    name: 'plugin-pwa',
    src: [getPackageCodePath('docusaurus-plugin-pwa')],
  },
];
const AllThemesSrcDirs = Themes.flatMap((theme) => theme.src);

console.log('Will scan folders for code translations:', AllThemesSrcDirs);

function getPackageCodePath(packageName) {
  const packagePath = path.join(__dirname, '..', packageName);
  const packageJsonPath = path.join(packagePath, 'package.json');
  const {main} = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const packageSrcPath = path.join(packagePath, path.dirname(main));
  const packageLibNextPath = packageSrcPath.replace('lib', 'lib-next');
  return fs.existsSync(packageLibNextPath)
    ? packageLibNextPath
    : packageSrcPath;
}

function getThemeLocalePath(locale, themeName) {
  return path.join(LocalesDirPath, locale, `${themeName}.json`);
}

function removeDescriptionSuffix(key) {
  if (key.replace('___DESCRIPTION')) {
    return key.replace('___DESCRIPTION', '');
  }
  return key;
}

function sortObjectKeys(obj) {
  let keys = Object.keys(obj);
  keys = orderBy(keys, [(k) => removeDescriptionSuffix(k)]);
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {});
}

function logSection(title) {
  console.log(``);
  console.log(``);
  console.log(`##############################`);
  console.log(`## ${chalk.blue(title)}`);
}

function logKeys(keys) {
  return `Keys:\n- ${keys.join('\n- ')}`;
}

async function extractThemeCodeMessages(targetDirs = AllThemesSrcDirs) {
  // Unsafe import, should we create a package for the translationsExtractor ?
  const {
    globSourceCodeFilePaths,
    extractAllSourceCodeFileTranslations,
    // eslint-disable-next-line global-require
  } = require('@docusaurus/core/lib/server/translations/translationsExtractor');

  const filePaths = (await globSourceCodeFilePaths(targetDirs)).filter(
    (filePath) => ['.js', '.jsx'].includes(path.extname(filePath)),
  );

  const filesExtractedTranslations = await extractAllSourceCodeFileTranslations(
    filePaths,
    {
      presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
    },
  );

  filesExtractedTranslations.forEach((fileExtractedTranslations) => {
    fileExtractedTranslations.warnings.forEach((warning) => {
      throw new Error(`
Please make sure all theme translations are static!
Some warnings were found!

${warning}
      `);
    });
  });

  const translations = filesExtractedTranslations.reduce(
    (acc, extractedTranslations) => ({
      ...acc,
      ...extractedTranslations.translations,
    }),
    {},
  );

  return translations;
}

async function readMessagesFile(filePath) {
  return JSON.parse(await fs.readFile(filePath));
}

async function writeMessagesFile(filePath, messages) {
  const sortedMessages = sortObjectKeys(messages);

  const content = `${JSON.stringify(sortedMessages, null, 2)}\n`; // \n makes prettier happy
  await fs.outputFile(filePath, content);
  console.log(
    `${path.basename(filePath)} updated (${
      Object.keys(sortedMessages).length
    } messages)`,
  );
}

async function getCodeTranslationFiles(themeName) {
  const baseFile = getThemeLocalePath('base', themeName);
  const localesFiles = (await fs.readdir(LocalesDirPath))
    .filter((dirName) => dirName !== 'base')
    .map((locale) => getThemeLocalePath(locale, themeName));
  return {baseFile, localesFiles};
}

const DescriptionSuffix = '___DESCRIPTION';

async function updateBaseFile(baseFile, targetDirs) {
  const baseMessagesWithDescriptions = await readMessagesFile(baseFile);
  const baseMessages = pickBy(
    baseMessagesWithDescriptions,
    (_, key) => !key.endsWith(DescriptionSuffix),
  );

  const codeExtractedTranslations = await extractThemeCodeMessages(targetDirs);
  const codeMessages = mapValues(
    codeExtractedTranslations,
    (translation) => translation.message,
  );

  const unknownMessages = difference(
    Object.keys(baseMessages),
    Object.keys(codeMessages),
  );

  if (unknownMessages.length) {
    console.log(
      chalk.red(`Some messages exist in base locale but were not found by the code extractor!
They won't be removed automatically, so do the cleanup manually if necessary!
${logKeys(unknownMessages)}`),
    );
  }

  const newBaseMessages = {
    ...baseMessages, // Ensure we don't automatically remove unknown messages
    ...codeMessages,
  };

  const newBaseMessagesDescriptions = Object.entries(newBaseMessages).reduce(
    (acc, [key]) => {
      const codeTranslation = codeExtractedTranslations[key];
      return {
        ...acc,
        [`${key}${DescriptionSuffix}`]: codeTranslation
          ? codeTranslation.description
          : undefined,
      };
    },
    {},
  );

  const newBaseMessagesWitDescription = {
    ...newBaseMessages,
    ...newBaseMessagesDescriptions,
  };

  await writeMessagesFile(baseFile, newBaseMessagesWitDescription);

  return newBaseMessages;
}

async function updateLocaleCodeTranslations(localeFile, baseFileMessages) {
  const localeFileMessages = await readMessagesFile(localeFile);

  const unknownMessages = difference(
    Object.keys(localeFileMessages),
    Object.keys(baseFileMessages),
  );

  if (unknownMessages.length) {
    console.log(
      chalk.red(`Some localized messages do not exist in base.json!
You may want to delete these!
${logKeys(unknownMessages)}`),
    );
  }

  const newLocaleFileMessages = {
    ...baseFileMessages,
    ...localeFileMessages,
  };

  const untranslatedKeys = Object.entries(newLocaleFileMessages)
    .filter(([key, value]) => value === baseFileMessages[key])
    .map(([key]) => key);

  if (untranslatedKeys.length) {
    console.warn(
      chalk.yellow(`Some messages do not seem to be translated!
${logKeys(untranslatedKeys)}`),
    );
  }

  await writeMessagesFile(localeFile, newLocaleFileMessages);
}

async function updateCodeTranslations() {
  // Order is important. The log messages must be in the same order as execution
  // eslint-disable-next-line no-restricted-syntax
  for (const theme of Themes) {
    const {baseFile, localesFiles} = await getCodeTranslationFiles(theme.name);
    logSection(`Will update base file for ${theme.name}`);
    const baseFileMessages = await updateBaseFile(baseFile, theme.src);
    const [, newLocale] = process.argv;

    if (newLocale) {
      const newLocalePath = getThemeLocalePath(newLocale, theme.name);

      if (!fs.existsSync(newLocalePath)) {
        await writeMessagesFile(newLocalePath, baseFileMessages);
        console.error(
          chalk.green(
            `Locale file ${path.basename(newLocalePath)} have been created.`,
          ),
        );
      } else {
        console.error(
          chalk.red(
            `Locale file ${path.basename(newLocalePath)} was already created!`,
          ),
        );
      }
    } else {
      // eslint-disable-next-line no-restricted-syntax
      for (const localeFile of localesFiles) {
        logSection(
          `Will update ${path.basename(
            path.dirname(localeFile),
          )} locale in ${path.basename(localeFile, path.extname(localeFile))}`,
        );

        await updateLocaleCodeTranslations(localeFile, baseFileMessages);
      }
    }
  }
}

function run() {
  updateCodeTranslations().then(
    () => {
      console.log('');
      console.log(chalk.green('updateCodeTranslations end'));
      console.log('');
    },
    (e) => {
      console.log('');
      console.error(chalk.red(`updateCodeTranslations failure: ${e.message}`));
      console.log('');
      console.error(e.stack);
      console.log('');
      process.exit(1);
    },
  );
}

exports.run = run;
exports.extractThemeCodeMessages = extractThemeCodeMessages;
