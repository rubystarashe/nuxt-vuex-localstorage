import path from 'path'
import Vue from 'vue'
Vue.prototype.$localStorageLoaded = false
Vue.prototype.$sessionStorageLoaded = false

export default function nuxtBootstrapVue (moduleOptions) {
  this.addPlugin({
    src: path.resolve(__dirname, './plugins/main.js'),
    fileName: 'nuxt-vuex-localstorage.js',
    ssr: false,
    options: moduleOptions
  })
}

module.exports.meta = require('./package.json')
