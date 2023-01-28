<template>
  <div class="gwin-h5-index">
    <div id="mapA" class="gwin-h5-map"></div>
    <div class="gwin-h5-index__panel">
      <div class="gwin-h5-index__init" @click="mapInit"></div>
      <div class="gwin-h5-index__panel-content">
        <div v-show="!data.speedBlock">
          <div class="gwin-h5-order__title">轨迹回放</div>
          <div class="gwin-h5-hr"></div>

          <div class="gwin-h5-order">
            <van-slider
              v-model="playerData.sliderVal"
              bar-height="4px"
              active-color="#4785FF"
              :step="0.001"
              @change="sliderChange"
            />
            <div class="gwin-h5-time-box">
              <span class="gwin-h5-time-box__time-txt">{{ playerData.passedTime }}</span>
              <span class="gwin-h5-time-box__time-txt">{{ playerData.totalTime }}</span>
            </div>
            <div class="gwin-h5-player">
              <div class="gwin-h5-player__double-speed" @click="data.speedBlock = true">
                <div class="gwin-h5-order__label">倍速：</div>
                <div class="gwin-h5-order__txt gwin-h5-player__speed-txt">X{{ playerData.times }}</div>
                <img class="gwin-h5-player__speed-img" :src="speedIcon" />
              </div>
              <img
                v-if="!playerData.isPlay"
                class="gwin-h5-player__player-img"
                :src="startIcon"
                @click="navgControl(playerData.playIcon)"
              />
              <img v-else class="gwin-h5-player__player-img" :src="pauseIcon" @click="navgControl('pause')" />
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
          </div>
        </div>
        <div v-show="data.speedBlock">
          <van-picker title="" :columns="doubleSpeed" :default-index="3" @confirm="onConfirm" @cancel="onCancel" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import speedIcon from '@/assets/img/truck/icon-down.png'
import startIcon from '@/assets/img/truck/icon-start.png'
import pauseIcon from '@/assets/img/truck/icon-pause.png'
import indexConfig1 from './index-config'

const { mapInit, data, playerData, doubleSpeed, onConfirm, onCancel, navgControl, sliderChange } = indexConfig1()
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
    background: #ffffff;
    border-radius: 10px 10px 0px 0px;
  }

  @include e(panel-content) {
    width: 100%;
    background: #ffffff;
    border-radius: 10px 10px 0 0;
    position: relative;
    margin-top: -10px;
    overflow: hidden;
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
    top: -50px;
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

@include b(order) {
  width: 100%;
  position: relative;
  margin-top: 32px;
  padding: 0 20px 20px 20px;
  @include e(title) {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #1a2234;
    text-align: center;
    padding: 15px 0;
  }

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

@include b(time-box) {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;

  @include e(time-txt) {
    font-size: 12px;
    font-family: Roboto-Regular;
    font-weight: 400;
    color: #606a78;
  }
}

@include b(player) {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @include e(double-speed) {
    display: flex;
    align-items: center;
  }

  @include e(speed-txt) {
    color: #3c7dff;
  }

  @include e(speed-img) {
    margin-left: 5px;
    width: 6px;
    height: 4px;
  }

  @include e(player-img) {
    width: 40px;
    height: 40px;
  }
}

:deep {
  .van-slider__button {
    width: 15px;
    height: 24px;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #4885ff;
  }

  .el-slider__bar {
    background: linear-gradient(180deg, #8bb2ff 0%, #4785ff 100%);
    border-radius: 2px;
  }

  .el-slider__runway {
    background: #f6f6f6;
    border-radius: 2px;
  }

  .van-picker__toolbar {
    background: #f9fafb;
    border-radius: 10px 10px 0 0;
    height: 56px;
  }

  .van-picker__cancel,
  .van-picker__confirm {
    font-size: 16px;
  }

  .van-picker__confirm {
    color: #3c7dff;
  }
}
</style>
