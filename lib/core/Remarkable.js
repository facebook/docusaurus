'use strict';

const React = require('react');
const hljs = require('highlight.js')
const Markdown = require('Remarkable');
const toSlug = require("./toSlug.js");

function anchors(md) {
  md.renderer.rules.heading_open = function(tokens, idx /*, options, env */) {
    return '<h' + tokens[idx].hLevel + '>' + '<a class="anchor" name="' + toSlug(tokens[idx+1].content) + '"></a>';
  };
  md.renderer.rules.heading_close = function(tokens, idx /*, options, env */) {
    return ' <a class="hash-link" href="#' + toSlug(tokens[idx-1].content) + '">#</a>' + '</h' + tokens[idx].hLevel + '>\n';
  };
}

// Reason is not currently supported by the hljs npm package
hljs.registerLanguage('reason', function(hljs) {
  var SWIFT_KEYWORDS = {
    forDocGrammarHighlighting: 'ifTrue ifFalse expression testCondition startVal endVal typeConstraint typeName typeFactoryName argOneType argTwoType finalArgType typeStructure typeParam typeArg1 typeArg2 typeParam1 typeParam2 argOne argTwo finalArg argument argumentType expressionType identifier',
    keyword: 'class deinit enum extension func import init rec class let pub pri val inherit ref mutable protocol static ' +
      'module include struct subscript type typealias var break case continue default do ' +
      'else fallthrough if in of for to downto return switch where while as dynamicType ' +
      'is new super self Self Type __COLUMN__ __FILE__ __FUNCTION__ ' +
      '__LINE__ associativity didSet get infix inout left mutating none ' +
      'nonmutating operator override postfix precedence prefix => right set '+
      'unowned unowned safe unsafe weak willSet',
    literal: 'true false nil',
    built_in: 'abs advance alignof alignofValue assert bridgeFromObjectiveC ' +
      'bridgeFromObjectiveCUnconditional bridgeToObjectiveC ' +
      'bridgeToObjectiveCUnconditional c contains count countElements ' +
      'countLeadingZeros debugPrint debugPrintln distance dropFirst dropLast dump ' +
      'encodeBitsAsWords enumerate equal filter find getBridgedObjectiveCType ' +
      'getVaList indices insertionSort isBridgedToObjectiveC ' +
      'isBridgedVerbatimToObjectiveC isUniquelyReferenced join ' +
      'lexicographicalCompare map max maxElement min minElement numericCast ' +
      'partition posix print println quickSort reduce reflect reinterpretCast ' +
      'reverse roundUpToAlignment sizeof sizeofValue sort split startsWith strideof ' +
      'strideofValue swap swift toString transcode underestimateCount ' +
      'unsafeReflect withExtendedLifetime withObjectAtPlusZero withUnsafePointer ' +
      'withUnsafePointerToObject withUnsafePointers withVaList'
  };

  var TYPE = {
    className: 'type',
    begin: '\\b[A-Z][\\w\']*',
    relevance: 0
  };
  var BLOCK_COMMENT = hljs.COMMENT(
    '/\\*',
    '\\*/',
    {
      contains: ['self']
    }
  );
  var SUBST = {
    className: 'subst',
    begin: /\\\(/, end: '\\)',
    keywords: SWIFT_KEYWORDS,
    contains: [] // assigned later
  };
  var NUMBERS = {
      className: 'number',
      begin: '\\b([\\d_]+(\\.[\\deE_]+)?|0x[a-fA-F0-9_]+(\\.[a-fA-F0-9p_]+)?|0b[01_]+|0o[0-7_]+)\\b',
      relevance: 0
  };
  var QUOTE_STRING_MODE = hljs.inherit(hljs.QUOTE_STRING_MODE, {
    contains: [SUBST, hljs.BACKSLASH_ESCAPE]
  });
  SUBST.contains = [NUMBERS];

  return {
    keywords: SWIFT_KEYWORDS,
    contains: [
      QUOTE_STRING_MODE,
      hljs.C_LINE_COMMENT_MODE,
      BLOCK_COMMENT,
      TYPE,
      NUMBERS,
      {
        className: 'func',
        beginKeywords: 'fun', end: '=>', excludeEnd: true,
        contains: [
          hljs.inherit(hljs.TITLE_MODE, {
            begin: /[A-Za-z$_][0-9A-Za-z$_]*/,
            illegal: /\(/
          }),
          {
            className: 'generics',
            begin: /</, end: />/,
            illegal: />/
          },
          {
            className: 'params',
            begin: /\s/, end: /\=\>/, endsParent: true, excludeEnd: true,
            keywords: SWIFT_KEYWORDS,
            contains: [
              'self',
              NUMBERS,
              QUOTE_STRING_MODE,
              hljs.C_BLOCK_COMMENT_MODE,
              {begin: ':'} // relevance booster
            ],
            illegal: /["]/
          }
        ],
        illegal: /\[|%/
      },
      {
        className: 'class',
        beginKeywords: 'module struct protocol class extension enum',
        keywords: SWIFT_KEYWORDS,
        end: '\\{',
        excludeEnd: true,
        contains: [
          hljs.inherit(hljs.TITLE_MODE, {begin: /[A-Za-z$_][0-9A-Za-z$_]*/})
        ]
      },
      {
        className: 'preprocessor', // @attributes
        begin: '(@assignment|@class_protocol|@exported|@final|@lazy|@noreturn|' +
                  '@NSCopying|@NSManaged|@objc|@optional|@required|@auto_closure|' +
                  '@noreturn|@IBAction|@IBDesignable|@IBInspectable|@IBOutlet|' +
                  '@infix|@prefix|@postfix)'
      }
    ]
  };
});

class Remarkable extends React.Component {

  render() {
    var Container = this.props.container;

    return (
      <Container>
        {this.content()}
      </Container>
    );
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.options !== this.props.options) {
      this.md = new Markdown(nextProps.options);
    }
  }

  content() {
    if (this.props.source) {
      return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(this.props.source) }} />;
    }
    else {
      return React.Children.map(this.props.children, child => {
        if (typeof child === 'string') {
          return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(child) }} />;
        }
        else {
          return child;
        }
      });
    }
  }

  renderMarkdown(source) {
    if (!this.md) {
      this.md = new Markdown({
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value;
            } catch (err) {}
          }
      
          try {
            return hljs.highlightAuto(str).value;
          } catch (err) {}
      
          return ''; // use external default escaping
        }
      });

      // Register anchors plugin
      this.md.use(anchors);
    }

    return this.md.render(source);
  }
}

Remarkable.defaultProps = {
  container: 'div',
  options: {},
};

module.exports = Remarkable;