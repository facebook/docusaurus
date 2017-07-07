/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require('react');
const unindent = require('./unindent.js');

/* http://prismjs.com/download.html?themes=prism&languages=markup+clike+javascript+jsx */
/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license https://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou https://lea.verou.me
 */

// Private helper vars
const lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

const _ = Prism = {
  util: {
    encode(tokens) {
      if (tokens instanceof Token) {
        return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
      } else if (_.util.type(tokens) === 'Array') {
        return tokens.map(_.util.encode);
      } else {
        return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
      }
    },

    type(o) {
      return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
    },

    // Deep clone a language definition (e.g. to extend it)
    clone(o) {
      const type = _.util.type(o);

      switch (type) {
        case 'Object':
          var clone = {};

          for (const key in o) {
            if (o.hasOwnProperty(key)) {
              clone[key] = _.util.clone(o[key]);
            }
          }

          return clone;

        case 'Array':
          // Check for existence for IE8
          return o.map && o.map(v => { return _.util.clone(v); });
      }

      return o;
    },
  },

  languages: {
    extend(id, redef) {
      const lang = _.util.clone(_.languages[id]);

      for (const key in redef) {
        lang[key] = redef[key];
      }

      return lang;
    },

    /**
     * Insert a token before another token in a language literal
     * As this needs to recreate the object (we cannot actually insert before keys in object literals),
     * we cannot just provide an object, we need an object and a key.
     * @param inside The key (or language id) of the parent
     * @param before The key to insert before. If not provided, the function appends instead.
     * @param insert Object with the key/value pairs to insert
     * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
     */
    insertBefore(inside, before, insert, root) {
      root = root || _.languages;
      const grammar = root[inside];

      if (arguments.length == 2) {
        insert = arguments[1];

        for (var newToken in insert) {
          if (insert.hasOwnProperty(newToken)) {
            grammar[newToken] = insert[newToken];
          }
        }

        return grammar;
      }

      const ret = {};

      for (const token in grammar) {

        if (grammar.hasOwnProperty(token)) {

          if (token == before) {

            for (var newToken in insert) {

              if (insert.hasOwnProperty(newToken)) {
                ret[newToken] = insert[newToken];
              }
            }
          }

          ret[token] = grammar[token];
        }
      }

      // Update references in other language definitions
      _.languages.DFS(_.languages, function(key, value) {
        if (value === root[inside] && key != inside) {
          this[key] = ret;
        }
      });

      return root[inside] = ret;
    },

    // Traverse a language definition with Depth First Search
    DFS(o, callback, type) {
      for (const i in o) {
        if (o.hasOwnProperty(i)) {
          callback.call(o, i, o[i], type || i);

          if (_.util.type(o[i]) === 'Object') {
            _.languages.DFS(o[i], callback);
          }          else if (_.util.type(o[i]) === 'Array') {
            _.languages.DFS(o[i], callback, i);
          }
        }
      }
    },
  },

  highlightAll(async, callback) {
    const elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

    for (let i = 0, element; element = elements[i++];) {
      _.highlightElement(element, async === true, callback);
    }
  },

  highlightElement(element, async, callback) {
    // Find language
    let language, grammar, parent = element;

    while (parent && !lang.test(parent.className)) {
      parent = parent.parentNode;
    }

    if (parent) {
      language = (parent.className.match(lang) || [, ''])[1];
      grammar = _.languages[language];
    }

    // Set language on the element, if not present
    element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

    // Set language on the parent, for styling
    parent = element.parentNode;

    if (/pre/i.test(parent.nodeName)) {
      parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
    }

    if (!grammar) {
      return;
    }

    let code = element.textContent;

    if (!code) {
      return;
    }

    code = code.replace(/^(?:\r?\n|\r)/, '');

    const env = {
      element,
      language,
      grammar,
      code,
    };

    _.hooks.run('before-highlight', env);

    if (async && _self.Worker) {
      const worker = new Worker(_.filename);

      worker.onmessage = function(evt) {
        env.highlightedCode = Token.stringify(JSON.parse(evt.data), language);

        _.hooks.run('before-insert', env);

        env.element.innerHTML = env.highlightedCode;

        callback && callback.call(env.element);
        _.hooks.run('after-highlight', env);
      };

      worker.postMessage(JSON.stringify({
        language: env.language,
        code: env.code,
      }));
    }    else {
      env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

      _.hooks.run('before-insert', env);

      env.element.innerHTML = env.highlightedCode;

      callback && callback.call(element);

      _.hooks.run('after-highlight', env);
    }
  },

  highlight(text, grammar, language) {
    const tokens = _.tokenize(text, grammar);
    return Token.stringify(_.util.encode(tokens), language);
  },

  tokenize(text, grammar, language) {
    const Token = _.Token;

    const strarr = [text];

    const rest = grammar.rest;

    if (rest) {
      for (var token in rest) {
        grammar[token] = rest[token];
      }

      delete grammar.rest;
    }

    tokenloop: for (var token in grammar) {
      if (!grammar.hasOwnProperty(token) || !grammar[token]) {
        continue;
      }

      let patterns = grammar[token];
      patterns = (_.util.type(patterns) === 'Array') ? patterns : [patterns];

      for (let j = 0; j < patterns.length; ++j) {
        let pattern = patterns[j],
          inside = pattern.inside,
          lookbehind = !!pattern.lookbehind,
          lookbehindLength = 0,
          alias = pattern.alias;

        pattern = pattern.pattern || pattern;

        for (let i = 0; i < strarr.length; i++) { // Don't cache length as it changes during the loop

          const str = strarr[i];

          if (strarr.length > text.length) {
            // Something went terribly wrong, ABORT, ABORT!
            break tokenloop;
          }

          if (str instanceof Token) {
            continue;
          }

          pattern.lastIndex = 0;

          var match = pattern.exec(str);

          if (match) {
            if (lookbehind) {
              lookbehindLength = match[1].length;
            }

            var from = match.index - 1 + lookbehindLength,
              match = match[0].slice(lookbehindLength),
              len = match.length,
              to = from + len,
              before = str.slice(0, from + 1),
              after = str.slice(to + 1);

            const args = [i, 1];

            if (before) {
              args.push(before);
            }

            const wrapped = new Token(token, inside ? _.tokenize(match, inside) : match, alias);

            args.push(wrapped);

            if (after) {
              args.push(after);
            }

            Array.prototype.splice.apply(strarr, args);
          }
        }
      }
    }

    return strarr;
  },

  hooks: {
    all: {},

    add(name, callback) {
      const hooks = _.hooks.all;

      hooks[name] = hooks[name] || [];

      hooks[name].push(callback);
    },

    run(name, env) {
      const callbacks = _.hooks.all[name];

      if (!callbacks || !callbacks.length) {
        return;
      }

      for (let i = 0, callback; callback = callbacks[i++];) {
        callback(env);
      }
    },
  },
};

