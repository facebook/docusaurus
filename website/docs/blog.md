---
id: blog
title: Blog
---

## Initial Setup

To setup your site's blog, start by creating a `blog` directory within your repo's `my-website` directory.

Then, add a navbar link to your blog within `docusaurus.config.js`:

```js
links: [
    ...
    {to: 'blog', label: 'Blog', position: 'left'}, // position: 'left' for creating Blog link on the left side of navbar, position: 'right' for creating Blog link on the right side of navbar
    ...
]
```

## Adding Posts

To publish in the blog, create a file within the blog directory with a formatted name of `YYYY-MM-DD-my-blog-post-title.md`. The post date is extracted from the file name.

For example, at `my-website/blog/2019-09-05-hello-docusaurus-v2.md`:

```yml
---
id: hello-docusaurus-v2
title: Welcome Docusaurus v2
author: Dattatreya Tripathy
authorTitle: Contributor of Docusaurus 2
authorURL: https://github.com/dt97
authorTwitter: CuriousDT
tags: [hello, docusaurus-v2]
---
Welcome to this blog. This blog is created with [**Docusaurus 2 alpha**]
(https://v2.docusaurus.io/).

<!--truncate-->

This is my first post on Docusaurus 2.

A whole bunch of exploration to follow.
```

## Header Options

The only required field is `title`; however, we provide options to add author information to your blog post as well along with other options.

- `author` - The text label of the author byline.
- `authorURL` - The URL associated with the author. This could be a Twitter, GitHub, Facebook account, etc.
- `authorFBID` - The Facebook profile ID that is used to fetch the profile picture.
- `authorImageURL` - The URL to the author's image. (Note: If you use both `authorFBID` and `authorImageURL`, `authorFBID` will take precedence. Don't include `authorFBID` if you want `authorImageURL` to appear.)
- `title` - The blog post title.
- `unlisted` - The post will be accessible by directly visiting the URL but will not show up in the sidebar in the final build; during local development, the post will still be listed. Useful in situations where you want to share a WIP post with others for feedback.

## Summary Truncation

Use the `<!--truncate-->` marker in your blog post to represent what will be shown as the summary when viewing all published blog posts. Anything above `<!--truncate-->` will be part of the summary. For example:

```yaml
---
title: Truncation Example
---
All this will be part of the blog post summary.

Even this.

<!--truncate-->

But anything from here on down will not be.

Not this.

Or this.
```

## Advanced Topics

### I want to run in "Blog Only" mode.

You can run your Docusaurus 2 site without a landing page and instead have your blog load first.

To do this:

1.  Create a file `index.html` in `my-website/static/`.
1.  Place the contents of the template below into `my-website/static/index.html`
1.  Customize the `<title>` of `my-website/static/index.html`
1.  Delete the dynamic landing page `my-website/src/pages/index.js`

> Now, when Docusaurus 2 generates or builds your site, it will copy the file from `static/index.html` and place it in the site's main directory. The static file is served when a visitor arrives on your page. When the page loads, it will redirect the visitor to `/blog`.

You can use this template:

```html
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=blog/" />
    <script type="text/javascript">
      window.location.href = 'blog/';
    </script>
    <title>Title of Your Blog</title>
  </head>
  <body>
    If you are not redirected automatically, follow this
    <a href="blog/">link</a>.
  </body>
</html>
```

<!--

Adding a blog using the blog plugin.

References
---
- [source code](/packages/docusaurus-plugin-content-blog/src/index.js)
- [v1 doc](https://docusaurus.io/docs/en/next/adding-blog)

-->
