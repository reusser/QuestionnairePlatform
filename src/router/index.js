import Vue from 'vue'
import Router from 'vue-router'
import qsList from '@/components/QS-list'
import qsData from '@/components/QS-data'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'qsList',
      component: qsList
    },
    {
      path: '/data',
      name: 'qsData',
      component: qsData
    }
  ]
})
