# nuxt-vuex-localstorage
Make use of local and session storage more efficiently by connecting Vuex and Web storage. Different from other persist plugins, by allocating just some particular objects of Vuex, Web storage can save more space and it can also be used with existing Vuex usage.  
  
Data binding through local storage can be easily managed in multiple browser tabs.
![Alt Text](https://i.imgur.com/5DAh6tT.gif)    

It provides various web storage security systems since it has strong data encrypting functionality.  
It provides ‘expireʼ function which is not supported on web storage.  
It supports “cookie mode” for some environment on which web storage is not supported, such as ‘Safari private modeʼ.

It works well in electron!

# Readme Translation
한국어 링크: <https://github.com/rubystarashe/nuxt-vuex-localstorage/blob/master/README-kor.md>

# Example
<https://github.com/rubystarashe/nuxt-vuex-localstorage-example>

# Installation
```
npm i nuxt-vuex-localstorage
```

# Default(Auto) mode
Most basic step where local storage is encrypted automatically.
```js
//  nuxt.config.js
module.exports = {
  modules: [
    'nuxt-vuex-localstorage'
  ]
}
```

It can easily be used or managed by adding local storage and session storage in Vuex store in next.  
```js
// store/localStorage.js
export const state = () => ({
  anyValues: 0
})

// store/sessionStorage.js
export const state = () => ({
  anyValues: 0
})
```

$localStorageLoaded and $sessionStorageLoaded or localStorage.status and sessionStorage.status are in use.
```html
<template>
<div v-show="loaded">
  {{ $localStorageLoaded }}
  {{ $sessionStorageLoaded }}
  {{ $store.state.localStorage.anyValues }}
  {{ $store.state.sessionStorage.anyValues }}
</div>
</template>

<script>
export default {
  computed: {
    loaded() {
      return this.$store.state.localStorage.status && this.$store.state.sessionStorage.status
    }
  }
}
</script>
```

How to store multiple stores on storage and rename storage store
```js
//  nuxt.config.js
module.exports = {
  modules: [
    ['nuxt-vuex-localstorage', {
      localStorage: ['foo', 'bar'],  //  If not entered, “localStorage” is the default value
      sessionStorage: ['sfoo', 'sbar']  //  If not entered, “sessionStorage” is the default value
    }]
  ]
}

// store/index.js
export const state = () => ({
  foo: {
    anyValues: 0
  },
  bar: {
    anyValues: 0
  },
  sfoo: {
    anyValues: 0
  },
  sbar: {
    anyValues: 0
  }
})
```

# API mode
If API address and key name are assigned by using module option, corresponding data is added to encryption key value.  
Basic usage is same as default mode.
```js
//  nuxt.config.js
module.exports = {
  modules: [
    ['nuxt-vuex-localstorage', {
      mode: 'api',
      api: 'https://ipinfo.io', //  If not entered, “https://ipinfo.io” is the default value
      keyName: 'ip', //  If not entered, “ip” is the default value
      saltName: 'region' //  If not entered, “region” is the default value
    }]
  ]
}
```

# Manual mode
Besides web storage can be connected automatically, it can also be manually connected by setting key value.
```js
//  nuxt.config.js
module.exports = {
  modules: [
    ['nuxt-vuex-localstorage', {
      mode: 'manual'
    }]
  ]
}
```
At first, insert status value (whether true or false) in store file of web storage.
```js
// store/localStorage.js or store/sessionStorage.js
export const state = () => ({
  ...
  status: false
})
```
Then, it may sounds obvious, you can connect to web storage by setting status
to true any time you want to connect.  
Also, it can be connect after setting encryption key value by using $setWebStorageKey method.
```html
<script>
export default {
  mounted() {
    this.$setWebStorageKey(key, salt, keyMixTimes, keyLength)
    //  If Key or salt values are not given, these are going to be generated automatically.
    //  keyTimes: number of repetitions of the hash function. Default is set to 64
    //  keyLength: the final length of the key. Default is set to 64
    this.$store.state.localStorage.status = true
    this.$store.state.sessionStorage.status = true
  }
}
</script>
```

# Additional security option
```js
//  nuxt.config.js
module.exports = {
  modules: [
    ['nuxt-vuex-localstorage', {
      ...
      keyMixTimes: 64,  // number of repetitions of the hash function. Default is set to 64
      KeyLength: 64 // length of the digest. Default is set to 64.
    }]
  ]
}
```

# Setting expiration time functionality
For each values, expiration time can be set by setting expire value.  
It also functions in the same way in such environment where cookies are used instead of web storage(i.e. browser secret mode). But in those environment, the data expiration time is set to 24 hours by default.
```js
export const state = () => ({
  test: {
    foo: 'foo',
    bar: 'bar',
    expire: 12  // 1 = 1 hour, 12 = 12 hours
  }
})
```
These time values are converted into string and saved in date format.

# Version Management
Version can be managed by adding a version prop. When the version is changed, the value of the storage is initialized with the value of the store when the refresh occurs. 
```js
// store/foo.js
export const state = () => ({
  bar: 0,
  version: 1  // The version doesn't have to be a number.
})
```
You can also use the option by changing the name of the version property. 
```js
//  nuxt.config.js
module.exports = {
  modules: [
    ['nuxt-vuex-localstorage', {
      ...
      versionPropName: 'storageVersion' //  If not entered, “version” is the default value
    }]
  ]
}

// store/foo.js
export const state = () => ({
  bar: 0,
  storageVersion: 1
})
```

# Usage with server side event
Since local storage updates as store changes, server side function such as fetch, asyncData can be used before components are mounted.
```html
<script>
export default {
  async fetch ({ store, params }) {
    let { data } = await axios.get('http://my-api/stars')
    store.state.localStorage.test.data = data
    // It is better to use commit. store.commit('localStorage/setTest', data)
  },
  ...
}
</script>
```

# IE transpile
```js
//  nuxt.config.js
module.exports = {
  ...
  build: {
   transpile: [
      'nuxt-vuex-localstorage'
    ],
    ...
  }
}
```

# Polyfill in environment where web storage is not supported
As mentioned before, in such environment, ‘cookie modeʼ will automatically activated. Also, to reduce unnecessary data junk of store data, synchronization only happens when loading or exiting the browser. Therefore, even though cookie mode is activated, cookie doesnʼt contain store data, so it will improve the app performance.
In this mode, it has 24 hours of expiration time, thus if it is not re-activated in 24 hours, the data will reset.


# How to force Cookie mode in an environment with browser storage support
If you want to use the same functionality using Cookie without using browser storage, you can try this.
```js
//  nuxt.config.js
module.exports = {
  modules: [
    ['nuxt-vuex-localstorage', {
      mode: 'cookie',
      expireHours: 24 //  If not entered, 24 is the default value
    }]
  ]
}
```
In this case, sessionStorage is used like localStorage and does not removed when the window is closed.
For some security issues and reduced network costs, cookie information is managed only when the site is loaded or terminated, and emptied when the site is in use.


# Debugging mode
Without encrypting.
```js
//  nuxt.config.js
module.exports = {
  modules: [
    ['nuxt-vuex-localstorage', {
      mode: 'debug'
    }]
  ]
}
```
