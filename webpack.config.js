const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const LIB_DIR = './src/lib';
let OUTPUT_DIR = path.resolve('dist');

const tsConfigPath = path.resolve(__dirname, LIB_DIR, 'tsconfig-build.json');

module.exports = (env) => {
  if (!env) {
    env = {};
  }

  if (!env.MODE) {
    env.MODE = 'prod';
  }

  if (!env.ENTRY_ROOT) {
    env.ENTRY_ROOT = LIB_DIR;
  }

  if (!env.ENTRY_EXTENSION) {
    env.ENTRY_EXTENSION = 'ts';
  }

  if (env.OUTPUT_DIR) {
    OUTPUT_DIR = env.OUTPUT_DIR;
  }

  const RELEASE_DIR = path.resolve(OUTPUT_DIR, 'release');
  let extension = env.ENTRY_EXTENSION;
  const outputPath = path.resolve(__dirname, RELEASE_DIR);
  const jsOutputPath = path.resolve(outputPath, 'js');

  const config = {
    mode: env.MODE ? 'production' : 'development',
    entry: {
      'lib': `${env.ENTRY_ROOT}/index.${extension}`
    },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [path.resolve(__dirname, 'node_modules')],
      plugins: [
        new TsConfigPathsPlugin({
          configFileName: tsConfigPath,
        })
      ]
    },
    output: {
      path: jsOutputPath,
      filename: 'clean-webpack-plugin-issue-146-[name].js',
      library: ['CleanWebpackPluginIssue146', '[name]'],
      libraryTarget: 'umd'
    },
    devtool: 'source-map',
    performance: {
      hints: false
    },
    optimization: {
      minimize: false,
      minimizer: [],
      concatenateModules: true,
      noEmitOnErrors: true
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: tsConfigPath
              }
            }
          ]
        },
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.MODE),
      }),
      // after the build of the TS, we need to copy files to the output folder
      new CopyPlugin([
        // copy the package.json
        { context: path.resolve(LIB_DIR), from: 'package.json', to: path.resolve(outputPath) },
        // copy the html files to the js folder
        { context: path.resolve(LIB_DIR), from: { glob: '**/*.html' }, to: path.resolve(jsOutputPath, 'html') },
        // copy the scss files to the sass folder
        { context: path.resolve(LIB_DIR), from: { glob: '**/*.scss' }, to: path.resolve(outputPath, 'sass') },
      ]),
    ]
  };

  if (!env.SKIP_CLEAN) {
    config.plugins.push(new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [OUTPUT_DIR], verbose: false }));
  }

  if (env.ENTRY) {
    config.entry = env.ENTRY;
  }

  return config;
};
