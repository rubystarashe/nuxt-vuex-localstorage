export default {
  check: (val = {}) => {
    const date = new Date().getTime()
    let copy = eval('(' + JSON.stringify(val || {}) + ')')
    Object.keys(copy).forEach((key) => {
      try {
        const expireDate = new Date(copy[key].expire).getTime()
        if (expireDate < date) delete copy[key]
      } catch (e) {}
    })
    return copy
  },
  create: (val = {}) => {
    const date = new Date().getTime()
    let copy = eval('(' + JSON.stringify(val) + ')')
    Object.keys(copy).forEach((key) => {
      if (typeof copy[key].expire === 'number') {
        const expireDate = date + (copy[key].expire * 60 * 60 * 1000)
        copy[key].expire = new Date(expireDate)
      }
    })
    return copy
  }
}
