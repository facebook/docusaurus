---
id: blog
title: Adding a Blog
---

## Initial Setup

To setup your site's blog, start by creating a `blog` folder within your repo's `website` directory.

Then, add a header link to your blog within `siteConfig.js`:

```
headerLinks: [
    ...
    {blog: true, label: 'Blog'},
    ...
]
```


## Adding Posts

To publish in the blog, create a file within the blog folder with a formatted name of `YYYY-MM-DD-My-Blog-Post-Title.md`. The post date is extracted from the file name.

For example, at `website/blog/2017-08-18-Introducing-Docusaurus.md`:

```
---
author: Frank Li
authorURL: https://twitter.com/foobarbaz
authorFBID: 503283835
title: Introducing Docusaurus
---

Lorem Ipusm..
```


## Header Options

The only required field is `title`; however, we provide options to add author information to your blog post as well.

- `author` - The text label of the author byline.
- `authorURL` - The url associated with the author. This could be a Twitter, GitHub, Facebook account, etc.
- `authorFBID` - The Facebook ID that is used to extract the profile picture.
- `title` - The blog post title.


## Summary Truncation

Use the `<!--truncate-->` marker in your blog post to represent what will be shown as the summary when viewing all blog published blog posts. Anything above `<!--truncate-->` will be part of the summary. For example:

```
---
title: Truncation Exmaple
---

All this will be part of the blog post summary.

Even this.

<!--truncate-->

But anything from here on down will not be.

Not this.

Or this.
```
