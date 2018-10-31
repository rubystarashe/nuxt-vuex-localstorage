# nuxt-vuex-localstorage
이 모듈은 아직 제작중입니다.  
nuxt의 vuex와 localStorage를 연결하여 localStorage를 보다 더 쉽고 유용하게 사용 할 수 있습니다.  
다른 persist플러그인들과는 다르게 localStorage를 vuex에 일부 공간만 할당하여, localStorage의 낭비를 줄이고 기존 vuex의 활용과 병용할 수 있도록 하였습니다.  
  
여러 개의 브라우저 탭에서 localStorage를 통한 데이터 바인딩을 매우 쉽게 관리할 수 있습니다!
![Alt Text](https://github.com/rubystarashe/nuxt-vuex-localstorage/blob/master/localstorage.gif)

# 설치
```
npm i nuxt-vuex-localstorage
```

```js
module.exports = {
  modules: [
    'nuxt-vuex-localstorage'
  ]
}
```

nuxt의 vuex 스토어에 localStorage 를 추가하여 쉽게 사용, 관리할 수 있습니다.  
```js
// store/localStorage.js
export const state = () => ({
  anyValues: 0
})
```

localStorage.loaded 상태를 활용할 수 있습니다.
```html
<template>
<div v-show="$store.state.localStorage.loaded">
  {{ $store.state.localStorage.anyValues }}
<div>
</template>
```

추가로 개발될 사항들은 다음과 같습니다.  
1. Safari 개인정보보호모드를 위한 localStorage polyfill
2. 웹스토리지 자체 암호화 보안기능
3. 개별 만료기간 설정
4. Electron 등 특수한 클라이언트 환경을 위한 json 모드
