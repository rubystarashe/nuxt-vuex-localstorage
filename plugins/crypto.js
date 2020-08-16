import { pbkdf2Sync, createCipher, createDecipher } from 'crypto'
import axios from 'axios'

export default class Crypto {
  constructor (options = {}, ctx) {
    return (async () => {
      this.ctx = ctx
      this.options = options || {}
      const title = this.ctx.app.head.title
      let key = (navigator.userAgent.toLowerCase() || '')
      let salt = (title || '')
      if (options.mode === 'api') {
        const get = this.options.api ? await axios.get(this.options.api) : await axios.get('https://ipinfo.io')
        const keyName = this.options.keyName || 'ip'
        const saltName = this.options.saltName || 'region'
        key += get.data[keyName]
        salt += get.data[saltName]
      }
      this.key = pbkdf2Sync(key, salt, 64, 64, 'sha512').toString('base64')
      return this
    })()
  }

  setKey (key, salt, keyMixTimes, keyLength) {
    this.key = pbkdf2Sync(key || navigator.userAgent.toLowerCase(), salt || title, keyMixTimes || 64,  keyLength || 64, 'sha512').toString('base64')
  }

  encrypt (data) {
    if (this.options.mode === 'debug') return data
    else {
      try {
        this.cipher = createCipher(this.options.type || 'aes-256-cbc', this.key)
        let res = this.cipher.update(data, 'utf8', 'base64')
        res += this.cipher.final('base64')
        return res
      } catch (e) {
        return null
      }
    }
  }
  decrypt (data) {
    try {
      this.decipher = createDecipher(this.options.type || 'aes-256-cbc', this.key)
      let res = this.decipher.update(data, 'base64', 'utf8')
      res += this.decipher.final('utf8')
      return res
    } catch (e) {
      if (this.options.mode === 'debug') return data
      else return null
    }
  }
}
