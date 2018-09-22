const hljs = require('highlight.js');
const chalk = require('chalk');
const escapeHtml = require('escape-html');

export default (str, rawLang) => {
  if (rawLang === 'text' || !rawLang) {
    return escapeHtml(str);
  }
  const lang = rawLang.toLowerCase();
  try {
    if (hljs.getLanguage(lang)) {
      return hljs.highlight(lang, str).value;
    }
  } catch (e) {
    console.error(
      chalk.yellow(
        `Highlight.js syntax highlighting for language "${lang}" is not supported.`,
      ),
    );
  }
  return hljs.highlightAuto(str).value;
};
