const path = require('path');
const glob = require('glob');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'public')
}

module.exports = (_, options) => {
    const isProd = options.mode === 'production';

    return {
        entry: './src/index.ts',
        mode: isProd ? 'production' : 'development',
        devtool: isProd ? false : 'inline-source-map',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
                {
                    test: /\.png$/i,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        }
                    }],
                }
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
        devServer: {
            contentBase: './dist',
        },
        plugins: [
            new MiniCssExtractPlugin(),
            new PurgecssPlugin({
                paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
            }),
            new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
            new HtmlWebpackPlugin({ template: './public/index.html' })
        ]
    };
};