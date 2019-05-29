---
id: writing-documentation
title: Writing Documentation
---

Next, let's touch on the powerful documentation system in Docusaurus. Before that, kill your webserver (Cmd + C or Ctrl + C) and install react-trend in your website directory

```bash
yarn add react-trend
```

Create a new file `docs/hello.md` with below content

```md
---
title: Hello
---

I can write content using [GitHub-flavored Markdown syntax](https://github.github.com/gfm/).



## Markdown Syntax

**Bold** _italic_ `code` [Links](#url)

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

* Hey
* Ho
* Let's Go
```

Start the development server again

```bash
yarn start
```

Now go to http://localhost:3000/docs/hello, you will see a new page created from the markdown file.


Now edit the `docs/hello.md` and append the following:

```md
import Trend from 'react-trend';

<Trend
  smooth
  autoDraw
  autoDrawDuration={3000}
  autoDrawEasing="ease-out"
  data={[0,2,5,9,5,10,3,5,0,0,1,8,2,9,0]}
  gradient={['#00c6ff', '#F0F', '#FF0']}
  radius={10}
  strokeWidth={2}
  strokeLinecap={'butt'}
/>
```

Save the file and notice that the site is hot-reloaded with the edited content.


And we just imported a React component and embed it inside our markdown 😉 

Next, let's add a sidebar

Edit the `sidebars.json` file and make sure this "hello" document is added

```json
{
  "docs": {
    "Getting started": ["hello"],
    "Docusaurus": ["doc1"],
    "First Category": ["doc2"],
    "Second Category": ["doc3"]
  },
  "docs-other": {
    "First Category": ["doc4", "doc5"]
  }
}

```

You can see that there is a sidebar now on http://localhost:3000/docs/hello
