export const local = {
  get: () => {
    return localStorage.getItem('store')
  },
  set: val => {
    return localStorage.setItem('store', val)
  }
}

export const session = {
  get: () => {
    return sessionStorage.getItem('store')
  },
  set: val => {
    return sessionStorage.setItem('store', val)
  }
}
