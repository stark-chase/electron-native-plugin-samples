const path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ElectronNativePlugin = require("electron-native-plugin");

// Html-webpack-plugin configuration
const indexConfig = {
    template: './index.html',
    excludeChunks: ['electron-main']
};

const outputPath = path.resolve('./dist');

let webpackConfig = {
    mode: 'none',
    entry: {
        'electron-main': './electron-main', // Electron entry point
        'app': './app'
    },
    // How the different types of modules within a project will be treated
    module: {
        rules: [
            {
                // All files with a '.ts' extension will be handled by ts-loader
                test: /\.ts$/,
                use: [
                    'ts-loader'
                ],
                exclude: /node_modules/
            }, 
            {
                test: /\.js$/,
                use: 
                [
                    "electron-native-patch-loader",
                    {
                        loader: "electron-native-loader",
                        options: {
                            outputPath: outputPath  // Set here your defined path for the output bundles, e.g. "./dist"
                        }
                    }
                ]
            },
            { 
                test: /\.node$/, 
                use: "electron-native-loader" 
            }
         ]
    },
    // Configure how modules are resolved
    resolve: {
        extensions: [".ts", ".js"]
    },
    // How and where webpack should output bundles, assets and anything else
    output: {
        path: outputPath,
        filename: '[name].js'
    },
    // What bundle information gets displayed
    stats: {
        warnings: false
    },
    // Target a specific environment (cf. doc)
    target: 'electron-main',
    // Configure whether to polyfill or mock certain Node.js globals and modules
    node: {
        __dirname: false
    },
    // Customize the webpack build process with additionals plugins
    plugins: [
        new ElectronNativePlugin({
            forceRebuild: true,
            outputPath: "./native-modules/", 
            userModules: 
            [
                "./greeting-module"
            ]
        }),
        new Webpack.IgnorePlugin(/node-gyp/),
        new HtmlWebpackPlugin(indexConfig),
        new Webpack.ContextReplacementPlugin(/angular([\\\/])core([\\\/])/, path.resolve(__dirname, './src')),
      ],
};

// Export the config
module.exports = webpackConfig;