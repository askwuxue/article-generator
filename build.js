import { build } from 'esbuild';

const buildOptions = {
  entryPoints: ['./browser/index.js'],
  outfile: './build/index.js',
  bundle: true,
  minify: true,
};

await build(buildOptions);
