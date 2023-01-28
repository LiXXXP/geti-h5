<template>
  <div class="gwin-h5-about">
    <div class="gwin-h5-about__logo">
      <img src="@/assets/img/about/logo.png" alt="" />
      <text>灰鲸智航数字技术有限公司</text>
    </div>
    <div class="gwin-h5-about__cell">
      <van-cell-group>
        <van-cell title="公司介绍" is-link url="/about/company?type=company"></van-cell>
        <van-cell title="服务优势" is-link url="/about/company?type=serve"></van-cell>
        <van-cell title="联系我们" is-link url="/about/company?type=tel"></van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

@include b(about) {
  @include e(logo) {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 240px;
    justify-content: center;
    img {
      width: 60px;
      height: 35px;
    }
    text {
      margin-top: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #131313;
    }
  }
  @include e(cell) {
    margin-top: 85px;
    padding: 0 20px;
  }
}
</style>
