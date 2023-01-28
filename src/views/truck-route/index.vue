<template>
  <div class="gwin-h5-index">
    <div id="mapL" class="gwin-h5-map"></div>
    <div class="gwin-h5-index__panel">
      <div class="gwin-h5-index__init" @click="mapInit"></div>
      <div class="gwin-h5-index__panel-content">
        <img class="gwin-h5-index__bg" :src="cardBg" />
        <div class="gwin-h5-index__content">
          <div class="gwin-h5-car-box">
            <div>
              <div class="gwin-h5-car-box__title-box">
                <p class="gwin-h5-car-box__title">
                  {{ data.plateNo }}
                </p>
              </div>
            </div>
            <img class="gwin-h5-car-box__car-img" :src="carImg" />
          </div>
          <div class="gwin-h5-hr"></div>

          <div v-if="data.type === '1'" class="gwin-h5-order">
            <div class="gwin-h5-order__line">
              <span class="gwin-h5-order__label">当前位置：</span>
              <p class="gwin-h5-order__txt">{{ data.carInfo.detailAddress }}</p>
            </div>
            <div class="gwin-h5-order__line">
              <span class="gwin-h5-order__label">时速：</span>
              <p class="gwin-h5-order__txt">{{ data.carInfo.speed }}km/h</p>
            </div>
            <div class="gwin-h5-order__line">
              <span class="gwin-h5-order__label">方向：</span>
              <p class="gwin-h5-order__txt">{{ data.directionTxt }}</p>
            </div>
          </div>
          <div v-if="data.type === '2'" class="gwin-h5-order">
            <div class="gwin-h5-order__line">
              <span class="gwin-h5-order__label">时间：</span>
              <p class="gwin-h5-order__txt">{{ data.startTime }} - {{ data.endTime }}</p>
            </div>
            <div class="gwin-h5-order__line">
              <span class="gwin-h5-order__label">起点：</span>
              <p class="gwin-h5-order__txt">{{ data.routeInfo.departureAddress }}</p>
            </div>
            <div class="gwin-h5-order__line">
              <span class="gwin-h5-order__label">终点：</span>
              <p class="gwin-h5-order__txt">{{ data.routeInfo.destinationAddress }}</p>
            </div>
            <div class="gwin-h5-order__line">
              <span class="gwin-h5-order__label">里程：</span>
              <p class="gwin-h5-order__txt">{{ data.routeInfo.totalDistance }}km</p>
            </div>
            <div class="gwin-h5-order__line">
              <span class="gwin-h5-order__label">停留次数：</span>
              <p class="gwin-h5-order__txt">{{ data.abnormalNum }}次</p>
            </div>
            <div v-if="data.routeInfo.historyRouteList" class="gwin-h5-order__trajectory" @click="toTrajectory">
              轨迹回放
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import cardBg from '@/assets/img/truck/card-bg.png'
import carImg from '@/assets/img/truck/icon-card-car.png'

import indexConfig from './index-config'

const { mapInit, data, toTrajectory } = indexConfig()
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

@include b(index) {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  @include e(panel) {
    position: relative;
    left: 0;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px 10px 10px;
    width: 100%;
    background: linear-gradient(180deg, #e8f2fb 0%, #ffffff 100%);
  }

  @include e(panel-content) {
    width: 100%;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    position: relative;
  }

  @include e(bg) {
    position: absolute;
    width: 100%;
    left: 0;
  }

  @include e(content) {
    width: 100%;
    overflow: auto;
    position: relative;
  }

  @include e(init) {
    position: absolute;
    right: 10px;
    top: -40px;
    width: 30px;
    height: 30px;
    background-image: url('../../assets/img/truck/icon-init.png');
    background-size: 100%;
  }
}

@include b(map) {
  width: 100%;
  flex: 1;
}

@include b(hr) {
  width: 100%;
  height: 1px;
  background-color: hsla(228, 50%, 92%, 0.3);
}

@include b(car-box) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 16px 9px 20px;

  @include e(car-img) {
    width: 60px;
    height: 60px;
  }

  @include e(title-box) {
    display: flex;
    align-items: center;
  }

  @include e(title) {
    font-size: 20px;
    font-family: Roboto-Bold, Roboto;
    font-weight: bold;
    color: #1a2234;
    flex-shrink: 0;
  }

  @include e(status) {
    margin-left: 10px;
    width: 48px;
    height: 20px;
    border-radius: 8px 0px 8px 0px;
    text-align: center;
    font-size: 12px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
  }

  @include e(route) {
    border: 1px solid transparent;
    color: #ffffff;
    background: linear-gradient(180deg, #8bb2ff 0%, #4785ff 100%);
    text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
  }

  @include e(arrive) {
    border: 1px solid #4785ff;
    color: #4785ff;
  }

  @include e(finish) {
    border-radius: 8px 0px 8px 0px;
    border: 1px solid #999999;
    color: #999999;
  }

  @include e(person-box) {
    display: flex;
    align-items: center;
    margin-top: 16px;
  }

  @include e(person) {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1a2234;
  }

  @include e(hr) {
    width: 1px;
    height: 10px;
    background-color: #999999;
    margin: 0 10px;
  }
}

@include b(order) {
  width: 100%;
  padding: 20px;
  position: relative;

  @include e(line) {
    display: flex;
    margin-top: 12px;
    align-items: flex-start;

    &:first-child {
      margin-top: 0;
    }
  }

  @include e(label) {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606a78;
    flex-shrink: 0;
  }

  @include e(txt) {
    margin-left: 10px;
    font-size: 14px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
    color: #606a78;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 20px;
  }

  @include e(trajectory) {
    position: absolute;
    right: 20px;
    bottom: 20px;
    border: 1px solid #eeeeee;
    padding: 8px 20px;
    font-size: 14px;
    background: #3c7dff;
    box-shadow: 0px 1px 2px 0px rgba(60, 125, 255, 0.2);
    border-radius: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    letter-spacing: 2px;
  }
}
</style>
