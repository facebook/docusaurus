---
id: reflinks
title: Reference Links
---

### Existing Docs

- [doc1][doc1]
- [doc2][doc2]

### Non-existing Docs

- [hahaha][hahaha]

## Repeating Docs

- [doc1][doc1]
- [doc2][doc2]

## Do not replace this
```md
![image1][image1]
```

```js
const doc1 = foo();
console.log("[image2][image2]");
const testStr = `![image3][image3]`;
```

[doc1]: doc1.md
[doc2]: ./doc2.md
[hahaha]: hahaha.md
[image1]: assets/image1.png
[image2]: assets/image2.jpg
[image3]: assets/image3.gif
