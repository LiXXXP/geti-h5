<template>
  <div class="gwin-h5-home">
    <van-radio-group v-model="queryType" class="gwin-h5-home__rg" direction="vertical">
      <div class="gwin-h5-vehicle" :class="{ 'is-bor': queryType === '1' }">
        <div class="gwin-h5-vehicle__title">
          车辆实时位置查询
          <div class="gwin-h5-vehicle__before">
            <div></div>
          </div>
          <van-radio name="1" shape="round"></van-radio>
        </div>
        <div class="gwin-h5-vehicle__selCar" :class="{ 'is-fil': queryType !== '1' }">
          <div class="gwin-h5-input">
            <img class="gwin-h5-input__img" src="@/assets/img/home/numberPlate.png" alt="" />
            <van-field
              v-model="plateNo"
              class="gwin-h5-input__field"
              maxlength="10"
              placeholder="请输入货车车牌号查询"
              readonly
              @click="onInputPlateNoClick(1)"
            />
            <div class="gwin-h5-input__right" @click="colorSel(1)">
              <span>{{ plateNoColor }}</span>
              <img src="@/assets/img/home/icon-down.png" alt="" />
            </div>
          </div>

          <!-- <text @click="carSel(1)">选择车辆</text> -->
        </div>
      </div>
      <div class="gwin-h5-vehicle" :class="{ 'is-bor': queryType === '2' }">
        <div class="gwin-h5-vehicle__title">
          车辆历史轨迹查询
          <div class="gwin-h5-vehicle__before">
            <div></div>
          </div>
          <van-radio name="2"></van-radio>
        </div>
        <div class="gwin-h5-vehicle__selCar" :class="{ 'is-fil': queryType !== '2' }">
          <div class="gwin-h5-input">
            <img class="gwin-h5-input__img" src="@/assets/img/home/numberPlate.png" alt="" />
            <van-field
              v-model="plateNoHistory"
              class="gwin-h5-input__field"
              maxlength="10"
              placeholder="请输入货车车牌号查询"
              readonly
              @click="onInputPlateNoClick(2)"
            />
            <div class="gwin-h5-input__right" @click="colorSel(2)">
              <span>{{ plateHistoryColor }}</span>
              <img src="@/assets/img/home/icon-down.png" alt="" />
            </div>
          </div>
          <!-- <text @click="carSel(2)">选择车辆</text> -->
        </div>
        <div class="gwin-h5-vehicle__selCar" :class="{ 'is-fil': queryType !== '2' }">
          <div class="gwin-h5-input">
            <img class="gwin-h5-input__img gwin-h5-input__img--map" src="@/assets/img/home/map.png" alt="" />
            <span class="gwin-h5-input__text">轨迹区间</span>
          </div>
        </div>
        <div class="gwin-h5-vehicle__selTime" :class="{ 'is-fil': queryType !== '2' }">
          <div class="gwin-h5-vehicle__time">
            <div @click="onStartTimeClick">
              <van-field v-model="startingTime" class="gwin-h5-vehicle__field" readonly placeholder="开始时间" />
            </div>
            <span>至</span>
            <div @click="onEndTimeClick">
              <van-field
                v-model="endTime"
                class="gwin-h5-vehicle__field"
                input-align="right"
                readonly
                placeholder="结束时间"
              />
            </div>
          </div>
          <div class="gwin-h5-vehicle__describe">提示：单次只能查询车辆近半年24小时内的行驶轨迹</div>
        </div>
      </div>
    </van-radio-group>
    <div class="gwin-h5-home__protocol">
      <van-checkbox v-model="protocol" name="1" active-color="#3C7DFF" @click="onProtocolCheckboxChange">
        我已同意并知晓
      </van-checkbox>
      <span @click="onProtocolClick">《隐私政策》</span>
    </div>
    <div class="gwin-h5-home__inquire" :class="{ 'is-active': inquireShow }" @click="inquire">开始查询</div>
    <div class="gwin-h5-home__time">
      <!-- 时间 -->
      <van-datetime-picker
        v-show="timeShow"
        v-model="timeData"
        cancel-color="#606A78"
        confirm-color="#3860F4"
        visible-item-count="5"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        mode="datetime"
        @confirm="onDatePickerConfirm"
        @cancel="timeShow = false"
      ></van-datetime-picker>
      <!-- 车辆 -->
      <van-picker v-show="colorShow" :columns="carColorList" @confirm="onConfirm" @cancel="colorShow = false" />
    </div>
    <keyboard
      v-model:show="keyBoardShow"
      @change="onKeyboardChange"
      @backspace="onKeyboardBackspace"
      @cancel="onKeyboardCancel"
      @confirm="onKeyboardConfirm"
    ></keyboard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { Toast } from 'vant'
