module.exports = async function build(sourceDir, cliOptions = {}) {
  process.env.NODE_ENV = 'production';
  console.log(cliOptions);
  console.log('Build');
};
