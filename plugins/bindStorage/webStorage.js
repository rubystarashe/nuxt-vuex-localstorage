export const localStorage = {
  expireCheck: (val = {}) => {
    const date = new Date().getTime()
    Object.keys(val).forEach((key) => {
      if (val[key].expire < date) delete val[key]
    })
    return val
  },
  get: () => {
    return localStorage.getItem('store')
  },
  set: (val = {}) => {
    const date = new Date().getTime()
    Object.keys(val).forEach((key) => {
      if (typeof val[key].expire === 'number') {
        const expireDate = date + (val[key].expire * 60 * 60 * 1000)
        val[key].expire = expireDate
      }
    })
    return localStorage.setItem('store', crypto.encrypt(JSON.stringify(val)))
  }
}

export const sessionStorage = {
  get: () => {
    return sessionStorage.getItem('store')
  },
  set: (val = {}) => {
    return sessionStorage.setItem('store', crypto.encrypt(JSON.stringify(val)))
  }
}
