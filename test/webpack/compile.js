import webpack from 'webpack';

export default function compile(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) {
        reject(new Error(`Failed to compile with errors`));
      }
      resolve('Compiled successfully');
    });
  });
}
