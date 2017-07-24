#!/usr/bin/env node

/* script to generate docSidebar.js file for users who are using 
   doc front mattters with category, layout, previous, and next fields */
const glob = require("glob");
const fs = require("fs");
const path = require("path");
const prettier = require("prettier");

function splitHeader(content) {
  const lines = content.split("\n");
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
  const lines = both.header.split("\n");
  for (let i = 0; i < lines.length - 1; ++i) {
    const keyvalue = lines[i].split(":");
    const key = keyvalue[0].trim();
    let value = keyvalue.slice(1).join(":").trim();
    // Handle the case where you have "Community #10"
    try {
      value = JSON.parse(value);
    } catch (e) {}
    metadata[key] = value;
  }
  return { metadata, rawContent: both.content };
}

const docs = {};
const sidebar = {};

const files = glob.sync(process.cwd() + "/../docs/**");
files.forEach(file => {
  const extension = path.extname(file);
  if (extension === ".md" || extension === ".markdown") {
    const metadata = extractMetadata(fs.readFileSync(file, "utf8")).metadata;
    if (!metadata.id) {
      return;
    }
    const data = {};
    data["category"] = metadata.category;
    data["sidebar"] = metadata.layout;
    if (metadata.next) {
      data["next"] = metadata.next;
    }
    if (metadata.previous) {
      data["previous"] = metadata.previous;
    }
    docs[metadata.id] = data;
  }
});

Object.keys(docs).forEach(id => {
  if (!docs[id].previous) {
    sidebar[docs[id].sidebar] = {};
    sidebar[docs[id].sidebar][docs[id].category] = [];
    sidebar[docs[id].sidebar][docs[id].category].push(id);
  }
});

Object.keys(sidebar).forEach(sb => {
  const categories = sidebar[sb];
  Object.keys(categories).forEach(category => {
    const docIds = categories[category];
    next = docIds[0];
    while (next) {
      id = next;
      next = docs[id].next;
      if (!next) {
        return;
      }
      if (docs[next].category === category) {
        docIds.push(next);
      } else {
        categories[docs[next].category] = [];
        categories[docs[next].category].push(next);
      }
    }
  });
});

const str = prettier.format("module.exports = " + JSON.stringify(sidebar));
fs.writeFileSync(process.cwd() + "/docSidebar.js", str, "utf8");
