---
sidebar_position: 1
---

# Create a Page

Add **Markdown or React** files to `src/pages` to create a **standalone page**:

- `src/pages/index.js` → `localhost:3000/`
- `src/pages/foo.md` → `localhost:3000/foo`
- `src/pages/foo/bar.js` → `localhost:3000/foo/bar`

## Create your first React Page

Create a file at `src/pages/my-react-page.js`:

```jsx title="src/pages/my-react-page.js"
import React from 'react';
import Layout from '@theme/Layout';

export default function MyReactPage() {
  return (
    <Layout>
      <h1>My React page</h1>
      <p>This is a React page</p>
    </Layout>
  );
}
```

A new page is now available at [http://localhost:3000/my-react-page](http://localhost:3000/my-react-page).

## Create your first Markdown Page

Create a file at `src/pages/my-markdown-page.md`:

```mdx title="src/pages/my-markdown-page.md"
# My Markdown page

This is a Markdown page
```
## **BALANCE**

This section provides API endpoints to retrieve detailed fund balance information. It includes views by periodicity, product, overall fund summary, and margin-related data.

## **Periodicity Wise Balance**

This API allows you to fetch categorized fund balances such as cash deposits, overdraft limits, and miscellaneous deposits. These balances are organized based on periodicity, allowing for segmented financial insights.

### Query Parameters (Optional)

| Parameter | Type | Description | Example |
| --- | --- | --- | --- |
| periodicity | integer | Periodicity ID (Refer MarginInfo API - type list) | 3 |

### Header Parameters
A new page is now available at [http://localhost:3000/my-markdown-page](http://localhost:3000/my-markdown-page).
