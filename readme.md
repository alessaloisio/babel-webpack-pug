NODEJS INSTALLATION
EXTENSION INSTALLATION => 
    npm i -g nodemon

# INIT PROJECT

1. create a folder where you want
2. open folder with vscode
3. CTRL+SHIFT+² => on terminal exec "npm init"
 => you have now a package.json

## babel
1. npm i --save-dev @babel/core @babel/preset-env babel-loader
2. create on root folder ".babelrc" and insert 
    "
        {
            "presets": ["@babel/preset-env"]
        }
    "

 => we are ready to write modern javascript syntax.

## webpack

1. npm i --save-dev webpack webpack-cli webpack-dev-server

webpack-merge
clean-webpack-plugin
copy-webpack-plugin

html-webpack-plugin 
pug

imagemin-webpack-plugin
mini-css-extract-plugin
compression-webpack-plugin

uglify-template-string-loader
sass-loader postcss-loader css-loader style-loader
html-loader pug-html-loader


#https://extri.co/2017/05/23/using-htmlwebpackplugin-and-pug/

2. npm i --save-dev @babel/register
3. create a "webpack.config.js" file



3. On package.json look "scripts" key and append 
    "
        "start": "nodemon --exec babel-node index.js",
        "build": "webpack --mode production"
    "