<template>
  <div class="gwin-h5-error">
    <div class="gwin-h5-error__icon"></div>
    <div>抱歉，你访问的页面不存在</div>
  </div>
</template>

<script lang="ts" setup></script>

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
    background: url('../../assets/img/error/404.png') no-repeat center;
    background-size: 160px 100px;
  }
  p {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
