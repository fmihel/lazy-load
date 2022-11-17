const path = require('path');

//const mode = 'development';
const mode = 'production';
let outputPath = path.resolve(__dirname,'dist');
//let outputPath = 'C:\\work\\test2\\node_modules\\fmihel-lazy-load\\dist';

module.exports = {
  entry: {
    main:'./source/index.js'
  },
  mode,
  devtool: (mode === 'development'  ? 'inline-source-map' : undefined),
  output: {
    path:outputPath,
    filename: 'lazy-load.min.js',
    libraryTarget: 'commonjs2' // THIS IS THE MOST IMPORTANT LINE! :mindblow: I wasted more than 2 days until realize this was the line most important in all this guide.
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        include: path.resolve(__dirname, 'source'),
        exclude: /(node_modules|bower_components|build|dev)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"],          
          }
        }
      }
    ]
  },
}