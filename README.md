# nuxt-vuex-localstorage
nuxt의 vuex와 webStorage를 연결하여 localStorage와 sessionStorage를 보다 더 쉽고 유용하게 사용 할 수 있습니다.  
다른 persist플러그인들과는 다르게 webStorage를 vuex에 일부 공간만 할당하여, webStorage의 낭비를 줄이고 기존 vuex의 활용과 병용할 수 있도록 하였습니다.  
  
여러 개의 브라우저 탭에서 localStorage를 통한 데이터 바인딩을 매우 쉽게 관리할 수 있습니다!
![Alt Text](https://github.com/rubystarashe/nuxt-vuex-localstorage/blob/master/localstorage.gif)

# 설치
```
npm i nuxt-vuex-localstorage
```

# Default(Auto) mode
가장 기본적인 로컬스토리지 암호화를 자동적으로 수행하는 기본 모드입니다
```js
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

localStorage.status 또는 sessionStorage.status 상태를 활용할 수 있습니다.
```html
<template>
<div v-show="loaded">
  {{ $store.state.localStorage.anyValues }}
  {{ $store.state.sessionStorage.anyValues }}
<div>
</template>

<script>
export default {
  computed: {
    loaded() {
      return $store.state.localStorage.status && $store.state.sessionStorage.status
    }
  }
}
</script>
```

# API mode
아래와 같이 모듈 옵션을 통해 API 주소와 키 이름을 부여하면, 해당 데이터를 불러와 암호화 키 값에 추가합니다.
```js
module.exports = {
  modules: [
    ['nuxt-vuex-localstorage', {
      mode: 'api',
      api: 'https://ipinfo.io', //  설정하지 않을 경우 기본값으로 이 값이 설정됩니다
      keyName: 'ip', //  설정하지 않을 경우 기본값으로 이 값이 설정됩니다
      hashName: 'loc' //  설정하지 않을 경우 기본값으로 이 값이 설정됩니다
    }]
  ]
}
```

# Manual mode
WebStorage와 자동으로 연결하지 않고, 수동 이벤트를 통해 키를 설정하여 WebStorage를 연결할 수 있습니다.
```js
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
    this.$setWebStorageKey(key, hash, keyMixTimes, keyLength)  // 원하는 값으로 암호화 키를 설정하세요
    //  key 또는 hash를 지정하지 않는 경우 자동으로 생성됩니다
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
module.exports = {
  modules: [
    ['nuxt-vuex-localstorage', {
      ...
      keyMixTimes: 64,  // 해시 함수의 반복 회수를 설정합니다. 기본값 64
      KeyLength: 64 // 완성된 키의 최종 길이를 설정합니다. 기본값 64
    }]
  ]
}
```

# 앞으로 개발될 내용
추가로 개발될 사항들은 다음과 같습니다.  
1. Safari 개인정보보호모드를 위한 localStorage polyfill
2. 개별 만료기간 설정
3. Electron 등 특수한 클라이언트 환경을 위한 json 모드
4. 디버깅
5. 코드 최적화
