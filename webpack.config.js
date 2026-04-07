const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class MyPlugin {
    apply(compiler) {
        compiler.hooks.emit.tap('MyPlugin', (compilation) => {
            // Get the bundled file name
            const fileName = Object.keys(compilation.assets)[0];

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
    }
}

let isProduction = process.env.NODE_ENV === 'production';

const distPath = path.resolve(__dirname, 'dist');

const sharedConfig = {
    stats: { warnings: false },
};

const umdConfig = {
    ...sharedConfig,
    optimization: { minimize: true },
    target: ['web', 'es5'],
    entry: isProduction ? './src/index' : './src/test.js',
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
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['css-loader'],
            },
        ],
    },
};

module.exports = isProduction ? [umdConfig, esmConfig] : umdConfig;
