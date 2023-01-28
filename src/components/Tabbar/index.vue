<template>
  <div>
    <router-view />
    <van-tabbar v-model="active" route active-color="#3860F4" inactive-color="#999999" @change="onChange">
      <van-tabbar-item replace to="/home">
        <span>首页</span>
        <template #icon>
          <img :src="active === 0 ? iconIndexCurrent : iconIndex" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/about">
        <span>关于我们</span>
        <template #icon>
          <img :src="active === 1 ? iconAboutCurrent : iconAbout" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import iconIndexCurrent from '@/assets/img/tabbar/tab-index-current.png'
import iconIndex from '@/assets/img/tabbar/tab-index.png'
import iconAboutCurrent from '@/assets/img/tabbar/tab-about-current.png'
import iconAbout from '@/assets/img/tabbar/tab-about.png'

const active = ref(0)
const route = useRoute()

onMounted(() => {
  const path = route.path
  if (path === '/home') {
    active.value = 0
  } else {
    active.value = 1
  }
})
function onChange(index: number) {
  active.value = index
}
</script>

<style lang="scss" scoped></style>