import HomeApi from '@/api/home'
import { useRouter } from 'vue-router'
import Keyboard from '@/components/Keyboard/index.vue'

const router = useRouter()
// 查询类型
const queryType = ref('1')
let carIndex = 1
// 实时查询
const plateNo = ref('')
const plateNoColor = ref('黄牌')

// 历史查询
const plateNoHistory = ref('')
const plateHistoryColor = ref('黄牌')

// 车牌输入
const keyBoardShow = ref(false)

// 颜色选择
const colorShow = ref(false)
const carColorList = ['黄牌', '蓝牌', '黄绿牌']

// 时间选择
const timeShow = ref(false)
const timeData = ref(new Date(dayjs().valueOf() - 86400000))
const minDate = ref(new Date(dayjs().valueOf() - 15768000000))
const maxDate = ref(new Date())

let startingTimeNum = 0
let timeIndex = 0

const startingTime = ref('')
const endTime = ref('')

const protocol = ref(true)
const inquireShow = ref(true)

function onInputPlateNoClick(index: number) {
  keyBoardShow.value = true
  carIndex = index
}

function colorSel(index: any) {
  colorShow.value = true
  carIndex = index
}

function onConfirm(e: any) {
  colorShow.value = false
  if (carIndex === 1) {
    plateNoColor.value = e
  } else {
    plateHistoryColor.value = e
  }
}

// 开始时间点击
function onStartTimeClick() {
  timeIndex = 1
  minDate.value = new Date(dayjs().valueOf() - 15768000000)
  maxDate.value = new Date()
  timeShow.value = true
}

function onEndTimeClick() {
  timeShow.value = true
  timeIndex = 2
  minDate.value = new Date(startingTimeNum)
  maxDate.value = new Date(startingTimeNum + 86400000)
}

function onProtocolCheckboxChange() {
  inquireShow.value = !inquireShow.value
}

function onProtocolClick() {
  router.push('/agreement')
}

function inquire() {
  // 查询
  if (queryType.value === '1') {
    if (plateNo.value === '') {
      Toast({
        message: '请输入车牌号',
        duration: 2000
      })
      return
    }
  } else {
    if (plateNoHistory.value === '') {
      Toast({
        message: '请输入车牌号',
        duration: 2000
      })
      return
    }
    if (startingTime.value === '') {
      Toast({
        message: '请选择轨迹开始时间',
        duration: 2000
      })
      return
    }
    if (endTime.value === '') {
      Toast({
        message: '请选择轨迹结束时间',
        duration: 2000
      })
      return
    }
  }
  if (protocol.value) {
    const car = queryType.value === '1' ? plateNo.value : plateNoHistory.value
    const color = queryType.value === '1' ? plateNoColor.value : plateHistoryColor.value
    const reg = /[^x00-xff]([A-Z0-9]){6,7}?$/
    if (!reg.test(car)) {
      Toast({
        message: '车牌号格式错误，请重新输入',
        duration: 2000
      })
      return
    }
    checkCar(color, car)
  } else {
    Toast({
      message: '请阅读并同意条款',
      duration: 2000
    })
  }
}

function checkCar(plateColor: string, plateNo: string) {
  const color = plateColor === '黄牌' ? 2 : plateColor === '蓝牌' ? 1 : 3
  const baseInfo = {
    plateColor: color,
    plateNo: plateNo
  }
  HomeApi.checkCar(baseInfo)
    .then((res) => {
      const data = res.body as any
      if (data.flag) {
        // uni.navigateTo({
        //   url: '/pages/url/index?type=' + this.carData + '&plateNo=' + plateNo + '&startTime=' + this.startingTime + '&endTime=' + this.endTime + '&plateColor=' + color
        // });
        const url = `/truckRoute?type=${queryType.value}&plateNo=${plateNo}&startTime=${startingTime.value}&endTime=${endTime.value}&plateColor=${color}`
        router.push(url)
      } else {
        Toast({
          message: '该车无查询权限，请联系客服',
          duration: 2000
        })
      }
    })
    .catch(() => {
      Toast({
        message: '请求错误，请重试！',
        duration: 2000
      })
    })
}

function formatter(type: string, value: any) {
  if (type === 'year') {
    return `${value}年`
  }
  if (type === 'month') {
    return `${value}月`
  }
  if (type === 'day') {
    return `${value}日`
  }
  if (type === 'hour') {
    return `${value}时`
  }
  if (type === 'minute') {
    return `${value}分`
  }
  return value
}

