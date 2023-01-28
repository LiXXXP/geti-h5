<template>
  <div class="gwin-h5-company">
    <text v-if="type === 'company'" class="gwin-h5-company__txt">
      灰鲸智航是一家专注于LBS的互联网科技企业，公司以“客户为中心”的价值观理念，基于LBS地图服务，为企业提供数字孪生以及数据化产品，通过数据可视化的应用工具，协助企业在数字营销、管理、运营、决策等层面提供全方面定制化的创新解决方案。灰鲸智航启用一对一的服务模式，向企业提供超大数据量及精细化分析，利用高效的管理方式增加企业运作效率，为数字经济化的企业赋能。</text
    >
    <text v-if="type === 'serve'" class="gwin-h5-company__txt">
      为生产、化工、制造及物流运输行业的中小型企业提供运输全过程数字化，可视化管理平台。平台通过提供运输订单查询，无车承运调度和实时轨迹监控，系统集成，运输时效管理，运输管理分析等核心功能，有效提升运输全过程运营效率及管理力度。</text
    >
    <div v-if="type === 'tel'" class="gwin-h5-company__tel">
      <div class="gwin-h5-company__phone">联系电话：185 1567 6583</div>
      <div>为您提供售前购买咨询</div>
      <div>工作时间周一至周五 9:00-19:00</div>
    </div>
    <div v-if="type === 'tel'" class="gwin-h5-company__logo">
      <img src="@/assets/img/about/code.png" alt="" />
      <text>微信扫描二维码联系我们～</text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const type = router.currentRoute.value.query.type
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

@include b(company) {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  @include e(txt) {
    font-size: 14px;
    font-weight: 400;
    color: #131313;
    line-height: 30px;
  }
  @include e(tel) {
    font-size: 14px;
    font-weight: 400;
    color: #131313;
    line-height: 25px;
  }
  @include e(phone) {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  @include e(logo) {
    margin-top: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: #131313;

    img {
      width: 120px;
      height: 120px;
      margin-bottom: 15px;
    }
  }
}
</style>
