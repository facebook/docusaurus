/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import {load} from 'cheerio';

async function processYamlFiles(directoryPath) {
  try {
    const files = await fs.promises.readdir(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stat = await fs.promises.stat(filePath);

      if (stat.isDirectory()) {
        await processYamlFiles(filePath); // Recursive call for subdirectory
      } else {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const yamlData = yaml.load(data);
        const websiteUrl = yamlData.website;

        try {
          const response = await fetch(websiteUrl, {
            headers: {
              'Accept-Encoding': 'gzip, deflate',
            },
          });

          if (!response.ok) {
            throw new Error(
              `Failed to fetch ${websiteUrl}: ${response.statusText}`,
            );
          }

          const html = await response.text();
          const $ = load(html);
          const generatorMeta = $('meta[name="generator"]');

          if (generatorMeta.length === 0) {
            console.log(`Website ${websiteUrl} is not a Docusaurus site.`);
          }
        } catch (error) {
          console.error(`Error fetching website ${websiteUrl}:`, error.message);
        }
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

// processYamlFiles('./admin/scripts/showcase');
processYamlFiles('../../website/showcase');
