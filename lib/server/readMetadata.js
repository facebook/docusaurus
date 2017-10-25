/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();

const path = require("path");
const fs = require("fs");
const glob = require("glob");
const chalk = require("chalk");
const siteConfig = require(CWD + "/siteConfig.js");
const versionFallback = require("./versionFallback.js");

const ENABLE_VERSIONING = fs.existsSync(CWD + "/versions.json");

let languages;
if (fs.existsSync(CWD + "/languages.js")) {
  languages = require(CWD + "/languages.js");
} else {
  languages = [
    {
      enabled: true,
      name: "English",
      tag: "en"
    }
  ];
}

// returns map from id to object containing sidebar ordering info
function readSidebar() {
  let allSidebars;
  if (fs.existsSync(CWD + "/sidebars.json")) {
    allSidebars = require(CWD + "/sidebars.json");
  } else {
    allSidebars = {};
  }
  Object.assign(allSidebars, versionFallback.sidebarData());

  const order = {};

  Object.keys(allSidebars).forEach(sidebar => {
    const categories = allSidebars[sidebar];

    let ids = [];
    let categoryOrder = [];
    Object.keys(categories).forEach(category => {
      ids = ids.concat(categories[category]);
      for (let i = 0; i < categories[category].length; i++) {
        categoryOrder.push(category);
      }
    });

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let previous, next;
      if (i > 0) previous = ids[i - 1];
      if (i < ids.length - 1) next = ids[i + 1];
      order[id] = {
        previous: previous,
        next: next,
        sidebar: sidebar,
        category: categoryOrder[i]
      };
    }
  });
  return order;
}

// split markdown header
function splitHeader(content) {
  const lines = content.split("\n");
  if (lines[0] !== "---") {
    return false;
  }
  let i = 1;
  for (; i < lines.length - 1; ++i) {
    if (lines[i] === "---") {
      break;
    }
  }
  return {
    header: lines.slice(1, i + 1).join("\n"),
    content: lines.slice(i + 1).join("\n")
  };
}

// Extract markdown metadata header
function extractMetadata(content) {
  const metadata = {};
  const both = splitHeader(content);
  if (both === false) {
    return { metadata, rawContent: content };
  }
  const lines = both.header.split("\n");
  for (let i = 0; i < lines.length - 1; ++i) {
    const keyvalue = lines[i].split(":");
    const key = keyvalue[0].trim();
    let value = keyvalue
      .slice(1)
      .join(":")
      .trim();
    try {
      value = JSON.parse(value);
    } catch (e) {}
    metadata[key] = value;
  }
  return { metadata, rawContent: both.content };
}

// process the metadata for a document found in the docs folder
function processMetadata(file) {
  const result = extractMetadata(fs.readFileSync(file, "utf8"));

  const regexSubFolder = /docs\/(.*)\/.*/;

  let language = "en";
  const match = regexSubFolder.exec(file);
  if (match) {
    language = match[1];
  }

  const metadata = result.metadata;
  const rawContent = result.rawContent;
  metadata.source = path.basename(file);

  if (!metadata.id) {
    metadata.id = path.basename(file, path.extname(file));
  }
  if (metadata.id.includes("/")) {
    throw new Error('Document id cannot include "/".');
  }
  if (!metadata.title) {
    metadata.title = metadata.id;
  }

  if (languages.length === 1 && !siteConfig.useEnglishUrl) {
    metadata.permalink = "docs/" + metadata.id + ".html";
  } else {
    metadata.permalink = "docs/" + language + "/" + metadata.id + ".html";
  }

  if (ENABLE_VERSIONING) {
    metadata.version = "next";
    if (languages.length === 1 && !siteConfig.useEnglishUrl) {
      metadata.permalink = metadata.permalink.replace("docs/", "docs/next/");
    } else {
      metadata.permalink = metadata.permalink.replace(
        "docs/" + language + "/",
        "docs/" + language + "/next/"
      );
    }
  }

  // change ids previous, next
  metadata.localized_id = metadata.id;
  metadata.id = language + "-" + metadata.id;
  metadata.language = language;

  const order = readSidebar();
  const id = metadata.localized_id;

  if (order[id]) {
    metadata.sidebar = order[id].sidebar;
    metadata.category = order[id].category;

    if (order[id].next) {
      metadata.next_id = order[id].next;
      metadata.next = language + "-" + order[id].next;
    }
    if (order[id].previous) {
      metadata.previous_id = order[id].previous;
      metadata.previous = language + "-" + order[id].previous;
    }
  }

  return { metadata, rawContent: rawContent };
}

