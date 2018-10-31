export default ({ store }) => {
  const persist = JSON.parse(localStorage.getItem('store'))
  store.replaceState( { ...store.state, localStorage: { loaded: true, ...store.state.localStorage, ...persist} })
  const watcher = store.watch(state => { return state.localStorage }, val => { 
    localStorage.setItem('store', JSON.stringify(val))
  }, { deep: true })
}
