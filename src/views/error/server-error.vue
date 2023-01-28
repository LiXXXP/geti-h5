<template>
  <div class="gwin-h5-error">
    <div class="gwin-h5-error__icon"></div>
    <div>哎呀，服务遇到了点小问题</div>
    <div class="gwin-h5-error__refresh" @click="onRefresh">刷新</div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function onRefresh() {
  router.go(-1)
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
    background: url('../../assets/img/error/server-error.png') no-repeat center;
    background-size: 160px 100px;
  }
  p {
    margin-top: 10px;
    text-align: center;
  }

  @include e(refresh) {
    width: 98px;
    height: 38px;
    margin-top: 30px;
    background: #3c7dff;
    border-radius: 19px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 38px;
    text-align: center;
  }
}
</style>
