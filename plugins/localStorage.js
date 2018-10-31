export default ({ store }) => {
  const persist = JSON.parse(localStorage.getItem('store'))
  store.replaceState({ ...store.state, localStorage: { loaded: true, ...store.state.localStorage, ...persist} })
  let watcher = store.watch(state => { return state.localStorage }, val => { 
    localStorage.setItem('store', JSON.stringify(val))
  }, { deep: true })
  window.addEventListener('storage', (event) => {
    if (event.storageArea === localStorage) {
      watcher()
      store.replaceState({ ...store.state, localStorage: JSON.parse(event.newValue) })
      watcher = store.watch(state => { return state.localStorage }, val => { 
        localStorage.setItem('store', JSON.stringify(val))
      }, { deep: true })
    }
  })
}