function onDatePickerConfirm(e: any) {
  startingTimeNum = dayjs(e).valueOf()
  timeShow.value = false
  // const time = timeFormat(e.value / 1000)
  const time = dayjs(e).format('YYYY/MM/DD HH:mm')

  if (timeIndex === 1) {
    startingTime.value = time
  } else {
    endTime.value = time
  }
}

function onKeyboardChange(e: string) {
  if (queryType.value === '1') {
    plateNo.value += e
  } else {
    plateNoHistory.value += e
  }
}

function onKeyboardBackspace() {
  if (queryType.value === '1') {
    if (plateNo.value.length) {
      plateNo.value = plateNo.value.substring(0, plateNo.value.length - 1)
    }
  } else {
    if (plateNoHistory.value.length) {
      plateNoHistory.value = plateNoHistory.value.substring(0, plateNoHistory.value.length - 1)
    }
  }
}

function onKeyboardCancel() {
  keyBoardShow.value = false
}

function onKeyboardConfirm() {
  const reg = /[^x00-xff]([A-Z0-9]){6,7}?$/
  if (queryType.value === '1') {
    if (!reg.test(plateNo.value)) {
      Toast({
        message: '车牌号格式错误，请重新输入',
        duration: 2000
      })
      return
    }
  } else {
    if (!reg.test(plateNoHistory.value)) {
      Toast({
        message: '车牌号格式错误，请重新输入',
        duration: 2000
      })
      return
    }
  }
  keyBoardShow.value = false
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

@include b(home) {
  width: 100%;
  height: 100vh;
  background: #f7f8fa;
  font-size: 14px;
  color: #1a2234;
  @include e(rg) {
    width: 100%;
    // height: 160px;
    background: linear-gradient(180deg, #3c7dff 0%, rgba(60, 125, 255, 0.62) 61%, rgba(60, 125, 255, 0) 100%) no-repeat;
    backdrop-filter: blur(10px);
    background-size: 100% 160px;
    padding-top: 10px;
  }

  @include e(protocol) {
    padding: 20px 0;
    display: flex;
    justify-content: center;
    span {
      font-weight: 400;
      color: #3860f4;
    }
  }

  @include e(inquire) {
    width: 319px;
    height: 44px;
    background: #d4d8de;
    border-radius: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;

    @include when(active) {
      background: #3c7dff;
    }
  }

  @include e(time) {
    position: fixed;
    width: 100%;
    bottom: 50px;
  }
}

@include b(vehicle) {
  z-index: 100;
  background: #ffffff;
  border-radius: 10px;
  margin: 10px 10px;
  border: 2px solid #fff;

  @include when(bor) {
    border: 2px solid #3c7dff !important;
  }

  @include e(title) {
    font-size: 16px;
    font-weight: 600;
    color: #1a2234;
    display: flex;
    justify-content: space-between;
    padding: 15px 10px;
    border-bottom: 1px solid #e1e5f5;
    position: relative;
  }

  @include e(before) {
    ::before {
      content: '';
      width: 128px;
      height: 6px;
      background: rgba(60, 125, 255, 0.2);
      position: absolute;
      left: 10px;
      top: 30px;
    }
  }

  @include e(selCar) {
    display: flex;
    justify-content: space-between;
    padding: 15px 10px;
    align-items: center;

    @include when(fil) {
      filter: blur(5px);
      pointer-events: none;
    }
  }

  @include e(map) {
    img {
      width: 18px;
      height: 18px;
      margin-right: 10px;
    }
    text {
      font-size: 14px;
    }
  }

  @include e(selTime) {
    padding: 10px 20px;

    @include when(fil) {
      filter: blur(5px);
      pointer-events: none;
    }
  }

  @include e(time) {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 500;
    padding-bottom: 20px;
    align-items: center;
    span {
      color: #1a2234;
    }
  }

  @include e(describe) {
    background: #f7f8fa;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 400;
    color: #606a78;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @include e(field) {
    padding: 10px 5px !important;
  }
}

@include b(input) {
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  height: 20px;
  @include e(img) {
    width: 18px;
    height: 14px;
    margin-right: 10px;

    @include m(map) {
      height: 18px;
    }
  }
  @include e(field) {
    flex: 1;
    color: #1a2234;
  }
  @include e(text) {
    font-size: 14px;
  }
  @include e(right) {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    img {
      margin-left: 5px;
      width: 6px;
      height: 4px;
    }
    span {
      font-size: 14px;
      font-weight: 500;
      color: #3c7dff;
    }
  }
}
</style>
