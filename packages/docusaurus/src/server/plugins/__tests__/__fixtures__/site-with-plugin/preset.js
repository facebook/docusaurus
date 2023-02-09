module.exports = function () {
  return {
    plugins: [
      [() => ({name: 'preset-plugin1'}), {}],
      () => ({name: 'preset-plugin2'}),
    ],
    themes: [
      [() => ({name: 'preset-theme1'}), {}],
      () => ({name: 'preset-theme2'}),
    ],
  };
};
