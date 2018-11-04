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

function setCookie (name, val, expireDays = 1) {
  const cookie_expireDate = expireDays > 0 ? new Date().getTime() + (expireDays * 24 * 60 * 60 * 1000) : ''
  return document.cookie = name + '=' + escape(val) + '; expires=' + cookie_expireDate.toUTCString() + '; path=/'
}

const sessionName = (() => {
  if(window.name) {
      window.name = new Date().getTime()
  }
  return 'sessionStorage' + window.name
})

let storageTemp = {
  localStorage,
  sessionStorage
}


export const localStorage = {
  get: () => {
    const cookie = getCookie('localStorage')
    setCookie('localStorage', '', 0)
    return cookie
  },
  set: val => storageTemp.localStorage = val
}

export const sessionStorage = {
  get: () => {
    const cookie = getCookie(sessionName)
    setCookie(sessionName, '', 0)
    return cookie
  },
  set: val => storageTemp.sessionStorage = val
}

window.addEventListener("beforeunload", function (event) {
  if (storageTemp.localStorage) setCookie('localStorage', storageTemp.localStorage)
  if (storageTemp.sessionStorage) setCookie(sessionName, storageTemp.sessionStorage)
})
