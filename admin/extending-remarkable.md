Docusaurus uses [Remarkable](https://github.com/jonschlinkert/remarkable) to convert plain markdown text into HTML. This document covers how one may extend Remarkable to provide custom functionality. While the document focuses on extending Remarkable in implementation, the theory should apply in general to any markdown parser.

## Why extend Remarkable?

Users of GitHub Pages have come to expect certain features provided by GitHub Flavored Markdown. One such example would be heading anchors, where every sub-header has an associated anchor that matches the heading text. This makes it possible to link to a specific section in a document by passing a fragment that matches the heading. For example, to link to this very section, you may create a link like so:

```
    [Link to this section](#why-extend-remarkable)
```

## A Brief Overview of How A Markdown Parser/Renderer Works

This is a summary of the basic concepts you'll need to understand in order to extend Remarkable, based on the [Remarkable docs](https://github.com/jonschlinkert/remarkable/tree/master/docs) as well as our own experience extending Remarkable to support GFM-style heading anchors.

As the heading here implies, there's two main parts to how a markdown parser works: the parsing phase, and the rendering phase. During the parsing phase, a plain markdown document is parsed into a set of tokens that describe its structure. These tokens are then used by the renderer to output the actual HTML contents.

### Parsing Markdown into Tokens

Let's talk a bit more about what is done as part of the parsing stage. The result of this stage is a tree made up of tokens. There's three types of tokens: inline, block, and core.

#### Inline tokens

Inline tokens are simple tokens that have text as a child. They are leaf nodes, and do not support having additional tokens within. An example of this might be `_emphasized text_`, which might be represented as a token of type `em` with contents of `emphasized text`.

#### Block tokens

A block token is a bit more complex. It may wrap one or more tokens, and can span more than one line of text. An example of this is the heading token:

```
### Hi there
```

The plain markdown text above would be parsed into three tokens:

- `heading_open`: Marks the beginning of the heading. May have additional props, such as `hLevel: 3` (heading level) in this case.
- `text`: Plain text token, with a value of "Hi there".
- `heading_close`: Marks the end of the heading. In this case, it would also have a `hLevel: 3` prop.

This is a basic example, because it contains a simple `text` token within the opening and closing tags. A common block encountered in markdown is the paragraph, which might be tokenized into a series of tokens such as `paragraph_open`, one or more `text` tokens, `link` tokens (if links are present within the text, for example), and, eventually, a `paragraph_close` token.

#### Core tokens

These are outside of the initial scope of this article for now. Core tokens may be [reference-style links](https://github.github.com/gfm/#link-reference-definitions), which can appear anywhere in a markdown document.

### Rendering Tokens into HTML

After we have parsed everything into tokens, we go to the rendering phase. This is where we convert our `heading_open`, `text`, and `heading_close` tokens from earlier into `<h3>Hi there</h3>`. This should be self-explanatory.

## Creating a Remarkable Extension

Now that you have a better idea of how parsing/rendering works, we can proceed to create a simple extension that renders heading anchors. First we need to determine if we need to extend the parser, or the renderer. In this case, we're only interested in changing how a heading is rendered to HTML, so we'll just need to override the heading renderers.

The default heading renderers may look like this (you can refer to the Remarkable source code here):

```
md.renderer.rules.heading_open = function(tokens, idx /*, options, env */) {
  return '<h' + tokens[idx].hLevel + '>';
};

md.renderer.rules.heading_close = function(tokens, idx /*, options, env */) {
  return '</h' + tokens[idx].hLevel + '>\n';
};
```

That's pretty straightforward: whenever these tokens are found, we render a `<hN>` or `</hN>` HTML tag, where N is the `hLevel` for this heading. That would result in `<h3>Hi there</h3>` being output. But what we want is something closer to this:

```
<h3><a class="anchor" name="hi-there"></a>Hi there <a class="hash-link" href="#hi-there">#</a></h3>
```

In that case, we need to override our heading rules like so:

```
md.renderer.rules.heading_open = function(tokens, idx /*, options, env */) {
  return '<h' + tokens[idx].hLevel + '>' + '<a class="anchor" name="' + toSlug(tokens[idx+1].content) + '"></a>';
};

md.renderer.rules.heading_close = function(tokens, idx /*, options, env */) {
  return ' <a class="hash-link" href="#' + toSlug(tokens[idx-1].content) + '">#</a>' + '</h' + tokens[idx].hLevel + '>\n';
};
```

Note that we are referring to `tokens[idx+1]` and `tokens[idx-1]` at various points in the code. In the case of `idx+1` in `heading_open`, it refers to the next token after `heading_open`, which is a `text` inline token. Same for `heading_close`, where we get the same `text` token by grabbing the preceding token. That's because we make a reasonable assumption that the markdown parser has generated three tokens for each of our headers as covered above.

### Using the Extension

We now need to tell Remarkable to use our extension. We can wrap our rules in a function called `anchors`:

```
function anchors(md) {
  md.renderer.rules.heading_open = function(tokens, idx /*, options, env */) {
    return '<h' + tokens[idx].hLevel + '>' + '<a class="anchor" name="' + toSlug(tokens[idx+1].content) + '"></a>';
  };

  md.renderer.rules.heading_close = function(tokens, idx /*, options, env */) {
    return ' <a class="hash-link" href="#' + toSlug(tokens[idx-1].content) + '">#</a>' + '</h' + tokens[idx].hLevel + '>\n';
  };
}
```

We can now tell Remarkable to load this function as a plugin (`md` is our instance of Remarkable):

```
this.md.use(anchors);
```

### Future Work

A more advanced extension might add additional parser rules. These rules may add support for new markdown syntax not covered by Remarkable. Say, for example, a custom syntax to embed video when a tag like `@video` is found can be supported by generating a new type of token, that is later used by the renderer to output the necessary `<embed>` HTML tags. This is left as an exercise to the reader for now.