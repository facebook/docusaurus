/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require("react");

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license https://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou https://lea.verou.me
 */

// Private helper vars
const lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

const _ = (Prism = {
  util: {
    encode(tokens) {
      if (tokens instanceof Token) {
        return new Token(
          tokens.type,
          _.util.encode(tokens.content),
          tokens.alias
        );
      } else if (_.util.type(tokens) === "Array") {
        return tokens.map(_.util.encode);
      } else {
        return tokens
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/\u00a0/g, " ");
      }
    },

    type(o) {
      return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
    },

    // Deep clone a language definition (e.g. to extend it)
    clone(o) {
      const type = _.util.type(o);

      switch (type) {
        case "Object":
          var clone = {};

          for (const key in o) {
            if (o.hasOwnProperty(key)) {
              clone[key] = _.util.clone(o[key]);
            }
          }

          return clone;

        case "Array":
          // Check for existence for IE8
          return (
            o.map &&
            o.map(v => {
              return _.util.clone(v);
            })
          );
      }

      return o;
    }
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

      return (root[inside] = ret);
    },

    // Traverse a language definition with Depth First Search
    DFS(o, callback, type) {
      for (const i in o) {
        if (o.hasOwnProperty(i)) {
          callback.call(o, i, o[i], type || i);

          if (_.util.type(o[i]) === "Object") {
            _.languages.DFS(o[i], callback);
          } else if (_.util.type(o[i]) === "Array") {
            _.languages.DFS(o[i], callback, i);
          }
        }
      }
    }
  },

  highlightAll(async, callback) {
    const elements = document.querySelectorAll(
      'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
    );

    for (let i = 0, element; (element = elements[i++]); ) {
      _.highlightElement(element, async === true, callback);
    }
  },

  highlightElement(element, async, callback) {
    // Find language
    let language,
      grammar,
      parent = element;

    while (parent && !lang.test(parent.className)) {
      parent = parent.parentNode;
    }

    if (parent) {
      language = (parent.className.match(lang) || [, ""])[1];
      grammar = _.languages[language];
    }

    // Set language on the element, if not present
    element.className =
      element.className.replace(lang, "").replace(/\s+/g, " ") +
      " language-" +
      language;

    // Set language on the parent, for styling
    parent = element.parentNode;

    if (/pre/i.test(parent.nodeName)) {
      parent.className =
        parent.className.replace(lang, "").replace(/\s+/g, " ") +
        " language-" +
        language;
    }

    if (!grammar) {
      return;
    }

    let code = element.textContent;

    if (!code) {
      return;
    }

    code = code.replace(/^(?:\r?\n|\r)/, "");

    const env = {
      element,
      language,
      grammar,
      code
    };

    _.hooks.run("before-highlight", env);

    if (async && _self.Worker) {
      const worker = new Worker(_.filename);

      worker.onmessage = function(evt) {
        env.highlightedCode = Token.stringify(JSON.parse(evt.data), language);

        _.hooks.run("before-insert", env);

        env.element.innerHTML = env.highlightedCode;

        callback && callback.call(env.element);
        _.hooks.run("after-highlight", env);
      };

      worker.postMessage(
        JSON.stringify({
          language: env.language,
          code: env.code
        })
      );
    } else {
      env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

      _.hooks.run("before-insert", env);

      env.element.innerHTML = env.highlightedCode;

      callback && callback.call(element);

      _.hooks.run("after-highlight", env);
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
      patterns = _.util.type(patterns) === "Array" ? patterns : [patterns];

      for (let j = 0; j < patterns.length; ++j) {
        let pattern = patterns[j],
          inside = pattern.inside,
          lookbehind = !!pattern.lookbehind,
          lookbehindLength = 0,
          alias = pattern.alias;

        pattern = pattern.pattern || pattern;

        for (let i = 0; i < strarr.length; i++) {
          // Don't cache length as it changes during the loop

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

            const wrapped = new Token(
              token,
              inside ? _.tokenize(match, inside) : match,
              alias
            );

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

      for (let i = 0, callback; (callback = callbacks[i++]); ) {
        callback(env);
      }
    }
  }
});

const Token = (_.Token = function(type, content, alias) {
  this.type = type;
  this.content = content;
  this.alias = alias;
});

Token.reactify = function(o, language, parent, key) {
  if (typeof o == "string") {
    return o;
  }

  if (_.util.type(o) === "Array") {
    return o.map((element, i) => {
      return Token.reactify(element, language, o, i);
    });
  }

  const env = {
    type: o.type,
    content: Token.reactify(o.content, language, parent),
    tag: "span",
    classes: ["token", o.type],
    attributes: { key },
    language,
    parent
  };

  if (env.type == "comment") {
    env.attributes.spellCheck = true;
  }

  if (o.alias) {
    const aliases = _.util.type(o.alias) === "Array" ? o.alias : [o.alias];
    Array.prototype.push.apply(env.classes, aliases);
  }

  _.hooks.run("wrap", env);

  env.attributes.className = env.classes.join(" ");

  return React.DOM[env.tag](env.attributes, env.content);
};

