const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { VueLoaderPlugin } = require("vue-loader");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const path = require("path");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "hurma-vue-file-uploader.js",
    library: "HurmaFileUploader",
    libraryTarget: "umd"
  },
  devtool: "source-map",
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              loaders: {
                js: "babel-loader"
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader"
      },
      {
        test: /\.less$/,
        use: [
          "vue-style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode,
              sourceMap: false,
              reloadAll: devMode
            }
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: false
            }
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: false
            }
          },
          "postcss-loader"
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: false,
      verbose: true
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "hurma-vue-file-uploader.css"
    })
  ]
};
