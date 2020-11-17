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
import * as Joi from 'joi';

type TranslationContext = {
  siteDir: string;
  locale: string;
};

const TranslationFileContentSchema = Joi.object<TranslationFileContent>()
  .pattern(
    Joi.string(),
    Joi.object({
      message: Joi.string().required(),
      description: Joi.string().optional(),
    }),
  )
  .required();

async function readTranslationFileContent(
  filePath: string,
): Promise<TranslationFileContent | undefined> {
  if (await fs.pathExists(filePath)) {
    const content = JSON.parse(
      await fs.readFile(filePath, 'utf8'),
    ) as TranslationFileContent;
    try {
      return Joi.attempt(content, TranslationFileContentSchema, {
        abortEarly: false,
        allowUnknown: false,
        convert: false,
      });
    } catch (e) {
      throw new Error(
        `Invalid translation file at  path=${filePath}.\n${e.message}`,
      );
    }
  }
  return undefined;
}

async function writeTranslationFileContent({
  filePath,
  content,
  suffix = '',
}: {
  filePath: string;
  content: TranslationFileContent;
  suffix?: string;
}): Promise<void> {
  const suffixedContent = mapValues(content, (value) => ({
    ...value,
    message: `${value.message}${suffix}`,
  }));

  const existingContent = await readTranslationFileContent(filePath);

  // TODO detect stale translation keys here?
  // TODO add merge+/override modes
  // TODO always update the translation description?
  const mergedContent: TranslationFileContent = {
    ...suffixedContent,
    ...existingContent,
  };

  // Avoid creating empty translation files
  if (Object.keys(mergedContent).length > 0) {
    console.log(
      `writing ${Object.keys(content).length} translations => ${path.relative(
        process.cwd(),
        filePath,
      )}`,
    );
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
  }
}

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
export async function writeCodeTranslations(
  context: TranslationContext,
  content: TranslationFileContent,
): Promise<void> {
  const filePath = getCodeTranslationsFilePath(context);
  return writeTranslationFileContent({
    filePath,
    content,
    // suffix: ` (${context.locale})`,
  });
}

// We ask users to not provide any extension on purpose:
// maybe some day we'll want to support multiple FS formats?
// (json/yaml/toml/xml...)
function addTranslationFileExtension(translationFilePath: string) {
  if (translationFilePath.endsWith('.json')) {
    throw new Error(
      `Translation file path does  not need to end  with .json, we addt the extension automatically. translationFilePath=${translationFilePath}`,
    );
  }
  return `${translationFilePath}.json`;
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
    locale,
    pluginName: plugin.name,
    pluginId: plugin.options.id,
  });

  return path.join(dirPath, addTranslationFileExtension(translationFilePath));
}

export async function writePluginTranslations({
  siteDir,
  plugin,
  locale,
  translationFile,
}: TranslationContext & {
  plugin: InitPlugin;
  translationFile: TranslationFile;
}): Promise<void> {
  const filePath = getPluginTranslationFilePath({
    plugin,
    siteDir,
    locale,
    translationFilePath: translationFile.path,
  });

  await writeTranslationFileContent({
    filePath,
    content: translationFile.content,
    // suffix: ` (${locale})`,
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
