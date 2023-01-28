import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible/index.js'
import './styles/index.scss' // global css

import 'virtual:svg-icons-register'

// svg-icon
import SvgIcon from '@gwin/svg-icon'
import '@gwin/svg-icon/lib/theme-default/index.css'

// 网络配置
import { commonConfig, requestContextConfig } from '@gwin/networking-h5'

commonConfig.loginCallback = () => {
  // 需要判断是在app中还是在纯H5中，app中通过jsbridge跳转到app的登录页，H5中跳转到自己的登录页
}

commonConfig.noPermissionCallback = () => {
  router.push('/403')
}

commonConfig.serverErrorCallback = () => {
  router.push('/server-error')
}

requestContextConfig.entityId = 'geti'

const app = createApp(App)

app.use(router).use(store).use(SvgIcon).mount('#app')
