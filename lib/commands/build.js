module.exports = async function build(siteDir, cliOptions = {}) {
  process.env.NODE_ENV = 'production';
  console.log('Build command invoked ...');
  console.log(siteDir);
  console.log(cliOptions);
};
