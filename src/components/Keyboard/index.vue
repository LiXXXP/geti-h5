<template>
  <van-popup v-model:show="showPop" position="bottom" :safe-area-inset-bottom="true" :close-on-click-overlay="false">
    <div class="gwin-h5-keyboard__tooltip">
      <div class="gwin-h5-hover">
        <span class="gwin-h5-keyboard__toolTipCancel" @click="$emit('cancel')">取消</span>
      </div>
      <div class="gwin-h5-hover">
        <span class="gwin-h5-keyboard__toolTipConfirm" @click="$emit('confirm')">确定</span>
      </div>
    </div>
    <car-keyboard @change="change" @backspace="$emit('backspace')"></car-keyboard>
  </van-popup>
</template>

<script setup lang="ts">
import CarKeyboard from '@/components/CarKeyboard/index.vue'
import { computed } from 'vue'

export interface Props {
  show: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false
})
const emit = defineEmits(['change', 'backspace', 'update:show', 'cancel', 'confirm'])

const showPop = computed({
  get: () => props.show,
  set: (val) => {
    emit('update:show', val)
  }
})
function change(e: string) {
  emit('change', e)
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

@include b(keyboard) {
  @include e(tooltip) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #ffffff;
    padding: 14px 12px;
  }

  @include e(toolTipCancel) {
    text-align: left;
    color: #888888;
  }

  @include e(toolTipConfirm) {
    text-align: right;
    color: #3c9cff;
  }
}

@include b(hover) {
  :active {
    background-color: #bbbcc6;
  }
}
</style>