// process metadata for all docs and save into core/metadata.js
function generateMetadataDocs() {
  console.log("Generating Metadata for Docs....");
  const order = readSidebar();

  const regexSubFolder = /translated_docs\/(.*)\/.*/;

  const enabledLanguages = [];
  languages.filter(lang => lang.enabled).map(lang => {
    enabledLanguages.push(lang.tag);
  });

  const metadatas = {};
  const defaultMetadatas = {};

  // metadata for english files
  let files = glob.sync(CWD + "/../docs/**");
  files.forEach(file => {
    let language = "en";

    const extension = path.extname(file);

    if (extension === ".md" || extension === ".markdown") {
      const res = processMetadata(file);
      if (!res) {
        return;
      }
      let metadata = res.metadata;
      metadatas[metadata.id] = metadata;

      // create a default list of documents for each enabled language based on docs in English
      // these will get replaced if/when the localized file is downloaded from crowdin
      enabledLanguages
        .filter(currentLanguage => {
          return currentLanguage != "en";
        })
        .map(currentLanguage => {
          let baseMetadata = Object.assign({}, metadata);
          baseMetadata["id"] = baseMetadata["id"]
            .toString()
            .replace(/^en-/, currentLanguage + "-");
          if (baseMetadata["permalink"])
            baseMetadata["permalink"] = baseMetadata["permalink"]
              .toString()
              .replace(/^docs\/en\//, "docs/" + currentLanguage + "/");
          if (baseMetadata["next"])
            baseMetadata["next"] = baseMetadata["next"]
              .toString()
              .replace(/^en-/, currentLanguage + "-");
          if (baseMetadata["previous"])
            baseMetadata["previous"] = baseMetadata["previous"]
              .toString()
              .replace(/^en-/, currentLanguage + "-");
          baseMetadata["language"] = currentLanguage;
          defaultMetadatas[baseMetadata["id"]] = baseMetadata;
        });
      Object.assign(metadatas, defaultMetadatas);
    }
  });

  // metadata for non-english docs
  files = glob.sync(CWD + "/translated_docs/**");
  files.forEach(file => {
    let language = "en";
    const match = regexSubFolder.exec(file);
    if (match) {
      language = match[1];
    }

    if (enabledLanguages.indexOf(language) === -1) {
      return;
    }

    const extension = path.extname(file);

    if (extension === ".md" || extension === ".markdown") {
      const res = processMetadata(file);
      if (!res) {
        return;
      }
      let metadata = res.metadata;
      metadatas[metadata.id] = metadata;
    }
  });

  // metadata for versioned docs
  const versionData = versionFallback.docData();
  versionData.forEach(metadata => {
    const id = metadata.localized_id;
    if (order[id]) {
      metadata.sidebar = order[id].sidebar;
      metadata.category = order[id].category;
      if (order[id].next) {
        metadata.next_id = order[id].next.replace(
          "version-" + metadata.version + "-",
          ""
        );
        metadata.next = metadata.language + "-" + order[id].next;
      }
      if (order[id].previous) {
        metadata.previous_id = order[id].previous.replace(
          "version-" + metadata.version + "-",
          ""
        );
        metadata.previous = metadata.language + "-" + order[id].previous;
      }
    }
    metadatas[metadata.id] = metadata;
  });

  // Get the titles of the previous and next ids so that we can use them in
  // navigation buttons in DocsLayout.js
  Object.keys(metadatas).forEach(function(metadata) {
    if (metadatas[metadata].previous) {
      metadatas[metadata].previous_title = metadatas[metadatas[metadata].previous].title;
    }
    if (metadatas[metadata].next) {
      metadatas[metadata].next_title = metadatas[metadatas[metadata].next].title;
    }
  });

  fs.writeFileSync(
    __dirname + "/../core/metadata.js",
    "/**\n" +
      " * @generated\n" +
      " */\n" +
      "module.exports = " +
      JSON.stringify(metadatas, null, 2) +
      ";"
  );
}

// process metadata for blog posts and save into core/MetadataBlog.js
function generateMetadataBlog() {
  const metadatas = [];

  let files = glob.sync(CWD + "/blog/**/*.*");
  if (!files || files.length == 0) {
    console.error(
      `${chalk.yellow(
        CWD + "/blog/ appears to be empty"
      )} Make sure you've put your blog files in your Docusaurus 'website' folder.`
    );
  }
  files
    .sort()
    .reverse()
    .forEach(file => {
      const extension = path.extname(file);
      if (extension !== ".md" && extension !== ".markdown") {
        return;
      }
      // Transform
      //   2015-08-13-blog-post-name-0.5.md
      // into
      //   2015/08/13/blog-post-name-0-5.html
      const filePath = path
        .basename(file)
        .replace("-", "/")
        .replace("-", "/")
        .replace("-", "/")
        .replace(/\.md$/, ".html");
      const result = extractMetadata(
        fs.readFileSync(file, { encoding: "utf8" })
      );
      const rawContent = result.rawContent;
      const metadata = Object.assign(
        { path: filePath, content: rawContent },
        result.metadata
      );

      metadata.id = metadata.title;

      // Extract, YYYY, MM, DD from the file name
      let filePathDateArr = path
        .basename(file)
        .toString()
        .split("-");
      metadata.date = new Date(
        filePathDateArr[0] +
          "-" +
          filePathDateArr[1] +
          "-" +
          filePathDateArr[2] +
          "T06:00:00.000Z"
      );

      metadatas.push(metadata);
    });

  fs.writeFileSync(
    __dirname + "/../core/MetadataBlog.js",
    "/**\n" +
      " * @generated\n" +
      " */\n" +
      "module.exports = " +
      JSON.stringify(metadatas, null, 2) +
      ";"
  );
}

module.exports = {
  readSidebar,
  extractMetadata,
  processMetadata,
  generateMetadataDocs,
  generateMetadataBlog
};
