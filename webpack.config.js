const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

class MyPlugin {
    apply(compiler) {
        compiler.hooks.emit.tap('MyPlugin', (compilation) => {
            const jsFiles = Object.keys(compilation.assets).filter((name) => name.endsWith('.js'));

            jsFiles.forEach((fileName) => {
                // Get the bundled file content
                const fileContent = compilation.assets[fileName].source();

                const header = `if (! jSuites && typeof(require) === 'function') {
    var jSuites = require('jsuites');
}

if (! formula && typeof(require) === 'function') {
    var formula = require('@jspreadsheet/formula');
}

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jspreadsheet = factory();
}(this, (function () {`;

                const footer = `    return jspreadsheet;
})));`;

                // Updated file content with custom content added
                const updatedFileContent = header + '\n\n' + fileContent + '\n\n' + footer;

                // Replace the bundled file content with updated content
                compilation.assets[fileName] = {
                    source: () => updatedFileContent,
                    size: () => updatedFileContent.length,
                };
            });
        });
    }
}

let isProduction = process.env.NODE_ENV === 'production';

const distPath = path.resolve(__dirname, 'dist');

const sharedConfig = {
    performance: {
        maxAssetSize: 512 * 1024,
        maxEntrypointSize: 512 * 1024,
    },
};

const umdConfig = {
    ...sharedConfig,
    optimization: { minimize: true },
    target: ['web', 'es5'],
    entry: [isProduction ? './src/index' : './src/test.js'],
    mode: isProduction ? 'production' : 'development',
    externals: {},
    output: {
        filename: 'index.js',
        path: distPath,
        library: 'jspreadsheet',
        libraryExport: 'default',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '/public'),
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
        port: 8000,
        devMiddleware: {
            publicPath: 'https://localhost:3000/',
        },
        hot: 'only',
    },
    plugins: [],
    module: {
        rules: [
            isProduction
                ? {
                      test: /\.js$/,
                      use: [
                          {
                              loader: path.resolve('build.cjs'),
                              options: {},
                          },
                      ],
                  }
                : null,
            {
                test: /\.css$/,
                use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
            },
        ],
    },
};

if (isProduction) {
    umdConfig.plugins.push(new MyPlugin());
    umdConfig.plugins.push(
        new MiniCssExtractPlugin({
            filename: 'jspreadsheet.css',
        })
    );
    umdConfig.plugins.push(
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/jspreadsheet.css',
                    to: 'jspreadsheet.css',
                },
                {
                    from: 'src/jspreadsheet.themes.css',
                    to: 'jspreadsheet.themes.css',
                },
            ],
        })
    );
}

const esmConfig = {
    ...sharedConfig,
    optimization: { minimize: false },
    target: ['web', 'es2020'],
    entry: './src/index',
    mode: 'production',
    experiments: {
        outputModule: true,
    },
    externals: {
        jsuites: 'jsuites',
        '@jspreadsheet/formula': '@jspreadsheet/formula',
    },
    externalsType: 'module',
    output: {
        filename: 'index.esm.js',
        path: distPath,
        library: {
            type: 'module',
        },
    },
};

module.exports = isProduction ? [umdConfig, esmConfig] : umdConfig;
