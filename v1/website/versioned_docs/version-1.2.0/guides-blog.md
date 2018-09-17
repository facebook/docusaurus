---
id: version-1.2.0-blog
title: Adding a Blog
original_id: blog
---

## Initial Setup

To setup your site's blog, start by creating a `blog` directory within your repo's `website` directory.

Then, add a header link to your blog within `siteConfig.js`:

```js
headerLinks: [
    ...
    { blog: true, label: 'Blog' },
    ...
]
```

## Adding Posts

To publish in the blog, create a file within the blog directory with a formatted name of `YYYY-MM-DD-My-Blog-Post-Title.md`. The post date is extracted from the file name.

For example, at `website/blog/2017-08-18-Introducing-Docusaurus.md`:

```yml
---
author: Frank Li
authorURL: https://twitter.com/foobarbaz
authorFBID: 503283835
title: Introducing Docusaurus
---

Lorem Ipsum...
```

## Header Options

The only required field is `title`; however, we provide options to add author information to your blog post as well.

* `author` - The text label of the author byline.
* `authorURL` - The URL associated with the author. This could be a Twitter, GitHub, Facebook account, etc.
* `authorFBID` - The Facebook profile ID that is used to fetch the profile picture.
* `authorImageURL` - The URL to the author's image. (Note: If you use both `authorFBID` and `authorImageURL`, `authorFBID` will take precedence. Don't include `authorFBID` if you want `authorImageURL` to appear.)
* `title` - The blog post title.

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

## Changing How Many Blog Posts Show on Sidebar

By default, 5 recent blog posts are shown on the sidebar.

You can configure a specific amount of blog posts to show by adding a `blogSidebarCount` setting to your `siteConfig.js`.

The available options are an integer representing the number of posts you wish to show or a string with the value `'ALL'`.

Example:

```js
blogSidebarCount: 'ALL';
```

## RSS Feed

Docusaurus provides a simple RSS feed for your blog posts. Both RSS and Atom feed formats are supported. This data is automatically to your website page's HTML <HEAD> tag.

A summary of the post's text is provided in the RSS feed up to the `<!--truncate-->`. If no `<!--truncate-->` tag is found, then all text up 250 characters are used.

## Social Buttons

If you want Facebook and/or Twitter social buttons at the bottom of your blog posts, set the `facebookAppId` and/or `twitter` [site configuration](api-site-config.md) options in `siteConfig.js`.

## Advanced Topics

### I want to run in "Blog Only" mode.

You can run your Docusaurus site without a landing page and instead have your blog load first.

To do this:

1.  Create a file `index.html` in `website/static/`.
1.  Place the contents of the template below into `website/static/index.html`
1.  Customize the `<title>` of `website/static/index.html`
1.  Delete the dynamic landing page `website/pages/en/index.js`

> Now, when Docusaurus generates or builds your site, it will copy the file from `static/index.html` and place it in the site's main directory. The static file is served when a visitor arrives on your page. When the page loads it will redirect the visitor to `/blog`.

You can use this template:

```html
<!DOCTYPE HTML>
<html lang="en-US">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=blog/">
    <script type="text/javascript">
      window.location.href = 'blog/';
    </script>
    <title>Title of Your Blog</title>
  </head>
  <body>
    If you are not redirected automatically, follow this <a href="blog/">link</a>.
  </body>
</html>
```
