import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import { initPlugin } from '@alt-sdk/sdk'

Vue.config.productionTip = false

const { isRunInStore, registerPlugin } = initPlugin('vue-plugin')

if (!isRunInStore) {
  new Vue({
    router,
    render: h => h(App),
  }).$mount('#app')
}

registerPlugin({
  mount(container) {
    const i = new Vue({
      router,
      render: h => h(App),
    }).$mount(container)
    container.i = i
  },
  unmount(container) {
    container.i?.$destroy()
  }
})
