---
id: design-principles
title: Design Principles
---

_This section is a work in progress._

- Easy to learn but most things are still achievable by users, even if it takes them more code and more time to write. No abstractions beat bad abstractions, and we don't want users to have to hack around the wrong abstractions. Mandatory talk: Minimal API Surface Area
- Users won't feel overwhelmed when looking at the directory of a D2 project. It just makes sense and is easy to build on top of. Gatsby projects have a ton of config files - `gatsby-config.js`, `gatsby-node.js`, `gatsby-client.js`, which can look intimidating to beginners.
- We should not lock in our users to use our plugins or our CSS. Certain lower-level infra level stuff like React Loadable, React Router are fine, but not higher level ones, such as choice of Markdown engines, CSS frameworks, CSS methodology.
- The separations of concerns between each layer of our stack should be clear - well-abstracted and modular.

## How Docusaurus works

<!-- moved in from how Docusaurus works @yangshun -->

We believe that as devlopers, knowing how a library works is helpful in allowing us to become better at using it. Hence we're dedicating effort into explaining the architecture and various components of Docusaurus with the hope that users reading it will gain a deeper understanding of the tool and be even more proficient in using it.

<!--

Explain the principles that guide the development of Docusaurus.

References
---
- https://www.gatsbyjs.org/docs/behind-the-scenes/
- https://reactjs.org/docs/design-principles.html
- https://v1.vuepress.vuejs.org/miscellaneous/design-concepts.html

-->
