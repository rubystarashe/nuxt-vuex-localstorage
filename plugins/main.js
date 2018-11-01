import webStorage from 'nuxt-vuex-localstorage/plugins/webStorage'

export default (ctx) => {
  const options = <%= JSON.stringify(options) %>
  webStorage(ctx, options)
}
