let expireHours = 24
export const setExpire = hours => {
  expireHours = hours
}

export const local = {
  get: name => {
    return localStorage.getItem(name)
  },
  set: (name, val) => {
    return localStorage.setItem(name, val)
  }
}

export const session = {
  get: name => {
    return sessionStorage.getItem(name)
  },
  set: (name, val) => {
    return sessionStorage.setItem(name, val)
  }
}
