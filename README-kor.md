# nuxt-vuex-localstorage
nuxt의 vuex와 webStorage를 연결하여 localStorage와 sessionStorage를 보다 더 쉽고 유용하게 사용 할 수 있습니다.  
다른 persist플러그인들과는 다르게 webStorage를 vuex에 일부 공간만 할당하여, webStorage의 낭비를 줄이고 기존 vuex의 활용과 병용할 수 있도록 하였습니다.  
  
여러 개의 브라우저 탭에서 localStorage를 통한 데이터 바인딩을 매우 쉽게 관리할 수 있습니다!
![Alt Text](https://i.imgur.com/5DAh6tT.gif)    

강력한 암호화 기능으로 다양한 webStorage 보안 기능을 제공합니다.  
webStorage에서 지원하지 않는 expire설정을 추가로 지원합니다.  
Safari 개인정보보호모드 등 webStorage가 지원되지 않는 환경을 위하여 cookie모드가 자동 지원됩니다.

일렉트론에서도 잘 작동합니다!

# 예제
<https://github.com/rubystarashe/nuxt-vuex-localstorage-example>

# 설치
```
npm i nuxt-vuex-localstorage
```

# Default(Auto) mode
가장 기본적인 로컬스토리지 암호화를 자동적으로 수행하는 기본 모드입니다
```js
//  nuxt.config.js
module.exports = {
  modules: [
    'nuxt-vuex-localstorage'
  ]
}
```

nuxt의 vuex 스토어에 localStorage나 sessionStorage 를 추가하여 쉽게 사용, 관리할 수 있습니다.  
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

$localStorageLoaded 와 $sessionStorageLoaded 또는 localStorage.status 와 sessionStorage.status 상태를 활용할 수 있습니다.
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

스토리지 스토어 이름 변경 및 여러개의 스토어를 스토리지에 저장하는 방법  
```js
//  nuxt.config.js
module.exports = {
  modules: [
    ['nuxt-vuex-localstorage', {
      localStorage: ['foo', 'bar'],  //  설정하지 않을 경우 'localStorage' 가 기본값으로 설정됩니다
      sessionStorage: ['sfoo', 'sbar']  //  설정하지 않을 경우 'sessionStorage' 가 기본값으로 설정됩니다
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
아래와 같이 모듈 옵션을 통해 API 주소와 키 이름을 부여하면, 해당 데이터를 불러와 암호화 키 값에 추가합니다.  
일반적인 사용법은 Default 모드와 동일합니다.
```js
//  nuxt.config.js
module.exports = {
  modules: [
    ['nuxt-vuex-localstorage', {
      mode: 'api',
      api: 'https://ipinfo.io', //  설정하지 않을 경우 기본값으로 이 값이 설정됩니다
      keyName: 'ip', //  설정하지 않을 경우 기본값으로 이 값이 설정됩니다
      saltName: 'region' //  설정하지 않을 경우 기본값으로 이 값이 설정됩니다
    }]
  ]
}
```

# Manual mode
WebStorage와 자동으로 연결하지 않고, 수동 이벤트를 통해 키를 설정하여 WebStorage를 연결할 수 있습니다.
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
먼저, 사용하실 WebStorage 의 store 파일에 status 상태를 추가하세요
```js
// store/localStorage.js 또는 store/sessionStorage.js
export const state = () => ({
  ...
  status: false
})
```
그런다음, 원하는 때에 WebStorage를 연결하세요! status상태를 true로 변경하는 것 만으로 즉시 연결됩니다.  
$setWebStorageKey 메소드를 사용하여 암호화 키를 설정한 다음 연결하실 수도 있습니다.
```html
<script>
export default {
  mounted() {
    this.$setWebStorageKey(key, salt, keyMixTimes, keyLength)  // 원하는 값으로 암호화 키를 설정하세요
    //  key 또는 salt를 지정하지 않는 경우 자동으로 생성됩니다
    //  keyTimes: 해시 함수의 반복 회수를 설정합니다. 기본값 64
    //  keyLength: 완성된 키의 최종 길이를 설정합니다. 기본값 64
    this.$store.state.localStorage.status = true
    this.$store.state.sessionStorage.status = true
  }
}
</script>
```

# 추가적인 보안 옵션
```js
//  nuxt.config.js
module.exports = {
  modules: [
    ['nuxt-vuex-localstorage', {
      ...
      keyMixTimes: 64,  // 해시 함수의 반복 회수를 설정합니다. 기본값 64
      KeyLength: 64 // 다이제스트 길이를 설정합니다. 기본값 64
    }]
  ]
}
```

# 만료 시간 설정 기능
Expire 값을 설정하는 것으로 각각의 값들의 만료 시간을 설정할 수 있습니다.  
Safari 개인정보보호모드 등 webStorage대신 cookie를 사용하는 환경의 경우에도 같은 방식으로 작동됩니다.  
cookie방식으로 동작하는 환경에서는 전체 데이터의 만료 시간이 24시간을 기본값으로 설정됩니다.
```js
export const state = () => ({
  test: {
    foo: 'foo',
    bar: 'bar',
    expire: 12  // 숫자 1당 1시간으로 자동 계산됩니다.
  }
})
```
해당 값으로 생성된 만료 시간은 String으로 치환된 Date형식으로 저장됩니다.

# 스토리지된 스토어의 버전 관리
해당 스토어에 버전 항목을 추가하는 것으로 손쉽게 버전을 관리할 수 있습니다. 버전이 변경되면 새로고침 시 해당 스토어의 값으로 스토리지의 값이 초기화됩니다. 
```js
// store/foo.js
export const state = () => ({
  bar: 0,
  version: 1  // 버전은 숫자일 필요가 없습니다
})
```
옵션을 통해 버전 속성의 이름을 변경하여 사용할 수도 있습니다.  
```js
//  nuxt.config.js
module.exports = {
  modules: [
    ['nuxt-vuex-localstorage', {
      ...
      versionPropName: 'storageVersion' //  지정하지 않을 경우 기본값은 'version'
    }]
  ]
}

// store/foo.js
export const state = () => ({
  bar: 0,
  storageVersion: 1
})
```

# Server side event를 연계한 사용
store의 변경에 따라 localStorage를 즉시 연동하기 때문에, 컴포넌트가 mounted되지 않더라도 접근할 수 있어 fetch, asyncData와 같은 Server Side와 통신하는 단계의 이벤트에서도 localStorage기능을 매끄럽게 사용가능합니다.
```html
<script>
export default {
  async fetch ({ store, params }) {
    let { data } = await axios.get('http://my-api/stars')
    store.state.localStorage.test.data = data
    // 실제 사용에서는 commit을 사용하는것이 좋습니다. store.commit('localStorage/setTest', data)
  },
  ...
}
</script>
```

# IE 에서의 사용
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

# webStorage가 지원되지 않는 환경에서의 polyfill
Safari 개인정보보호모드 등 webStorage가 지원되지 않는 환경에서는 자동으로 cookie모드를 통해 실행됩니다.  
또한, store데이터가 cookie용량을 낭비하지 않게끔 하기 위해 브라우저가 로딩될때와 종료되기 전에만 동기화 합니다.  
따라서 cookie모드를 사용하더라도 앱이 활성화된 동안에는 cookie가 store데이터를 갖고있지 않기 때문에 더 가볍게 작동합니다. 
cookie모드의 경우 24시간의 환기 주기를 갖고 있습니다. 따라서 24시간 안에 cookie모드로 앱을 한번 이상 활성화시키지 않으면 해당 데이터는 초기화됩니다.


# Cookie 모드 강제 사용
브라우저 스토리지를 사용하지 않고 Cookie 를 사용하여 동일한 기능을 구현하려면, 다음과 같이 이용하시면 됩니다.
```js
//  nuxt.config.js
module.exports = {
  modules: [
    ['nuxt-vuex-localstorage', {
      mode: 'cookie',
      expireHours: 24 //  지정하지 않을 경우 기본값은 24
    }]
  ]
}
```
이 경우, sessionStorage 는 localStorage 처럼 이용되며, 창을 닫더라도 휘발되지 않습니다.
몇가지 보안 문제와 네트워크 비용 감소를 위하여 쿠키 정보는 사이트가 로딩되거나 종료될 때에만 관리되고, 사이트를 이용 중일때에는 비워집니다.


# 디버깅 모드
디버깅을 위해 웹스토리지 암호화 기능을 비활성화합니다. 이 기능은 암호화 기능을 사용하지 않는 트리거로 활용되어선 안됩니다.
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
