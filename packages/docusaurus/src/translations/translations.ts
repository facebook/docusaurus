/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from 'path';
import fs from 'fs-extra';
import {InitPlugin} from '../server/plugins/init';
import {mapValues} from 'lodash';
import {TranslationFileContent, TranslationFile} from '@docusaurus/types';
import {getPluginI18nPath} from '@docusaurus/utils';
import {DEFAULT_PLUGIN_ID} from '../constants';

async function readTranslationFileContent(
  filePath: string,
): Promise<TranslationFileContent | undefined> {
  if (await fs.pathExists(filePath)) {
    // TODO validate file content
    return JSON.parse(
      await fs.readFile(filePath, 'utf8'),
    ) as TranslationFileContent;
  }
  return undefined;
}

async function writeTranslationFileContent(
  filePath: string,
  content: TranslationFileContent,
): Promise<void> {
  console.log(
    `writing ${Object.keys(content).length} translations => ${path.relative(
      process.cwd(),
      filePath,
    )}`,
  );
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(content, null, 2));
}

async function appendTranslationFileContent({
  filePath,
  content,
  suffix,
}: {
  filePath: string;
  content: TranslationFileContent;
  suffix: string;
}): Promise<void> {
  // TODO make this optional?
  const suffixedContent = mapValues(content, (value) => ({
    ...value,
    message: `${value.message}${suffix}`,
  }));

  const existingContent = await readTranslationFileContent(filePath);

  // TODO detect stale translation keys here?
  const mergedContent: TranslationFileContent = {
    ...suffixedContent,
    ...existingContent,
  };

  // Avoid creating empty translation files
  if (Object.keys(mergedContent).length > 0) {
    await writeTranslationFileContent(filePath, mergedContent);
  }
}

type TranslationContext = {
  siteDir: string;
  locale: string;
};

// should we make this configurable?
export function getTranslationsDirPath(context: TranslationContext): string {
  return path.resolve(path.join(context.siteDir, `i18n`));
}
export function getTranslationsLocaleDirPath(
  context: TranslationContext,
): string {
  return path.join(getTranslationsDirPath(context), context.locale);
}

export function getCodeTranslationsFilePath(
  context: TranslationContext,
): string {
  return path.join(getTranslationsLocaleDirPath(context), 'code.json');
}

export async function readCodeTranslationFileContent(
  context: TranslationContext,
): Promise<TranslationFileContent | undefined> {
  const filePath = getCodeTranslationsFilePath(context);
  return readTranslationFileContent(filePath);
}
export async function appendCodeTranslations(
  context: TranslationContext,
  content: TranslationFileContent,
): Promise<void> {
  const filePath = getCodeTranslationsFilePath(context);
  return appendTranslationFileContent({
    filePath,
    content,
    suffix: ` (${context.locale})`,
  });
}

// TODO really needed?
function addTranslationFileExtension(filepath: string) {
  return filepath.endsWith('.json') ? filepath : `${filepath}.json`;
}

export function getPluginTranslationFilePath({
  siteDir,
  plugin,
  locale,
  translationFilePath,
}: TranslationContext & {
  plugin: InitPlugin;
  translationFilePath: string;
}): string {
  const dirPath = getPluginI18nPath({
    siteDir,
    currentLocale: locale,
    pluginFolderName: plugin.name, // TODO shorter names?
    pluginId: plugin.options.id ?? DEFAULT_PLUGIN_ID,
  });

  return path.join(dirPath, addTranslationFileExtension(translationFilePath));
}

export async function appendPluginTranslations({
  siteDir,
  plugin,
  locale,
  translationFile,
}: {
  siteDir: string;
  plugin: InitPlugin;
  locale: string;
  translationFile: TranslationFile;
}): Promise<void> {
  const filePath = getPluginTranslationFilePath({
    plugin,
    siteDir,
    locale,
    translationFilePath: translationFile.path,
  });

  await appendTranslationFileContent({
    filePath,
    content: translationFile.content,
    suffix: ` (${locale})`,
  });
}

export async function localizePluginTranslationFile({
  siteDir,
  plugin,
  locale,
  translationFile,
}: TranslationContext & {
  plugin: InitPlugin;
  translationFile: TranslationFile;
}): Promise<TranslationFile> {
  const filePath = getPluginTranslationFilePath({
    plugin,
    siteDir,
    locale,
    translationFilePath: translationFile.path,
  });

  const localizedContent = await readTranslationFileContent(filePath);

  if (localizedContent) {
    // localized messages "override" default unlocalized messages
    return {
      path: translationFile.path,
      content: {
        ...translationFile.content,
        ...localizedContent,
      },
    };
  } else {
    return translationFile;
  }
}