(Prism.languages.markup = {
  comment: /<!--[\s\S]*?-->/,
  prolog: /<\?[\s\S]+?\?>/,
  doctype: /<!DOCTYPE[\s\S]+?>/i,
  cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\s\S])*\1|[^\s'">=]+))?)*\s*\/?>/i,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/i,
        inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ }
      },
      "attr-value": {
        pattern: /=(?:('|")[\s\S]*?(\1)|[^\s>]+)/i,
        inside: { punctuation: /[=>"']/ }
      },
      punctuation: /\/?>/,
      "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: { namespace: /^[^\s>\/:]+:/ }
      }
    }
  },
  entity: /&#?[\da-z]{1,8};/i
}), (Prism.languages.markup.tag.inside["attr-value"].inside.entity =
  Prism.languages.markup.entity), Prism.hooks.add("wrap", function(a) {
  "entity" === a.type && (a.attributes.title = a.content.replace(/&amp;/, "&"));
}), (Prism.languages.xml = Prism.languages.markup), (Prism.languages.html =
  Prism.languages.markup), (Prism.languages.mathml =
  Prism.languages.markup), (Prism.languages.svg = Prism.languages.markup);
(Prism.languages.css = {
  comment: /\/\*[\s\S]*?\*\//,
  atrule: { pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i, inside: { rule: /@[\w-]+/ } },
  url: /url\((?:(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
  selector: /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
  string: {
    pattern: /("|')(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0
  },
  property: /(\b|\B)[\w-]+(?=\s*:)/i,
  important: /\B!important\b/i,
  function: /[-a-z0-9]+(?=\()/i,
  punctuation: /[(){};:]/
}), (Prism.languages.css.atrule.inside.rest = Prism.util.clone(
  Prism.languages.css
)), Prism.languages.markup &&
  (
    Prism.languages.insertBefore("markup", "tag", {
      style: {
        pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
        lookbehind: !0,
        inside: Prism.languages.css,
        alias: "language-css"
      }
    }),
    Prism.languages.insertBefore(
      "inside",
      "attr-value",
      {
        "style-attr": {
          pattern: /\s*style=("|').*?\1/i,
          inside: {
            "attr-name": {
              pattern: /^\s*style/i,
              inside: Prism.languages.markup.tag.inside
            },
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            "attr-value": { pattern: /.+/i, inside: Prism.languages.css }
          },
          alias: "language-css"
        }
      },
      Prism.languages.markup.tag
    )
  );
Prism.languages.clike = {
  comment: [
    { pattern: /(^|[^\\])\/\*[\s\S]*?\*\//, lookbehind: !0 },
    { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0 }
  ],
  string: {
    pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0
  },
  "class-name": {
    pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
    lookbehind: !0,
    inside: { punctuation: /(\.|\\)/ }
  },
  keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  boolean: /\b(true|false)\b/,
  function: /[a-z0-9_]+(?=\()/i,
  number: /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
  operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
  punctuation: /[{}[\];(),.:]/
};
(Prism.languages.javascript = Prism.languages.extend("clike", {
  keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
  number: /\b-?(0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
  function: /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
  operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
})), Prism.languages.insertBefore("javascript", "keyword", {
  regex: {
    pattern: /(^|[^\/])\/(?!\/)(\[[^\]\r\n]+]|\\.|[^\/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
    lookbehind: !0,
    greedy: !0
  }
}), Prism.languages.insertBefore("javascript", "string", {
  "template-string": {
    pattern: /`(?:\\\\|\\?[^\\])*?`/,
    greedy: !0,
    inside: {
      interpolation: {
        pattern: /\$\{[^}]+\}/,
        inside: {
          "interpolation-punctuation": {
            pattern: /^\$\{|\}$/,
            alias: "punctuation"
          },
          rest: Prism.languages.javascript
        }
      },
      string: /[\s\S]+/
    }
  }
}), Prism.languages.markup &&
  Prism.languages.insertBefore("markup", "tag", {
    script: {
      pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
      lookbehind: !0,
      inside: Prism.languages.javascript,
      alias: "language-javascript"
    }
  }), (Prism.languages.js = Prism.languages.javascript);
!(function(e) {
  var t = {
    variable: [
      {
        pattern: /\$?\(\([\s\S]+?\)\)/,
        inside: {
          variable: [
            { pattern: /(^\$\(\([\s\S]+)\)\)/, lookbehind: !0 },
            /^\$\(\(/
          ],
          number: /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee]-?\d+)?)\b/,
          operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
          punctuation: /\(\(?|\)\)?|,|;/
        }
      },
      {
        pattern: /\$\([^)]+\)|`[^`]+`/,
        inside: { variable: /^\$\(|^`|\)$|`$/ }
      },
      /\$(?:[a-z0-9_#\?\*!@]+|\{[^}]+\})/i
    ]
  };
  e.languages.bash = {
    shebang: {
      pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,
      alias: "important"
    },
    comment: { pattern: /(^|[^"{\\])#.*/, lookbehind: !0 },
    string: [
      {
        pattern: /((?:^|[^<])<<\s*)(?:"|')?(\w+?)(?:"|')?\s*\r?\n(?:[\s\S])*?\r?\n\2/g,
        lookbehind: !0,
        greedy: !0,
        inside: t
      },
      { pattern: /(["'])(?:\\\\|\\?[^\\])*?\1/g, greedy: !0, inside: t }
    ],
    variable: t.variable,
    function: {
      pattern: /(^|\s|;|\||&)(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|\s|;|\||&)/,
      lookbehind: !0
    },
    keyword: {
      pattern: /(^|\s|;|\||&)(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|\s|;|\||&)/,
      lookbehind: !0
    },
    boolean: {
      pattern: /(^|\s|;|\||&)(?:true|false)(?=$|\s|;|\||&)/,
      lookbehind: !0
    },
    operator: /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
    punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];]/
  };
  var a = t.variable[1].inside;
  (a["function"] = e.languages.bash["function"]), (a.keyword =
    e.languages.bash.keyword), (a.boolean =
    e.languages.bash.boolean), (a.operator =
    e.languages.bash.operator), (a.punctuation = e.languages.bash.punctuation);
})(Prism);
(Prism.languages.c = Prism.languages.extend("clike", {
  keyword: /\b(asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,
  operator: /\-[>-]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|?\||[~^%?*\/]/,
  number: /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)[ful]*\b/i
})), Prism.languages.insertBefore("c", "string", {
  macro: {
    pattern: /(^\s*)#\s*[a-z]+([^\r\n\\]|\\.|\\(?:\r\n?|\n))*/im,
    lookbehind: !0,
    alias: "property",
    inside: {
      string: {
        pattern: /(#\s*include\s*)(<.+?>|("|')(\\?.)+?\3)/,
        lookbehind: !0
      },
      directive: {
        pattern: /(#\s*)\b(define|elif|else|endif|error|ifdef|ifndef|if|import|include|line|pragma|undef|using)\b/,
        lookbehind: !0,
        alias: "keyword"
      }
    }
  },
  constant: /\b(__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|stdin|stdout|stderr)\b/
}), delete Prism.languages.c["class-name"], delete Prism.languages.c["boolean"];
(Prism.languages.csharp = Prism.languages.extend("clike", {
  keyword: /\b(abstract|as|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|virtual|void|volatile|while|add|alias|ascending|async|await|descending|dynamic|from|get|global|group|into|join|let|orderby|partial|remove|select|set|value|var|where|yield)\b/,
  string: [
    { pattern: /@("|')(\1\1|\\\1|\\?(?!\1)[\s\S])*\1/, greedy: !0 },
    { pattern: /("|')(\\?.)*?\1/, greedy: !0 }
  ],
  number: /\b-?(0x[\da-f]+|\d*\.?\d+f?)\b/i
})), Prism.languages.insertBefore("csharp", "keyword", {
  "generic-method": {
    pattern: /[a-z0-9_]+\s*<[^>\r\n]+?>\s*(?=\()/i,
    alias: "function",
    inside: {
      keyword: Prism.languages.csharp.keyword,
      punctuation: /[<>(),.:]/
    }
  },
  preprocessor: {
    pattern: /(^\s*)#.*/m,
    lookbehind: !0,
    alias: "property",
    inside: {
      directive: {
        pattern: /(\s*#)\b(define|elif|else|endif|endregion|error|if|line|pragma|region|undef|warning)\b/,
        lookbehind: !0,
        alias: "keyword"
      }
    }
  }
});
(Prism.languages.cpp = Prism.languages.extend("c", {
  keyword: /\b(alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
  boolean: /\b(true|false)\b/,
  operator: /[-+]{1,2}|!=?|<{1,2}=?|>{1,2}=?|\->|:{1,2}|={1,2}|\^|~|%|&{1,2}|\|?\||\?|\*|\/|\b(and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/
})), Prism.languages.insertBefore("cpp", "keyword", {
  "class-name": { pattern: /(class\s+)[a-z0-9_]+/i, lookbehind: !0 }
});
!(function(e) {
  e.languages.ruby = e.languages.extend("clike", {
    comment: [
      /#(?!\{[^\r\n]*?\}).*/,
      /^=begin(?:\r?\n|\r)(?:.*(?:\r?\n|\r))*?=end/m
    ],
    keyword: /\b(alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|false|for|if|in|module|new|next|nil|not|or|raise|redo|require|rescue|retry|return|self|super|then|throw|true|undef|unless|until|when|while|yield)\b/
  });
  var n = {
    pattern: /#\{[^}]+\}/,
    inside: {
      delimiter: { pattern: /^#\{|\}$/, alias: "tag" },
      rest: e.util.clone(e.languages.ruby)
    }
  };
  e.languages.insertBefore("ruby", "keyword", {
    regex: [
      {
        pattern: /%r([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1[gim]{0,3}/,
        greedy: !0,
        inside: { interpolation: n }
      },
      {
        pattern: /%r\((?:[^()\\]|\\[\s\S])*\)[gim]{0,3}/,
        greedy: !0,
        inside: { interpolation: n }
      },
      {
        pattern: /%r\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}[gim]{0,3}/,
        greedy: !0,
        inside: { interpolation: n }
      },
      {
        pattern: /%r\[(?:[^\[\]\\]|\\[\s\S])*\][gim]{0,3}/,
        greedy: !0,
        inside: { interpolation: n }
      },
      {
        pattern: /%r<(?:[^<>\\]|\\[\s\S])*>[gim]{0,3}/,
        greedy: !0,
        inside: { interpolation: n }
      },
      {
        pattern: /(^|[^\/])\/(?!\/)(\[.+?]|\\.|[^\/\\\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/,
        lookbehind: !0,
        greedy: !0
      }
    ],
    variable: /[@$]+[a-zA-Z_][a-zA-Z_0-9]*(?:[?!]|\b)/,
    symbol: /:[a-zA-Z_][a-zA-Z_0-9]*(?:[?!]|\b)/
  }), e.languages.insertBefore("ruby", "number", {
    builtin: /\b(Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|File|Fixnum|Float|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,
    constant: /\b[A-Z][a-zA-Z_0-9]*(?:[?!]|\b)/
  }), (e.languages.ruby.string = [
    {
      pattern: /%[qQiIwWxs]?([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1/,
      greedy: !0,
      inside: { interpolation: n }
    },
    {
      pattern: /%[qQiIwWxs]?\((?:[^()\\]|\\[\s\S])*\)/,
      greedy: !0,
      inside: { interpolation: n }
    },
    {
      pattern: /%[qQiIwWxs]?\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}/,
      greedy: !0,
      inside: { interpolation: n }
    },
    {
      pattern: /%[qQiIwWxs]?\[(?:[^\[\]\\]|\\[\s\S])*\]/,
      greedy: !0,
      inside: { interpolation: n }
    },
    {
      pattern: /%[qQiIwWxs]?<(?:[^<>\\]|\\[\s\S])*>/,
      greedy: !0,
      inside: { interpolation: n }
    },
    {
      pattern: /("|')(#\{[^}]+\}|\\(?:\r?\n|\r)|\\?.)*?\1/,
      greedy: !0,
      inside: { interpolation: n }
    }
  ]);
})(Prism);
(Prism.languages.java = Prism.languages.extend("clike", {
  keyword: /\b(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/,
  number: /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp\-]+\b|\b\d*\.?\d+(?:e[+-]?\d+)?[df]?\b/i,
  operator: {
    pattern: /(^|[^.])(?:\+[+=]?|-[-=]?|!=?|<<?=?|>>?>?=?|==?|&[&=]?|\|[|=]?|\*=?|\/=?|%=?|\^=?|[?:~])/m,
    lookbehind: !0
  }
})), Prism.languages.insertBefore("java", "function", {
  annotation: { alias: "punctuation", pattern: /(^|[^.])@\w+/, lookbehind: !0 }
});
(Prism.languages.json = {
  property: /"(?:\\.|[^\\"])*"(?=\s*:)/gi,
  string: /"(?!:)(?:\\.|[^\\"])*"(?!:)/g,
  number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?)\b/g,
  punctuation: /[{}[\]);,]/g,
  operator: /:/g,
  boolean: /\b(true|false)\b/gi,
  null: /\bnull\b/gi
}), (Prism.languages.jsonp = Prism.languages.json);
(Prism.languages.markdown = Prism.languages.extend(
  "markup",
  {}
)), Prism.languages.insertBefore("markdown", "prolog", {
  blockquote: { pattern: /^>(?:[\t ]*>)*/m, alias: "punctuation" },
  code: [
    { pattern: /^(?: {4}|\t).+/m, alias: "keyword" },
    { pattern: /``.+?``|`[^`\n]+`/, alias: "keyword" }
  ],
  title: [
    {
      pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
      alias: "important",
      inside: { punctuation: /==+$|--+$/ }
    },
    {
      pattern: /(^\s*)#+.+/m,
      lookbehind: !0,
      alias: "important",
      inside: { punctuation: /^#+|#+$/ }
    }
  ],
  hr: {
    pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
    lookbehind: !0,
    alias: "punctuation"
  },
  list: {
    pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
    lookbehind: !0,
    alias: "punctuation"
  },
  "url-reference": {
    pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
    inside: {
      variable: { pattern: /^(!?\[)[^\]]+/, lookbehind: !0 },
      string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
      punctuation: /^[\[\]!:]|[<>]/
    },
    alias: "url"
  },
  bold: {
    pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: !0,
    inside: { punctuation: /^\*\*|^__|\*\*$|__$/ }
  },
  italic: {
    pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: !0,
    inside: { punctuation: /^[*_]|[*_]$/ }
  },
  url: {
    pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
    inside: {
      variable: { pattern: /(!?\[)[^\]]+(?=\]$)/, lookbehind: !0 },
      string: { pattern: /"(?:\\.|[^"\\])*"(?=\)$)/ }
    }
  }
}), (Prism.languages.markdown.bold.inside.url = Prism.util.clone(
  Prism.languages.markdown.url
)), (Prism.languages.markdown.italic.inside.url = Prism.util.clone(
  Prism.languages.markdown.url
)), (Prism.languages.markdown.bold.inside.italic = Prism.util.clone(
  Prism.languages.markdown.italic
)), (Prism.languages.markdown.italic.inside.bold = Prism.util.clone(
  Prism.languages.markdown.bold
));
Prism.languages.matlab = {
  string: /\B'(?:''|[^'\n])*'/,
  comment: [/%\{[\s\S]*?\}%/, /%.+/],
  number: /\b-?(?:\d*\.?\d+(?:[eE][+-]?\d+)?(?:[ij])?|[ij])\b/,
  keyword: /\b(?:break|case|catch|continue|else|elseif|end|for|function|if|inf|NaN|otherwise|parfor|pause|pi|return|switch|try|while)\b/,
  function: /(?!\d)\w+(?=\s*\()/,
  operator: /\.?[*^\/\\']|[+\-:@]|[<>=~]=?|&&?|\|\|?/,
  punctuation: /\.{3}|[.,;\[\](){}!]/
};
Prism.languages.objectivec = Prism.languages.extend("c", {
  keyword: /\b(asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|in|self|super)\b|(@interface|@end|@implementation|@protocol|@class|@public|@protected|@private|@property|@try|@catch|@finally|@throw|@synthesize|@dynamic|@selector)\b/,
  string: /("|')(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|@"(\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
  operator: /-[->]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|\|?|[~^%?*\/@]/
});
Prism.languages.ocaml = {
  comment: /\(\*[\s\S]*?\*\)/,
  string: [
    { pattern: /"(?:\\.|[^\\\r\n"])*"/, greedy: !0 },
    {
      pattern: /(['`])(?:\\(?:\d+|x[\da-f]+|.)|(?!\1)[^\\\r\n])\1/i,
      greedy: !0
    }
  ],
  number: /\b-?(?:0x[\da-f][\da-f_]+|(?:0[bo])?\d[\d_]*\.?[\d_]*(?:e[+-]?[\d_]+)?)/i,
  type: { pattern: /\B['`][a-z\d_]*/i, alias: "variable" },
  directive: { pattern: /\B#[a-z\d_]+/i, alias: "function" },
  keyword: /\b(?:as|assert|begin|class|constraint|do|done|downto|else|end|exception|external|for|fun|function|functor|if|in|include|inherit|initializer|lazy|let|match|method|module|mutable|new|object|of|open|prefix|private|rec|then|sig|struct|to|try|type|val|value|virtual|where|while|with)\b/,
  boolean: /\b(?:false|true)\b/,
  operator: /:=|[=<>@^|&+\-*\/$%!?~][!$%&\*+\-.\/:<=>?@^|~]*|\b(?:and|asr|land|lor|lxor|lsl|lsr|mod|nor|or)\b/,
  punctuation: /[(){}\[\]|_.,:;]/
};
(Prism.languages.php = Prism.languages.extend("clike", {
  keyword: /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
  constant: /\b[A-Z0-9_]{2,}\b/,
  comment: { pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/, lookbehind: !0 }
})), Prism.languages.insertBefore("php", "class-name", {
  "shell-comment": { pattern: /(^|[^\\])#.*/, lookbehind: !0, alias: "comment" }
}), Prism.languages.insertBefore("php", "keyword", {
  delimiter: { pattern: /\?>|<\?(?:php|=)?/i, alias: "important" },
  variable: /\$\w+\b/i,
  package: {
    pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
    lookbehind: !0,
    inside: { punctuation: /\\/ }
  }
}), Prism.languages.insertBefore("php", "operator", {
  property: { pattern: /(->)[\w]+/, lookbehind: !0 }
}), Prism.languages.markup &&
  (
    Prism.hooks.add("before-highlight", function(e) {
      "php" === e.language &&
        /(?:<\?php|<\?)/gi.test(e.code) &&
        (
          (e.tokenStack = []),
          (e.backupCode = e.code),
          (e.code = e.code.replace(
            /(?:<\?php|<\?)[\s\S]*?(?:\?>|$)/gi,
            function(a) {
              for (
                var n = e.tokenStack.length;
                -1 !== e.backupCode.indexOf("___PHP" + n + "___");

              )
                ++n;
              return (e.tokenStack[n] = a), "___PHP" + n + "___";
            }
          )),
          (e.grammar = Prism.languages.markup)
        );
    }),
    Prism.hooks.add("before-insert", function(e) {
      "php" === e.language &&
        e.backupCode &&
        ((e.code = e.backupCode), delete e.backupCode);
    }),
    Prism.hooks.add("after-highlight", function(e) {
      if ("php" === e.language && e.tokenStack) {
        e.grammar = Prism.languages.php;
        for (var a = 0, n = Object.keys(e.tokenStack); a < n.length; ++a) {
          var t = n[a],
            r = e.tokenStack[t];
          e.highlightedCode = e.highlightedCode.replace(
            "___PHP" + t + "___",
            '<span class="token php language-php">' +
              Prism.highlight(r, e.grammar, "php").replace(/\$/g, "$$$$") +
              "</span>"
          );
        }
        e.element.innerHTML = e.highlightedCode;
      }
    })
  );
Prism.languages.insertBefore("php", "variable", {
  this: /\$this\b/,
  global: /\$(?:_(?:SERVER|GET|POST|FILES|REQUEST|SESSION|ENV|COOKIE)|GLOBALS|HTTP_RAW_POST_DATA|argc|argv|php_errormsg|http_response_header)/,
  scope: {
    pattern: /\b[\w\\]+::/,
    inside: { keyword: /(static|self|parent)/, punctuation: /(::|\\)/ }
  }
});
(Prism.languages.powershell = {
  comment: [
    { pattern: /(^|[^`])<#[\s\S]*?#>/, lookbehind: !0 },
    { pattern: /(^|[^`])#.*/, lookbehind: !0 }
  ],
  string: [
    {
      pattern: /"(`?[\s\S])*?"/,
      greedy: !0,
      inside: { function: { pattern: /[^`]\$\(.*?\)/, inside: {} } }
    },
    { pattern: /'([^']|'')*'/, greedy: !0 }
  ],
  namespace: /\[[a-z][\s\S]*?\]/i,
  boolean: /\$(true|false)\b/i,
  variable: /\$\w+\b/i,
  function: [
    /\b(Add-(Computer|Content|History|Member|PSSnapin|Type)|Checkpoint-Computer|Clear-(Content|EventLog|History|Item|ItemProperty|Variable)|Compare-Object|Complete-Transaction|Connect-PSSession|ConvertFrom-(Csv|Json|StringData)|Convert-Path|ConvertTo-(Csv|Html|Json|Xml)|Copy-(Item|ItemProperty)|Debug-Process|Disable-(ComputerRestore|PSBreakpoint|PSRemoting|PSSessionConfiguration)|Disconnect-PSSession|Enable-(ComputerRestore|PSBreakpoint|PSRemoting|PSSessionConfiguration)|Enter-PSSession|Exit-PSSession|Export-(Alias|Clixml|Console|Csv|FormatData|ModuleMember|PSSession)|ForEach-Object|Format-(Custom|List|Table|Wide)|Get-(Alias|ChildItem|Command|ComputerRestorePoint|Content|ControlPanelItem|Culture|Date|Event|EventLog|EventSubscriber|FormatData|Help|History|Host|HotFix|Item|ItemProperty|Job|Location|Member|Module|Process|PSBreakpoint|PSCallStack|PSDrive|PSProvider|PSSession|PSSessionConfiguration|PSSnapin|Random|Service|TraceSource|Transaction|TypeData|UICulture|Unique|Variable|WmiObject)|Group-Object|Import-(Alias|Clixml|Csv|LocalizedData|Module|PSSession)|Invoke-(Command|Expression|History|Item|RestMethod|WebRequest|WmiMethod)|Join-Path|Limit-EventLog|Measure-(Command|Object)|Move-(Item|ItemProperty)|New-(Alias|Event|EventLog|Item|ItemProperty|Module|ModuleManifest|Object|PSDrive|PSSession|PSSessionConfigurationFile|PSSessionOption|PSTransportOption|Service|TimeSpan|Variable|WebServiceProxy)|Out-(Default|File|GridView|Host|Null|Printer|String)|Pop-Location|Push-Location|Read-Host|Receive-(Job|PSSession)|Register-(EngineEvent|ObjectEvent|PSSessionConfiguration|WmiEvent)|Remove-(Computer|Event|EventLog|Item|ItemProperty|Job|Module|PSBreakpoint|PSDrive|PSSession|PSSnapin|TypeData|Variable|WmiObject)|Rename-(Computer|Item|ItemProperty)|Reset-ComputerMachinePassword|Resolve-Path|Restart-(Computer|Service)|Restore-Computer|Resume-(Job|Service)|Save-Help|Select-(Object|String|Xml)|Send-MailMessage|Set-(Alias|Content|Date|Item|ItemProperty|Location|PSBreakpoint|PSDebug|PSSessionConfiguration|Service|StrictMode|TraceSource|Variable|WmiInstance)|Show-(Command|ControlPanelItem|EventLog)|Sort-Object|Split-Path|Start-(Job|Process|Service|Sleep|Transaction)|Stop-(Computer|Job|Process|Service)|Suspend-(Job|Service)|Tee-Object|Test-(ComputerSecureChannel|Connection|ModuleManifest|Path|PSSessionConfigurationFile)|Trace-Command|Unblock-File|Undo-Transaction|Unregister-(Event|PSSessionConfiguration)|Update-(FormatData|Help|List|TypeData)|Use-Transaction|Wait-(Event|Job|Process)|Where-Object|Write-(Debug|Error|EventLog|Host|Output|Progress|Verbose|Warning))\b/i,
    /\b(ac|cat|chdir|clc|cli|clp|clv|compare|copy|cp|cpi|cpp|cvpa|dbp|del|diff|dir|ebp|echo|epal|epcsv|epsn|erase|fc|fl|ft|fw|gal|gbp|gc|gci|gcs|gdr|gi|gl|gm|gp|gps|group|gsv|gu|gv|gwmi|iex|ii|ipal|ipcsv|ipsn|irm|iwmi|iwr|kill|lp|ls|measure|mi|mount|move|mp|mv|nal|ndr|ni|nv|ogv|popd|ps|pushd|pwd|rbp|rd|rdr|ren|ri|rm|rmdir|rni|rnp|rp|rv|rvpa|rwmi|sal|saps|sasv|sbp|sc|select|set|shcm|si|sl|sleep|sls|sort|sp|spps|spsv|start|sv|swmi|tee|trcm|type|write)\b/i
  ],
  keyword: /\b(Begin|Break|Catch|Class|Continue|Data|Define|Do|DynamicParam|Else|ElseIf|End|Exit|Filter|Finally|For|ForEach|From|Function|If|InlineScript|Parallel|Param|Process|Return|Sequence|Switch|Throw|Trap|Try|Until|Using|Var|While|Workflow)\b/i,
  operator: {
    pattern: /(\W?)(!|-(eq|ne|gt|ge|lt|le|sh[lr]|not|b?(and|x?or)|(Not)?(Like|Match|Contains|In)|Replace|Join|is(Not)?|as)\b|-[-=]?|\+[+=]?|[*\/%]=?)/i,
    lookbehind: !0
  },
  punctuation: /[|{}[\];(),.]/
}), (Prism.languages.powershell.string[0].inside.boolean =
  Prism.languages.powershell.boolean), (Prism.languages.powershell.string[0].inside.variable =
  Prism.languages.powershell.variable), (Prism.languages.powershell.string[0].inside.function.inside = Prism.util.clone(
  Prism.languages.powershell
));
Prism.languages.python = {
  "triple-quoted-string": {
    pattern: /"""[\s\S]+?"""|'''[\s\S]+?'''/,
    alias: "string"
  },
  comment: { pattern: /(^|[^\\])#.*/, lookbehind: !0 },
  string: { pattern: /("|')(?:\\\\|\\?[^\\\r\n])*?\1/, greedy: !0 },
  function: {
    pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g,
    lookbehind: !0
  },
  "class-name": { pattern: /(\bclass\s+)[a-z0-9_]+/i, lookbehind: !0 },
  keyword: /\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|with|yield)\b/,
  boolean: /\b(?:True|False)\b/,
  number: /\b-?(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
  operator: /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/,
  punctuation: /[{}[\];(),.:]/
};
!(function(a) {
  var e = a.util.clone(a.languages.javascript);
  (a.languages.jsx = a.languages.extend(
    "markup",
    e
  )), (a.languages.jsx.tag.pattern = /<\/?[\w\.:-]+\s*(?:\s+(?:[\w\.:-]+(?:=(?:("|')(\\?[\s\S])*?\1|[^\s'">=]+|(\{[\s\S]*?\})))?|\{\.{3}\w+\}))*\s*\/?>/i), (a.languages.jsx.tag.inside[
    "attr-value"
  ].pattern = /=(?!\{)(?:('|")[\s\S]*?(\1)|[^\s>]+)/i), a.languages.insertBefore(
    "inside",
    "attr-name",
    {
      spread: {
        pattern: /\{\.{3}\w+\}/,
        inside: { punctuation: /\{|\}|\./, "attr-value": /\w+/ }
      }
    },
    a.languages.jsx.tag
  );
  var s = a.util.clone(a.languages.jsx);
  delete s.punctuation, (s = a.languages.insertBefore(
    "jsx",
    "operator",
    { punctuation: /=(?={)|[{}[\];(),.:]/ },
    { jsx: s }
  )), a.languages.insertBefore(
    "inside",
    "attr-value",
    {
      script: {
        pattern: /=(\{(?:\{[^}]*\}|[^}])+\})/i,
        inside: s,
        alias: "language-javascript"
      }
    },
    a.languages.jsx.tag
  );
})(Prism);
Prism.languages.sql = {
  comment: {
    pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
    lookbehind: !0
  },
  string: {
    pattern: /(^|[^@\\])("|')(?:\\?[\s\S])*?\2/,
    greedy: !0,
    lookbehind: !0
  },
  variable: /@[\w.$]+|@("|'|`)(?:\\?[\s\S])+?\1/,
  function: /\b(?:COUNT|SUM|AVG|MIN|MAX|FIRST|LAST|UCASE|LCASE|MID|LEN|ROUND|NOW|FORMAT)(?=\s*\()/i,
  keyword: /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR VARYING|CHARACTER (?:SET|VARYING)|CHARSET|CHECK|CHECKPOINT|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMN|COLUMNS|COMMENT|COMMIT|COMMITTED|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS|CONTAINSTABLE|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|DATA(?:BASES?)?|DATE(?:TIME)?|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITER(?:S)?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE(?: PRECISION)?|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE KEY|ELSE|ENABLE|ENCLOSED BY|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPE(?:D BY)?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|IDENTITY(?:_INSERT|COL)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTO|INVOKER|ISOLATION LEVEL|JOIN|KEYS?|KILL|LANGUAGE SQL|LAST|LEFT|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MODIFIES SQL DATA|MODIFY|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL(?: CHAR VARYING| CHARACTER(?: VARYING)?| VARCHAR)?|NATURAL|NCHAR(?: VARCHAR)?|NEXT|NO(?: SQL|CHECK|CYCLE)?|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READ(?:S SQL DATA|TEXT)?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEATABLE|REPLICATION|REQUIRE|RESTORE|RESTRICT|RETURNS?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE MODE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|START(?:ING BY)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED BY|TEXT(?:SIZE)?|THEN|TIMESTAMP|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNPIVOT|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?)\b/i,
  boolean: /\b(?:TRUE|FALSE|NULL)\b/i,
  number: /\b-?(?:0x)?\d*\.?[\da-f]+\b/,
  operator: /[-+*\/=%^~]|&&?|\|?\||!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|IN|LIKE|NOT|OR|IS|DIV|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
  punctuation: /[;[\]()`,.]/
};
(Prism.languages.swift = Prism.languages.extend("clike", {
  string: {
    pattern: /("|')(\\(?:\((?:[^()]|\([^)]+\))+\)|\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0,
    inside: {
      interpolation: {
        pattern: /\\\((?:[^()]|\([^)]+\))+\)/,
        inside: { delimiter: { pattern: /^\\\(|\)$/, alias: "variable" } }
      }
    }
  },
  keyword: /\b(as|associativity|break|case|catch|class|continue|convenience|default|defer|deinit|didSet|do|dynamic(?:Type)?|else|enum|extension|fallthrough|final|for|func|get|guard|if|import|in|infix|init|inout|internal|is|lazy|left|let|mutating|new|none|nonmutating|operator|optional|override|postfix|precedence|prefix|private|Protocol|public|repeat|required|rethrows|return|right|safe|self|Self|set|static|struct|subscript|super|switch|throws?|try|Type|typealias|unowned|unsafe|var|weak|where|while|willSet|__(?:COLUMN__|FILE__|FUNCTION__|LINE__))\b/,
  number: /\b([\d_]+(\.[\de_]+)?|0x[a-f0-9_]+(\.[a-f0-9p_]+)?|0b[01_]+|0o[0-7_]+)\b/i,
  constant: /\b(nil|[A-Z_]{2,}|k[A-Z][A-Za-z_]+)\b/,
  atrule: /@\b(IB(?:Outlet|Designable|Action|Inspectable)|class_protocol|exported|noreturn|NS(?:Copying|Managed)|objc|UIApplicationMain|auto_closure)\b/,
  builtin: /\b([A-Z]\S+|abs|advance|alignof(?:Value)?|assert|contains|count(?:Elements)?|debugPrint(?:ln)?|distance|drop(?:First|Last)|dump|enumerate|equal|filter|find|first|getVaList|indices|isEmpty|join|last|lexicographicalCompare|map|max(?:Element)?|min(?:Element)?|numericCast|overlaps|partition|print(?:ln)?|reduce|reflect|reverse|sizeof(?:Value)?|sort(?:ed)?|split|startsWith|stride(?:of(?:Value)?)?|suffix|swap|toDebugString|toString|transcode|underestimateCount|unsafeBitCast|with(?:ExtendedLifetime|Unsafe(?:MutablePointers?|Pointers?)|VaList))\b/
})), (Prism.languages.swift.string.inside.interpolation.inside.rest = Prism.util.clone(
  Prism.languages.swift
));
(Prism.languages.typescript = Prism.languages.extend("javascript", {
  keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield|false|true|module|declare|constructor|string|Function|any|number|boolean|Array|enum|symbol|namespace|abstract|require|type)\b/
})), (Prism.languages.ts = Prism.languages.typescript);
Prism.languages.yaml = {
  scalar: {
    pattern: /([\-:]\s*(![^\s]+)?[ \t]*[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)[^\r\n]+(?:\3[^\r\n]+)*)/,
    lookbehind: !0,
    alias: "string"
  },
  comment: /#.*/,
  key: {
    pattern: /(\s*(?:^|[:\-,[{\r\n?])[ \t]*(![^\s]+)?[ \t]*)[^\r\n{[\]},#\s]+?(?=\s*:\s)/,
    lookbehind: !0,
    alias: "atrule"
  },
  directive: { pattern: /(^[ \t]*)%.+/m, lookbehind: !0, alias: "important" },
  datetime: {
    pattern: /([:\-,[{]\s*(![^\s]+)?[ \t]*)(\d{4}-\d\d?-\d\d?([tT]|[ \t]+)\d\d?:\d{2}:\d{2}(\.\d*)?[ \t]*(Z|[-+]\d\d?(:\d{2})?)?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(:\d{2}(\.\d*)?)?)(?=[ \t]*($|,|]|}))/m,
    lookbehind: !0,
    alias: "number"
  },
  boolean: {
    pattern: /([:\-,[{]\s*(![^\s]+)?[ \t]*)(true|false)[ \t]*(?=$|,|]|})/im,
    lookbehind: !0,
    alias: "important"
  },
  null: {
    pattern: /([:\-,[{]\s*(![^\s]+)?[ \t]*)(null|~)[ \t]*(?=$|,|]|})/im,
    lookbehind: !0,
    alias: "important"
  },
  string: {
    pattern: /([:\-,[{]\s*(![^\s]+)?[ \t]*)("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')(?=[ \t]*($|,|]|}))/m,
    lookbehind: !0,
    greedy: !0
  },
  number: {
    pattern: /([:\-,[{]\s*(![^\s]+)?[ \t]*)[+\-]?(0x[\da-f]+|0o[0-7]+|(\d+\.?\d*|\.?\d+)(e[\+\-]?\d+)?|\.inf|\.nan)[ \t]*(?=$|,|]|})/im,
    lookbehind: !0
  },
  tag: /![^\s]+/,
  important: /[&*][\w]+/,
  punctuation: /---|[:[\]{}\-,|>?]|\.\.\./
};

const PrismComponent = React.createClass({
  statics: {
    _
  },
  getDefaultProps() {
    return {
      language: "javascript"
    };
  },
  render() {
    const lines = [];
    if (this.props.line) {
      this.props.line.split(",").forEach(range => {
        const parts = range.split("-");
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
      <pre className={"prism language-" + this.props.language}>
        {Token.reactify(_.tokenize(this.props.children, grammar))}
        {lines.map((line, ii) => {
          return (
            <div
              className="line-highlight"
              key={ii}
              style={{ height: 20, top: 20 * (line - 1) }}
            />
          );
        })}
      </pre>
    );
  }
});

module.exports = PrismComponent;
