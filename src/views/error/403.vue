<template>
  <div class="gwin-h5-error">
    <div class="gwin-h5-error__icon"></div>
    <div>抱歉，你访问的页面不存在</div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue-demi'

onMounted(() => {
  onPushState()
})

onUnmounted(() => {
  window.removeEventListener('popstate', onPushState, false)
})

/**
 * 阻止浏览器页面回退操作
 */
const onPushState = () => {
  // 按需使用：A→B→C就需要页面一进来的时候，就添加一个历史记录
  window.history.pushState(null, '', document.URL)
  // 给window添加一个popstate事件，拦截返回键
  window.addEventListener('popstate', function () {
    window.history.pushState(null, '', document.URL)
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('error') {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #6e6e6e;
  font-size: 16px;
  @include e('icon') {
    width: 160px;
    height: 100px;
    background: url('../../assets/img/error/403.png') no-repeat center;
    background-size: 160px 100px;
  }
  p {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
