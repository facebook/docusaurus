const path = require('path');

module.exports = function context(context, options) {
  return {
    name: 'docusaurus-theme-bootstrap',
    getThemePath() {
      return path.resolve(__dirname, './theme');
    },
    getClientModules() {
      return [
        'bootstrap/dist/css/bootstrap.min.css'
      ];
    }
  }
}
