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

async function parseFiles(directoryPath) {
  try {
    const files = await fs.promises.readdir(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stat = await fs.promises.stat(filePath);

      if (stat.isDirectory()) {
        await parseFiles(filePath); // Recursively process subdirectories
      } else {
        await processYamlFile(filePath); // Process individual YAML file
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}
async function processYamlFile(filePath) {
  const data = await fs.promises.readFile(filePath, 'utf8');
  const {website} = yaml.load(data);

  try {
    const html = await fetchWebsiteHtml(website);
    const $ = load(html);
    const generatorMeta = $('meta[name="generator"]');

    if (generatorMeta.length === 0) {
      console.log(`Website ${website} is not a Docusaurus site.`);
    }
  } catch (error) {
    console.error(`Error fetching website ${website}:`, error.message);
  }
}

async function fetchWebsiteHtml(url) {
  const response = await fetch(url, {
    headers: {
      'Accept-Encoding': 'gzip, deflate',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  return response.text();
}

// processYamlFiles('../../website/showcase');
parseFiles('./admin/scripts/showcase');
