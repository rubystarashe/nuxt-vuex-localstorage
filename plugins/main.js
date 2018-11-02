import bindStorage from 'nuxt-vuex-localstorage/plugins/bindStorage'

export default (ctx) => {
  const options = <%= JSON.stringify(options) %>
  bindStorage(ctx, options)
}
