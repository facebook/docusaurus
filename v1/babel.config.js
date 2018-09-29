module.exports = {
  env: {
    test: {
      presets: ['@babel/env', '@babel/react'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
      ],
    },
  },
};
