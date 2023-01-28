<template>
  <div class="gwin-h5-keyboard">
    <div
      v-for="(group, i) in abc ? engKeyBoardList : areaList"
      :key="i"
      class="gwin-h5-keyboard__button"
      :class="[i + 1 === 4 && 'gwin-h5-keyboard__button--center']"
    >
      <div v-if="i === 3" class="gwin-h5-keyboard__buttonInnerWrapper">
        <div class="gwin-h5-keyboard__buttonInnerWrapperLeft" @click="changeCarInputMode">
          <span
            class="gwin-h5-keyboard__buttonInnerWrapperLeftLang"
            :class="[!abc && 'gwin-h5-keyboard__buttonInnerWrapperLeftLang--active']"
          >
            中
          </span>
          <span class="gwin-h5-keyboard__buttonInnerWrapperLeftLine">/</span>
          <span
            class="gwin-h5-keyboard__buttonInnerWrapperLeftLang"
            :class="[abc && 'gwin-h5-keyboard__buttonInnerWrapperLeftLang--active']"
          >
            英
          </span>
        </div>
      </div>
      <div v-for="(item, j) in group" :key="j" class="gwin-h5-keyboard__buttonInnerWrapper">
        <div class="gwin-h5-keyboard__buttonInnerWrapperInner" @click="carInputClick(i, j)">
          <span class="gwin-h5-keyboard__buttonInnerWrapperInnerText">{{ item }}</span>
        </div>
      </div>
      <div
        v-if="i === 3"
        class="gwin-h5-keyboard__buttonInnerWrapper"
        @touchstart="backspaceClick"
        @touchend="clearTimer"
      >
        <div class="gwin-h5-keyboard__buttonInnerWrapperRight">
          <van-icon size="28px" name="revoke" color="#303133" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { sleep } from '@/utils'

const emit = defineEmits(['change', 'backspace'])

const areaList = computed(() => {
  const data = [
    '京',
    '沪',
    '粤',
    '津',
    '冀',
    '豫',
    '云',
    '辽',
    '黑',
    '湘',
    '皖',
    '鲁',
    '苏',
    '浙',
    '赣',
    '鄂',
    '桂',
    '甘',
    '晋',
    '陕',
    '蒙',
    '吉',
    '闽',
    '贵',
    '渝',
    '川',
    '青',
    '琼',
    '宁',
    '挂',
    '藏',
    '港',
    '澳',
    '新',
    '使',
    '学'
  ]
  const tmp = []
  // 切割成二维数组
  tmp[0] = data.slice(0, 10)
  tmp[1] = data.slice(10, 20)
  tmp[2] = data.slice(20, 30)
  tmp[3] = data.slice(30, 36)
  return tmp
})

const engKeyBoardList = computed(() => {
  const data = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    0,
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M'
  ]
  const tmp = []
  tmp[0] = data.slice(0, 10)
  tmp[1] = data.slice(10, 20)
  tmp[2] = data.slice(20, 30)
  tmp[3] = data.slice(30, 36)
  return tmp
})

const abc = ref(false)
let timer: any

// 点击键盘按钮
function carInputClick(i: number, j: number) {
  let value = ''
  // 不同模式，获取不同数组的值
  if (abc.value) {
    value = engKeyBoardList.value[i][j].toString()
  } else {
    value = areaList.value[i][j]
  }
  if (!abc.value) {
    sleep(200).then(() => {
      abc.value = true
    })
  }
  emit('change', value)
}
// 修改汽车牌键盘的输入模式，中文|英文
function changeCarInputMode() {
  abc.value = !abc.value
}
// 点击退格键
function backspaceClick() {
  emit('backspace')
  clearInterval(timer) // 再次清空定时器，防止重复注册定时器
  timer = null
  timer = setInterval(() => {
    emit('backspace')
  }, 250)
}

function clearTimer() {
  clearInterval(timer)
  timer = null
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

div {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;
  align-items: stretch;
  align-content: flex-start;
}

@include b(keyboard) {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: rgb(224, 228, 230);
  align-items: stretch;
  padding: 6px 0 6px;

  @include e(button) {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex: 1;
  }

  @include e(buttonInnerWrapper) {
    box-shadow: 0 1px 0px #999992;
    margin: 4px 2.5px;
    border-radius: 4px;
    :active {
      background-color: #bbbcc6;
    }
  }

  @include e(buttonInnerWrapperLeft) {
    border-radius: 4px;
    width: 67px;
    height: 40px;
    background-color: #bbbcc6;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 0px #999992;
  }

  @include e(buttonInnerWrapperRight) {
    border-radius: 4px;
    width: 67px;
    height: 40px;
    background-color: #bbbcc6;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 0px #999992;
  }

  @include e(buttonInnerWrapperLeftLang) {
    font-size: 16px;
    color: #303133;
    @include m(active) {
      color: #3c9cff;
    }
  }

  @include e(buttonInnerWrapperLeftLine) {
    font-size: 15px;
    color: #303133;
    margin: 0 1px;
  }

  @include e(buttonInnerWrapperInner) {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 32px;
    background-color: #ffffff;
    height: 40px;
    border-radius: 4px;
  }

  @include e(buttonInnerWrapperInnerText) {
    font-size: 16px;
    color: #303133;
  }
}
</style>
