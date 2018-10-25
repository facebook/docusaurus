// build the docs meta such as next, previous, category and sidebar

module.exports = function createOrder(allSidebars = {}) {
  const order = {};

  Object.keys(allSidebars).forEach(sidebarId => {
    const sidebar = allSidebars[sidebarId];

    const ids = [];
    const categoryOrder = [];
    const subCategoryOrder = [];
    const indexItems = ({items, categoryLabel, subCategoryLabel}) => {
      items.forEach(item => {
        switch (item.type) {
          case 'category':
            indexItems({
              items: item.items,
              categoryLabel: categoryLabel || item.label,
              subCategoryLabel: categoryLabel && item.label,
            });
            break;
          case 'ref':
          case 'link':
            // refs and links should not be shown in navigation
            break;
          case 'doc':
            ids.push(item.id);
            categoryOrder.push(categoryLabel);
            subCategoryOrder.push(subCategoryLabel);
            break;
          default:
            throw new Error(
              `Unknown item type: ${item.type}. Item: ${JSON.stringify(item)}`,
            );
        }
      });
    };

    indexItems({items: sidebar});

    // eslint-disable-next-line
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let previous;
      let next;

      if (i > 0) {
        previous = ids[i - 1];
      }

      if (i < ids.length - 1) {
        next = ids[i + 1];
      }

      order[id] = {
        previous,
        next,
        sidebar: sidebarId,
        category: categoryOrder[i],
        subCategory: subCategoryOrder[i],
      };
    }
  });

  return order;
};
