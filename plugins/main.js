import localStorage from 'nuxt-vuex-localstorage/plugins/localStorage'
import sessionStorage from 'nuxt-vuex-localstorage/plugins/sessionStorage'

export default ({store}) => {
  localStorage({store})
  sessionStorage({store})
}
