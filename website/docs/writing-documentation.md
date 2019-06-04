---
id: writing-documentation
title: Writing Documentation
---

Next, let's touch on the powerful feature in Docusaurus - documentation.

## Using Markdown

Create a new file within the `docs` directory called `hello.md` with the following contents:

```markdown
---
title: Hello
---

I can write content using [GitHub-flavored Markdown syntax](https://github.github.com/gfm/).

## Markdown Syntax

**Bold** _italic_ `code` [Links](#url)

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse id sem consectetuer libero luctus adipiscing.

- Hey
- Ho
- Let's Go
```

Docusaurus supports Markdown syntax using [Remark](https://github.com/remarkjs/remark) for Markdown parser and is extensible via plugins.

## Embedding React Components

Did you know that you can now write React components within your Markdown files? This is possible because of [MDX](https://mdxjs.com), which allows you to write JSX within your Markdown documents.

Now we'll add a third-party chart component into the Markdown file created above. Before that, kill your web server (<kbd>Cmd</kbd> + <kbd>C</kbd> or <kbd>Ctrl</kbd> + <kbd>C</kbd>) if it's running and install `react-trend` in your website directory.

```bash
npm install react-trend
```

Start the development server again and go to http://localhost:3000/docs/hello, you will see a new page created from the Markdown file.

Edit `docs/hello.md` and append the following:

```jsx
import Trend from 'react-trend';

_Here's a bar chart!_

<Trend
  smooth
  autoDraw
  autoDrawDuration={3000}
  autoDrawEasing="ease-out"
  data={[0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]}
  gradient={['#00c6ff', '#F0F', '#FF0']}
  radius={10}
  strokeWidth={2}
  strokeLinecap={'butt'}
/>
```

Save the file and notice that the site is hot-reloaded with the edited content.

We just imported a React component and embedded it within our markdown 😉!

<!-- TODO: Briefly explain MDX more -->

## Sidebar

Next, let's add this page to the sidebar.

Edit the `sidebars.json` file and add the `hello` document.

```diff
{
  "docs": {
+   "Getting started": ["hello"],
    "Docusaurus": ["doc1"],
    "First Category": ["doc2"],
    "Second Category": ["doc3"]
  },
  "docs-other": {
    "First Category": ["doc4", "doc5"]
  }
}
```

You can see that there is a sidebar now on http://localhost:3000/docs/hello.

<!-- TODO: Briefly sidebar more -->

<!--
TODO: Talk more about using the official docs plugin and how to configure the sidebar. Mention about incorporating assets and a preview of the cool Markdown features available, but don't list all the Markdown features here.

References:
- https://docusaurus.io/docs/en/navigation
-->
