function getCookie (name) {
  let cookie
  document.cookie.split(';').some(e => {
    const c = e.replace(/^\s+|\s+$/g, '').split('=')
    const check = c[0] === name
    if (check) cookie = c
    return check
  })
  return unescape(cookie)
}

let expireHours = 24

function setCookie (name, val) {
  const cookie_expireDate = expireHours > 0 ? new Date().getTime() + (expireHours * 60 * 60 * 1000) : new Date().getTime() + (24 * 60 * 60 * 1000)
  return document.cookie = name + '=' + escape(val) + '; expires=' + new Date(cookie_expireDate).toUTCString() + '; path=/'
}

let storageTemp = {
  localStorage: {},
  sessionStorage: {}
}

export const setExpire = hours => {
  expireHours = hours
}

export const local = {
  get: name => {
    try {
      const cookie = getCookie(name)
      setCookie(name, '', 0)
      return cookie.split(',')[1]
    } catch (e) {
      return ''
    }
  },
  set: (name, val) => {
    storageTemp.localStorage[name] = val
  }
}

export const session = {
  get: name => {
    try {
      const cookie = getCookie(name)
      setCookie(name, '', 0)
      return cookie.split(',')[1]
    } catch (e) {
      return ''
    }
  },
  set: (name, val) => storageTemp.sessionStorage[name] = val
}

window.addEventListener('beforeunload', function (event) {
  Object.keys(storageTemp.localStorage).forEach(key => {
    setCookie(key, storageTemp.localStorage[key])
  })
  Object.keys(storageTemp.sessionStorage).forEach(key => {
    setCookie(key, storageTemp.sessionStorage[key])
  })
})