const Token = _.Token = function(type, content, alias) {
  this.type = type;
  this.content = content;
  this.alias = alias;
};

Token.reactify = function(o, language, parent, key) {
  if (typeof o == 'string') {
    return o;
  }

  if (_.util.type(o) === 'Array') {
    return o.map((element, i) => {
      return Token.reactify(element, language, o, i);
    });
  }

  const env = {
    type: o.type,
    content: Token.reactify(o.content, language, parent),
    tag: 'span',
    classes: ['token', o.type],
    attributes: {key},
    language,
    parent,
  };

  if (env.type == 'comment') {
    env.attributes.spellCheck = true;
  }

  if (o.alias) {
    const aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
    Array.prototype.push.apply(env.classes, aliases);
  }

  _.hooks.run('wrap', env);

  env.attributes.className = env.classes.join(' ');

  return React.DOM[env.tag](env.attributes, env.content);
};

Prism.languages.markup = {
  'comment': /<!--[\w\W]*?-->/,
  'prolog': /<\?[\w\W]+?\?>/,
  'doctype': /<!DOCTYPE[\w\W]+?>/,
  'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
  'tag': {
    pattern: /<\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
    inside: {
      'tag': {
        pattern: /^<\/?[^\s>\/]+/i,
        inside: {
          'punctuation': /^<\/?/,
          'namespace': /^[^\s>\/:]+:/,
        },
      },
      'attr-value': {
        pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
        inside: {
          'punctuation': /[=>"']/,
        },
      },
      'punctuation': /\/?>/,
      'attr-name': {
        pattern: /[^\s>\/]+/,
        inside: {
          'namespace': /^[^\s>\/:]+:/,
        },
      },

    },
  },
  'entity': /&#?[\da-z]{1,8};/i,
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', env => {

  if (env.type === 'entity') {
    env.attributes['title'] = env.content.replace(/&amp;/, '&');
  }
});

