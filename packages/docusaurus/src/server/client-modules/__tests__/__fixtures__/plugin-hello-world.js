module.exports = function() {
  return {
    plugin: 'plugin-hello-world',
    getClientModules() {
      return ['hello', 'world'];
    },
  };
};
