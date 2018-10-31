export default ({ store }) => {
  const persist = JSON.parse(sessionStorage.getItem('store'))
  store.replaceState({ ...store.state, sessionStorage: { loaded: true, ...store.state.sessionStorage, ...persist} })
  store.watch(state => { return state.sessionStorage }, val => { 
    sessionStorage.setItem('store', JSON.stringify(val))
  }, { deep: true })
}
