const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

// Function recieves environment variables and argument vector which enables acces to command-line args and env variables
// Webpack config will dynamically adjust response based on the specified in argv.mode
module.exports = (env, argv) => {
    //
    const isDevelopment = argv.mode === 'development'

    return {
        // Mode is development for dev specific optimizations.
        mode: argv.mode,
        // Entry point is the file path to the main file to bundle.
        // Webpack uses this entry point file to create a dependency graph.
        entry: {
            // entry point will be index.jsx file in the client folder
            bundle: path.resolve(__dirname, 'client/src/index.jsx'),
        },
        output: {
            path: path.resolve(__dirname, 'client/build'),
            // The [name] references what the name of the entry point is. In this case "bundle".
            filename: '[name].js',
            // Prevents multiple files from being created with hashing
            clean: true,
            assetModuleFilename: '[name][ext]',
        },
        // Generates source maps for easeir debugging (see build folder)
        // devtool: isDevelopment ? 'source-map' : false,
        devtool: 'inline-source-map',
        // devtool: 'source-map',
        // Can create local servers to mimic production environment.
        devServer: {
            // Configures a local development server.
            static: {
                // The directory (containing your bundled files) that will be served as static assets.
                directory: path.resolve(__dirname, 'client/build'),
            },
            // Proxying API requests to a backend server.
            proxy: {
                '/': {
                    target: 'http://localhost:3000', // Replace with your backend server URL
                    changeOrigin: true,
                    secure: false,
                },
            },
            // Port at which the dev server will run.
            port: 8000,
            // True will automatically open your default web browser to specified port.
            open: true,
            // Enables hot module reloading.
            hot: isDevelopment,
            // Enaables gzip compression reducing size of data transfer.
            compress: true,
            // Used for SPA will respond back with index.html or other for request not matching the static file.
            historyApiFallback: true,
        },
        // Specifies file extensions ('.js' and '.jsx') that webpack will resolve when importing files.
        resolve: {
            extensions: ['.js', '.jsx'],
            fallback: {
                "crypto": require.resolve("crypto-browserify"),
                "stream": require.resolve("stream-browserify"),
                "fs": require.resolve("browserify-fs"),
                "path": require.resolve("path-browserify"),
                "util": require.resolve("util/")
            }
        },
        stats: {
            errorDetails: true,
        },
        module: {
            // Rules for how webpack should handle different types of files using loaders.
            rules: [
                // Looks for files ending in .css or .scss and uses loaders from right to left.
                {
                    test: /\.(css|scss)$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
                // Looks for files with .js or .jsx ext and uses babel-loader plugin.
                {
                    test: /\.(js|jsx)$/,
                    // Explude node modules as node modules ares usually distributed pre transpilation.
                    exclude: /node_modules/,
                    use: ['babel-loader'],
                },
                // Looks for assets with below files extensions.
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.wasm$/,
                    type: 'asset/resource',
                }
            ],
        },
        plugins: [
            // Will generate an HTML file that includes all webpack bundles in the body using script tags
            new HtmlWebpackPlugin({
                // The title to use for the generated HTML document.
                title: 'BackTrack',
                // The file to write HTML to
                filename: 'index.html',
                // The relative or absolute path to the template.
                template: './client/templates/template.html',

            }),
            new webpack.DefinePlugin({
                'process.env.REACT_APP_SPOTIFY_CLIENT_ID': JSON.stringify(process.env.REACT_APP_SPOTIFY_CLIENT_ID),
                'process.env.REACT_APP_SPOTIFY_CLIENT_SECRET': JSON.stringify(process.env.REACT_APP_SPOTIFY_CLIENT_SECRET),
                'process.env.REACT_APP_SPOTIFY_TOKEN': JSON.stringify(process.env.REACT_APP_SPOTIFY_TOKEN),
                'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL || 'http://localhost:8000'),

            }),
        ],
    };
};
