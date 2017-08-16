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
    {href: '/blog', label: 'Blog'},
    ...
]
```

## Adding blog posts

To publish in the blog, create a file within the blog folder with a formatted name of `YYYY-MM-DD-My-Blog-Post-Title.md`. The post date is extracted from the file name.


For example, we will create the following file `website/blog/2017-08-18-Introducing-Docusaurus.md`:

```
---
author: Frank Li
authorURL: https://twitter.com/foobarbaz
authorFBID: 503283835
title: Introducing Docusaurus
---

Lorem Ipusm..
```

## Special blog post header options

- `author` - The text label of the author byline
- `authorURL` - The url that the author name links to
- `authorFBID` - The Facebook ID that is used to extract the profile picture
- `title` - The blog post title