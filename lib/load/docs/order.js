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
    Object.keys(categories).forEach(category => {
      ids = ids.concat(categories[category]);
      for (let i = 0; i < categories[category].length; i++) {
        categoryOrder.push(category);
      }
    });

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
        category: categoryOrder[i]
      };
    }
  });
  return order;
};
