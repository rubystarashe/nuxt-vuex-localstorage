export default {
  check: (val = {}) => {
    const date = new Date().getTime()
    Object.keys(val).forEach((key) => {
      try {
        const expireDate = new Date(val[key].expire)
        if (expireDate < date) delete val[key]
      } catch (e) {}
    })
    return val
  },
  create: (val = {}) => {
    const date = new Date().getTime()
    Object.keys(val).forEach((key) => {
      if (typeof val[key].expire === 'number') {
        const expireDate = date + (val[key].expire * 60 * 60 * 1000)
        val[key].expire = expireDate.toUTCString()
      }
    })
    return val
  }
}