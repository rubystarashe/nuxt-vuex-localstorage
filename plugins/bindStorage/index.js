import Crypto from 'nuxt-vuex-localstorage/plugins/crypto'
import expire from 'nuxt-vuex-localstorage/plugins/bindStorage/expire'
import Vue from 'vue'
Vue.prototype.$localStorageLoaded = false
Vue.prototype.$sessionStorageLoaded = false

export default async (ctx, options = {}) => {
  const storageFunction = require('nuxt-vuex-localstorage/plugins/bindStorage/storageFunction')(options.mode)
  if (options.expireHours) storageFunction.setExpire(options.expireHours)
  const store = ctx.store
  const crypto = await new Crypto(options, ctx)
  let localStoreNames = options.localStorage || ['localStorage']
  if (typeof options.localStorage === 'string') localStoreNames = [options.localStorage]
  let sessionStoreNames = options.sessionStorage || ['sessionStorage']
  if (typeof options.sessionStorage === 'string') sessionStoreNames = [options.sessionStorage]
  const versionPropName = options.versionPropName || 'version'
  const storeNames = {
    local: localStoreNames,
    session: sessionStoreNames
  }

  let watchHandlers = {
    local: [],
    session: []
  }

  const watchFunction = (time, type, i, val) => {
    const data = JSON.stringify(val)
    const dataWithUpdatedTimestamp = JSON.stringify(expire.create(val))
    const currentLSJson = storageFunction[type].get(storeNames[type][i])
    const currentLSJsonNoTimestamp = JSON.parse(currentLSJson)
    delete currentLSJsonNoTimestamp?.___last_updated
    if (data === JSON.stringify(currentLSJsonNoTimestamp)) return
    const currentLS = JSON.parse(crypto.decrypt(currentLSJson))
    if (!!!currentLS?.___last_updated || currentLS?.___last_updated > time) return
    storageFunction[type].set(storeNames[type][i], crypto.encrypt(dataWithUpdatedTimestamp))
  }

  const watcher = (type, name, i) => {
    return store.watch(state => {
        const time = new Date().getTime()
        return {time, data: state[name]}
      },
      ({time, data}) => watchFunction(time, type, i, data),
      { deep: true })
  }

  const bindStorage = (type, name, i) => {
    const persist = JSON.parse(crypto.decrypt(storageFunction[type].get(name)))
    let data = JSON.parse(JSON.stringify(store.state))
    const expireChecked = expire.check(persist)
    if (store.state[name] && expireChecked[versionPropName] === store.state[name][versionPropName])
      data[name] = { ...data[name], ...expireChecked, status: true }
    delete data[name]?.___last_updated
    store.replaceState(data)

    storeNames[type].forEach((name, i) => {
      watchHandlers[type][i] = watcher(type, name, i)
    })
    if (i === storeNames[type].length - 1) {
      if (type === 'local') Vue.prototype.$localStorageLoaded = true
      if (type === 'session') Vue.prototype.$sessionStorageLoaded = true
    }
  }

  const watchOtherBrowsersLocalStorage = () => {
    window.addEventListener('storage', (event) => {
      if (event && event.storageArea === localStorage && Object.keys(store.state).indexOf(event.key) >= 0) {
        let data = { ...store.state }
        data[event.key] = expire.check(JSON.parse(crypto.decrypt(event.newValue)))
        delete data[event.key].___last_updated
        if (JSON.stringify(data) !== JSON.stringify(store.state)) {
          store.replaceState(data)
        }
      }
    })
  }

  switch (options.mode) {
    case 'manual':
      watchOtherBrowsersLocalStorage()
      Vue.prototype.$setWebStorageKey = (key, salt, keyMixTimes, keyLength) => crypto.setKey(key, salt, keyMixTimes, keyLength)
      let localStorageStatusWatchers = []
      storeNames['local'].forEach((name, i) => {
        localStorageStatusWatchers.push(store.watch(state => { return state[name].status }, val => {
          if (val) {
            bindStorage('local', name, i)
            localStorageStatusWatchers[i]()
          }
        }, { deep: true }))
      })
      let sessionStorageStatusWatchers = []
      storeNames['session'].forEach((name, i) => {
        sessionStorageStatusWatchers.push(store.watch(state => { return state.sessionStorage }, val => {
          if (val.status) {
            bindStorage('session', name, i)
            sessionStorageStatusWatchers[i]()
          }
        }, { deep: true }))
      })
      break
    default:
      storeNames['local'].forEach((name, i) => {
        bindStorage('local', name, i)
        watchOtherBrowsersLocalStorage()
      })
      storeNames['session'].forEach((name, i) => {
        bindStorage('session', name, i)
      })
      break
  }
}
