function myCLIPlugin(context, options) {
  return {
    name: 'docusaurus-plugin',
    extendCli(cli) {
      cli
        .command('cliPlugin:test')
        .description('Run test cli command')
        .option('-to, --test-option', 'Test option')
        .action(() => {
          console.log('TEST ACTION');
        });
    },
  };
}

export default {
  title: 'My Site',
  url: 'https://example.com',
  baseUrl: '/',
  plugins: [myCLIPlugin],
};
