---
title: Create a Post 
---

This page will help you on how to create blog posts in Docusaurus.

## Adding Posts

In order to add a post in the blog, create a file: `/blog/2021-02-28-greetings`.

The format for filename of a post is `YYYY-MM-DD-post-title.md`, you have to follow this format because the post date is extracted from the file name.

```md
---
slug: greetings
title: Greetings! 
author: Steven Hansel 
author_title: Docusaurus Contributor 
author_url: https://github.com/ShinteiMai
author_image_url: https://avatars.githubusercontent.com/u/54180475?s=460&u=dea92f5adfe1adb82d983200553508851c3a96a0&v=4 
tags: [greetings, docusaurus]
---

Congratulations, you have made your first post!

Feel free to play around and edit this post as much you like.

```

The post should be generated automatically after you save the file. Open `http://localhost:3000/blog/greetings`, and you should see your created post!

