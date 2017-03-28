import Vue from 'vue'
import Router from 'vue-router'
import qsList from '@/components/QS-list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'qsList',
      component: qsList
    }
  ]
})
