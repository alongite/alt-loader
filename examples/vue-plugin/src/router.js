import Vue from 'vue'
import VueRouter from 'vue-router'
import User from './components/User'

Vue.use(VueRouter)
export const router = new VueRouter({
  routes: [
    {
      path: '/user',
      component: User
    }
  ]
})