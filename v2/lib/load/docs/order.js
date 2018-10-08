// build the docs meta such as next, previous, category and sidebar
module.exports = function createOrder(allSidebars = {}) {
  const order = {};
  if (!allSidebars) {
    return order;
  }
  Object.keys(allSidebars).forEach(sidebar => {
    const categories = allSidebars[sidebar];

    let ids = [];
    const categoryOrder = [];
    const subCategoryOrder = [];
    Object.keys(categories).forEach(category => {
      if (Array.isArray(categories[category])) {
        ids = ids.concat(categories[category]);

        // eslint-disable-next-line
        for (let i = 0; i < categories[category].length; i++) {
          categoryOrder.push(category);
          subCategoryOrder.push(undefined);
        }
      } else {
        Object.keys(categories[category]).forEach(subCategory => {
          ids = ids.concat(categories[category][subCategory]);

          // eslint-disable-next-line
          for (let i = 0; i < categories[category][subCategory].length; i++) {
            categoryOrder.push(category);
            subCategoryOrder.push(subCategory);
          }
        });
      }
    });

    // eslint-disable-next-line
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let previous;
      let next;
      if (i > 0) previous = ids[i - 1];
      if (i < ids.length - 1) next = ids[i + 1];
      order[id] = {
        previous,
        next,
        sidebar,
        category: categoryOrder[i],
        subCategory: subCategoryOrder[i],
      };
    }
  });
  return order;
};
