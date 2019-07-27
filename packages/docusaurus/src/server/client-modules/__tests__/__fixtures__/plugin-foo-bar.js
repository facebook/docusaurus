module.exports = function() {
  return {
    name: 'plugin-foo-bar',
    getClientModules() {
      return ['foo', 'bar'];
    },
  };
};
