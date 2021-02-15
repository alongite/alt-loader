module.exports = {
  publicPath: 'http://localhost:8082/',
  configureWebpack: {
    output: {
      filename: 'vue-plugin.js',
      library: 'vuePlugin',
      libraryTarget: 'umd',
    }
  }
}