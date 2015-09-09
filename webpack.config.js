module.exports = {
  entry: "./client/App.js",
  output: {
    filename: "./client/dist/bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ]
  }
};