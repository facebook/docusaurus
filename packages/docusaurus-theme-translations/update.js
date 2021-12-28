/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check
/* eslint-disable import/no-extraneous-dependencies */

const logger = require('@docusaurus/logger').default;
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
  {
    name: 'plugin-ideal-image',
    src: [getPackageCodePath('docusaurus-plugin-ideal-image')],
  },
];
const AllThemesSrcDirs = Themes.flatMap((theme) => theme.src);

logger.info`Will scan folders for code translations:path=${AllThemesSrcDirs}`;

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

/**
 * @param {string[]} targetDirs
 * @returns {Promise<import('@docusaurus/types').TranslationFileContent>}
 */
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
  if (!(await fs.pathExists(filePath))) {
    logger.info`File path=${filePath} not found. Creating new translation base file.`;
    await fs.writeFile(filePath, '{}\n');
  }
  return JSON.parse((await fs.readFile(filePath)).toString());
}

async function writeMessagesFile(filePath, messages) {
  const sortedMessages = sortObjectKeys(messages);

  const content = `${JSON.stringify(sortedMessages, null, 2)}\n`; // \n makes prettier happy
  await fs.outputFile(filePath, content);
  logger.info`path=${path.basename(
    filePath,
  )} updated subdue=${logger.interpolate`(number=${
    Object.keys(sortedMessages).length
  } messages)`}\n`;
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
    logger.error`Some messages exist in base locale but were not found by the code extractor!
They won't be removed automatically, so do the cleanup manually if necessary! code=${unknownMessages}`;
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
    logger.error`Some localized messages do not exist in base.json!
You may want to delete these! code=${unknownMessages}`;
  }

  const newLocaleFileMessages = {
    ...baseFileMessages,
    ...localeFileMessages,
  };

  const untranslatedKeys = Object.entries(newLocaleFileMessages)
    .filter(([key, value]) => value === baseFileMessages[key])
    .map(([key]) => key);

  if (untranslatedKeys.length) {
    logger.warn`Some messages do not seem to be translated! code=${untranslatedKeys}`;
  }

  await writeMessagesFile(localeFile, newLocaleFileMessages);
  return {untranslated: untranslatedKeys.length};
}

async function updateCodeTranslations() {
  const stats = {};
  let messageCount = 0;
  const [, newLocale] = process.argv;
  // Order is important. The log messages must be in the same order as execution
  // eslint-disable-next-line no-restricted-syntax
  for (const theme of Themes) {
    const {baseFile, localesFiles} = await getCodeTranslationFiles(theme.name);
    logger.info`Will update base file for name=${theme.name}\n`;
    const baseFileMessages = await updateBaseFile(baseFile, theme.src);

    if (newLocale) {
      const newLocalePath = getThemeLocalePath(newLocale, theme.name);

      if (!fs.existsSync(newLocalePath)) {
        await writeMessagesFile(newLocalePath, baseFileMessages);
        logger.success`Locale file path=${path.basename(
          newLocalePath,
        )} have been created.`;
      } else {
        logger.warn`Locale file path=${path.basename(
          newLocalePath,
        )} was already created!`;
      }
    } else {
      // eslint-disable-next-line no-restricted-syntax
      for (const localeFile of localesFiles) {
        const localeName = path.basename(path.dirname(localeFile));
        const pluginName = path.basename(localeFile, path.extname(localeFile));
        logger.info`Will update name=${localeName} locale in name=${pluginName}`;
        const stat = await updateLocaleCodeTranslations(
          localeFile,
          baseFileMessages,
        );

        stats[localeName] ??= {untranslated: 0};
        stats[localeName].untranslated += stat.untranslated;
      }
      messageCount += Object.keys(baseFileMessages).length;
    }
  }
  if (newLocale) {
    return null;
  }
  return {stats, messageCount};
}

function run() {
  updateCodeTranslations().then(
    (result) => {
      logger.success('updateCodeTranslations end\n');
      if (result) {
        const {stats, messageCount} = result;
        const locales = Object.entries(stats).sort(
          (a, b) => a[1].untranslated - b[1].untranslated,
        );
        const messages = locales.map(([name, stat]) => {
          const percentage = (messageCount - stat.untranslated) / messageCount;
          const filled = Math.floor(percentage * 30);
          const color =
            // eslint-disable-next-line no-nested-ternary
            percentage > 0.99
              ? logger.green
              : percentage > 0.7
              ? logger.yellow
              : logger.red;
          const progress = color(
            `[${''.padStart(filled, '=')}${''.padStart(30 - filled, ' ')}]`,
          );
          return logger.interpolate`name=${name.padStart(8)} ${progress} ${(
            percentage * 100
          ).toFixed(1)} subdue=${`(${
            messageCount - stat.untranslated
          }/${messageCount})`}`;
        });
        logger.info`Translation coverage:
${messages.join('\n')}`;
      }
    },
    (e) => {
      logger.error(
        `\nupdateCodeTranslations failure: ${e.message}\n${e.stack}\n`,
      );
      process.exit(1);
    },
  );
}

exports.run = run;
exports.extractThemeCodeMessages = extractThemeCodeMessages;
