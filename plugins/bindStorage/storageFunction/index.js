const storageFunction = mode => {
  if (process.client) {
    try {
      if (mode == 'cookie') return require('nuxt-vuex-localstorage/plugins/bindStorage/storageFunction/cookie')

      const storage = {
        local: window.localStorage,
        session: window.sessionStorage
      }
      storage.local.setItem('__local_test', 1)
      storage.local.removeItem('__local_test')
      storage.session.setItem('__session_test', 1)
      storage.session.removeItem('__session_test')

      return require('nuxt-vuex-localstorage/plugins/bindStorage/storageFunction/webStorage')
    } catch (e) {
      return require('nuxt-vuex-localstorage/plugins/bindStorage/storageFunction/cookie')
    }
  }
}

module.exports = storageFunction
