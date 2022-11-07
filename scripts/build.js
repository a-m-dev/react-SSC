const path = require("path");
const rimraf = require("rimraf");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const ReactServerWebpackPlugin = require("react-server-dom-webpack/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = (process.env.NODE_ENV = "production");

rimraf.sync(path.resolve(__dirname, "../build"));

const config = {
  mode: isProd ? "production" : "development",
  devtool: isProd ? "source-map" : "cheap-module-source-map",
  entry: [path.resolve(__dirname, "../src/index.client.js")],
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "main.js",
  },
  resolve: { extensions: ["", ".jsx", ".js"] },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, "../src/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "app.css",
      chunkFilename: "[id].css",
    }),
    new ReactServerWebpackPlugin({ isServer: false }),
  ],
};

const callback = (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }

    process.exit(1);
    return;
  }

  const info = stats.toJson();
  if (stats.hasErrors()) {
    console.log("Finished running webpack with errors!");
    info.errors.forEach((e) => {
      console.error(e);
    });
    process.exit(1);
  } else {
    console.log("Finished Running webpack!");
  }
};

webpack(config, callback);
