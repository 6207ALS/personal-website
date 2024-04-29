const path = require('path');

module.exports = {
  // Set mode to production to see the "tree-shaken" size
  mode: "production",
  // make sure this points to your entry point file
  entry: './public/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};