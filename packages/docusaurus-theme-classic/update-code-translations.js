/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const globby = require('globby');
const {mapValues, pickBy, difference, orderBy} = require('lodash');

const CodeDirPaths = [
  path.join(__dirname, 'lib-next'),
  // TODO other themes should rather define their own translations in the future?
  path.join(__dirname, '..', 'docusaurus-theme-common', 'lib'),
  path.join(__dirname, '..', 'docusaurus-theme-search-algolia', 'src', 'theme'),
  path.join(__dirname, '..', 'docusaurus-theme-live-codeblock', 'src', 'theme'),
  path.join(__dirname, '..', 'docusaurus-plugin-pwa', 'src', 'theme'),
];

console.log('Will scan folders for code translations:', CodeDirPaths);

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

async function extractThemeCodeMessages() {
  // Unsafe import, should we create a package for the translationsExtractor ?
  const {
    globSourceCodeFilePaths,
    extractAllSourceCodeFileTranslations,
    // eslint-disable-next-line global-require
  } = require('@docusaurus/core/lib/server/translations/translationsExtractor');

  const filePaths = (await globSourceCodeFilePaths(CodeDirPaths)).filter(
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
    (acc, extractedTranslations) => {
      return {...acc, ...extractedTranslations.translations};
    },
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
  await fs.writeFile(filePath, content);
  console.log(
    `${path.basename(filePath)} updated (${
      Object.keys(sortedMessages).length
    } messages)`,
  );
}

async function getCodeTranslationFiles() {
  const codeTranslationsDir = path.join(__dirname, 'codeTranslations');
  const baseFile = path.join(codeTranslationsDir, 'base.json');
  const localesFiles = (await globby(codeTranslationsDir)).filter(
    (filepath) =>
      path.extname(filepath) === '.json' && !filepath.endsWith('base.json'),
  );
  return {baseFile, localesFiles};
}

const DescriptionSuffix = '___DESCRIPTION';

async function updateBaseFile(baseFile) {
  const baseMessagesWithDescriptions = await readMessagesFile(baseFile);
  const baseMessages = pickBy(
    baseMessagesWithDescriptions,
    (_, key) => !key.endsWith(DescriptionSuffix),
  );

  const codeExtractedTranslations = await extractThemeCodeMessages();
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
      chalk.red(`Some messages exist in base.json but were not found by the code extractor!
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
    .filter(([key, value]) => {
      return value === baseFileMessages[key];
    })
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
  logSection('Will update base file');
  const {baseFile, localesFiles} = await getCodeTranslationFiles();
  const baseFileMessages = await updateBaseFile(baseFile);

  // eslint-disable-next-line no-restricted-syntax
  for (const localeFile of localesFiles) {
    logSection(`Will update ${path.basename(localeFile)}`);
    // eslint-disable-next-line no-await-in-loop
    await updateLocaleCodeTranslations(localeFile, baseFileMessages);
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
