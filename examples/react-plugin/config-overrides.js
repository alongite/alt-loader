module.exports = function override(config, env) {
  config.output = {
    filename: 'react-plugin.js',
    library: 'reactPlugin',
    libraryTarget: 'umd',
    publicPath: 'http://localhost:8081/'
  }
  return config;
}