import Crypto from 'nuxt-vuex-localstorage/plugins/crypto'
import Vue from 'vue'

export default async (ctx, options) => {
  const store = ctx.store
  const crypto = await new Crypto(ctx, options)
  Vue.prototype.$setWebStorageKey = (key, hash, keyTimes, keyLength) => crypto.setKey(key, hash, keyTimes, keyLength)
  
  const bindLocalStorage = () => {
    const localPersist = JSON.parse(crypto.decrypt(localStorage.getItem('store')))
    store.replaceState({ 
      ...store.state,
      localStorage: { ...store.state.localStorage, ...localPersist, status: true}
    })
    let watcher = store.watch(state => { return state.localStorage }, val => {
      localStorage.setItem('store', crypto.encrypt(JSON.stringify(val)))
    }, { deep: true, immediate: true })
    window.addEventListener('storage', (event) => {
      if (event.storageArea === localStorage) {
        watcher()
        store.replaceState({ ...store.state, localStorage: JSON.parse(crypto.decrypt(event.newValue)) })
        watcher = store.watch(state => { return state.localStorage }, val => { 
          localStorage.setItem('store', crypto.encrypt(JSON.stringify(val)))
        }, { deep: true, immediate: true })
      }
    })
  }

  const bindSessionStorage = () => {
    const sessionPersist = JSON.parse(crypto.decrypt(sessionStorage.getItem('store')))
    store.replaceState({ 
      ...store.state,
      sessionStorage: { ...store.state.sessionStorage, ...sessionPersist, status: true}
    })
    store.watch(state => { return state.sessionStorage }, val => { 
      sessionStorage.setItem('store', crypto.encrypt(JSON.stringify(val)))
    }, { deep: true })
  }
  
  switch (options.mode) {
    case 'manual':
      const localStorageWatcher = store.watch(state => { return state.localStorage }, val => {
        if (val.status) {
          bindLocalStorage()
          localStorageWatcher()
        }
      }, { deep: true })
      const sessionStorageWatcher = store.watch(state => { return state.sessionStorage }, val => {
        if (val.status) {
          bindSessionStorage()
          sessionStorageWatcher()
        }
      }, { deep: true })
      break
    default:
      bindLocalStorage()
      bindSessionStorage()
      break
  }
}
