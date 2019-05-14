'use strict';

const { readdirSync } = require('fs')
const { resolve, join } = require('path');
const merge = require('webpack-merge');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

/**
 * GLOBAL VARS
 */
const ENV = process.argv.find(arg => arg.includes('production')) ? 'production' : 'development';
const OUTPUT_PATH = (ENV === 'production') ? resolve('dist') : resolve('src');
const TEMPLATE_PATH = './';

/**
 * GET ALL HTML TEMPLATES
 */
const htmlPlugins = generateHtmlPlugins('./src/views');

// MINITY && COMPRESS FILES IMGS, CSS, JS..
const assets = [

  {
    from: resolve('./src/assets'),
    to: join(OUTPUT_PATH, 'assets')
  }

];

const helpers = [
//   {
//     from: resolve('./src/vendor/babel-helpers.min.js'),
//     to: join(OUTPUT_PATH, 'vendor')
//   }
];

/**
 * CONFIGURATIONS
 */
const commonConfig = merge([
  {
    entry: './src/index.js',
    output: {
      path: OUTPUT_PATH,
      filename: 'js/[name].[chunkhash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: [
            {
              loader: 'html-loader'
            },
            {
              loader: 'pug-html-loader',
              options: {
                data: {
                  config: require('./src/globals/config.json')
                }
              }
            }
          ]
        },                // Use `self` namespace to hold the locals
        // Not really necessary
        {
          test: /\.scss$/,
          use: [
            (ENV !== 'production') ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                  importLoaders: 1,
                  minimize: true,
                  url: false,
                  sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [require('autoprefixer')]
              }
            },
            { loader: 'sass-loader', options: { sourceMap: true } }
          ]
        },
        {
          test: /\.js$/,
          // We need to transpile, do not exclude node_modules
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: true,
                extends: join(__dirname + '/.babelrc'),
                cacheDirectory: true,
                envName: ENV
              }
            },
            {
              loader: 'uglify-template-string-loader'
            }
          ]
        }
      ]
    }
  }
]);

const developmentConfig = merge([
  {
    devtool: 'cheap-module-source-map',
    plugins: [
      ...htmlPlugins
    ],
    devServer: {
      contentBase: OUTPUT_PATH,
      compress: true,
      overlay: true,
      port: 1342,
      host: '0.0.0.0'
    }
  }
]);

const productionConfig = merge([
  {
    devtool: 'nosources-source-map',
    plugins: [
      new CleanWebpackPlugin({ verbose: true }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[id].[hash].css'
      }),
      new CopyWebpackPlugin([...helpers, ...assets]),
      new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
      new CompressionPlugin({ test: /\.js$/ }),
      ...htmlPlugins
    ]
  }
]);

module.exports = mode => {

  if (mode === 'production') {
    return merge(commonConfig, productionConfig, { mode });
  }

  return merge(commonConfig, developmentConfig, { mode });
};

/**
 * UTILS
 */
function generateHtmlPlugins (templateDir) {
    
    const files = [];
    const templateFiles = readdirSync(resolve(__dirname, templateDir))
    
    for (let i = 0; i < templateFiles.length; i++) {
        const item = templateFiles[i];
        
        const parts = item.split('.');

        if(parts.length > 1){

            const name = parts[0];
            const extension = parts[1];
            
            files.push(new HtmlWebpackPlugin({
                filename: `${(ENV === 'production') ? 'views/' : ''}${name}.html`,
                template: resolve(__dirname, `${templateDir}/${name}.${extension}`),
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    minifyCSS: true,
                    minifyJS: true
                }
            }));

        }

    }

    return files;

}