Prism.languages.clike = {
  'comment': [
    {
      pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
      lookbehind: true,
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
    },
  ],
  'string': /("|')(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
  'class-name': {
    pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
    lookbehind: true,
    inside: {
      punctuation: /(\.|\\)/,
    },
  },
  'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  'boolean': /\b(true|false)\b/,
  'function': /[a-z0-9_]+(?=\()/i,
  'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/,
  'operator': /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|~|\^|%/,
  'punctuation': /[{}[\];(),.:]/,
};

Prism.languages.javascript = Prism.languages.extend('clike', {
  'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/,
  'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
  'function': /(?!\d)[a-z0-9_$]+(?=\()/i,
});

Prism.languages.insertBefore('javascript', 'keyword', {
  'regex': {
    pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
    lookbehind: true,
  },
});

Prism.languages.insertBefore('javascript', 'class-name', {
  'template-string': {
    pattern: /`(?:\\`|\\?[^`])*`/,
    inside: {
      'interpolation': {
        pattern: /\$\{[^}]+\}/,
        inside: {
          'interpolation-punctuation': {
            pattern: /^\$\{|\}$/,
            alias: 'punctuation',
          },
          rest: Prism.languages.javascript,
        },
      },
      'string': /[\s\S]+/,
    },
  },
});

if (Prism.languages.markup) {
  Prism.languages.insertBefore('markup', 'tag', {
    'script': {
      pattern: /<script[\w\W]*?>[\w\W]*?<\/script>/i,
      inside: {
        'tag': {
          pattern: /<script[\w\W]*?>|<\/script>/i,
          inside: Prism.languages.markup.tag.inside,
        },
        rest: Prism.languages.javascript,
      },
      alias: 'language-javascript',
    },
  });
}

(function(Prism) {

  const javascript = Prism.util.clone(Prism.languages.javascript);

  Prism.languages.jsx = Prism.languages.extend('markup', javascript);
  Prism.languages.jsx.tag.pattern = /<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+|(\{[\w\W]*?\})))?\s*)*\/?>/i;

  Prism.languages.jsx.tag.inside['attr-value'].pattern = /=[^\{](?:('|")[\w\W]*?(\1)|[^\s>]+)/i;

  Prism.languages.insertBefore('inside', 'attr-value', {
    'script': {
      pattern: /=(\{[\w\W]*?\})/i,
      inside: {
        'function' : Prism.languages.javascript.function,
        'punctuation': /[={}[\];(),.:]/,
        'keyword':  Prism.languages.javascript.keyword,
      },
      'alias': 'language-javascript',
    },
  }, Prism.languages.jsx.tag);

}(Prism));

const PrismComponent = React.createClass({
  statics: {
    _,
  },
  getDefaultProps() {
    return {
      language: 'javascript',
    };
  },
  render() {
    const lines = [];
    if (this.props.line) {
      this.props.line.split(',').forEach(range => {
        const parts = range.split('-');
        if (parts.length === 1) {
          lines.push(parts[0].trim());
        } else {
          const start = parseInt(parts[0].trim(), 10);
          const end = parseInt(parts[1].trim(), 10);
          for (let ii = start; ii <= end; ii++) {
            lines.push(ii);
          }
        }
      });
    }
    const grammar = _.languages[this.props.language];
    return (
      <pre className={'prism language-' + this.props.language}>
        {Token.reactify(_.tokenize(this.props.children, grammar))}
        {lines.map((line, ii) => {
          return (
            <div
              className="line-highlight"
              key={ii}
              style={{height: 20, top: 20 * (line - 1)}}
            />
          );
        })}
      </pre>
    );
  },
});

module.exports = PrismComponent;
