## Page

Let's import a MDX partial at `./_pagePartial.md`:

```mdx-code-block
import PagePartial from "./_pagePartial.md"

<PagePartial />
```

---

Now let's import `../README.md`:

```mdx-code-block
import Readme from "../README.md"

<Readme />
```

### Other tests

- [Code block tests](/tests/pages/code-block-tests)
- [Error boundary tests](/tests/pages/error-boundary-tests)
- [Hydration tests](/tests/pages/hydration-tests)
- [Asset linking tests](/tests/pages/markdown-tests)
- [General Markdown tests](/tests/pages/markdownPageTests)
- [TOC tests](/tests/pages/page-toc-tests)
- [Tabs tests](/tests/pages/tabs-tests)
