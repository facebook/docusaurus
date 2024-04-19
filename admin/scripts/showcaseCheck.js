/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import axios from 'axios';
import {load} from 'cheerio';

// TODO remove axois
// TODO recursive yml search in showcase folder
// TODO filter out tags.yml

async function processYamlFiles(directoryPath) {
  try {
    const files = await fs.readdir(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const data = await fs.readFile(filePath, 'utf8');
      const yamlData = yaml.load(data);
      const websiteUrl = yamlData.website;

      try {
        const response = await axios.get(websiteUrl, {
          headers: {
            'Accept-Encoding': 'gzip, deflate',
          },
        });

        const html = response.data;
        const $ = load(html);
        const generatorMeta = $('meta[name="generator"]');

        if (generatorMeta.length === 0) {
          console.log(`Website ${websiteUrl} is not a Docusaurus site.`);
        }
      } catch (error) {
        console.error(`Error fetching website ${websiteUrl}:`, error.message);
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

processYamlFiles('../../website/showcase');
