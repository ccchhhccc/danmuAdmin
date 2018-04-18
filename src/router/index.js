import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Admin from '@/components/test'
import r from '@/components/r2'
import Carousel from '@/components/Carousel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      children:[
            {
               path: 'carousel',
               component: Carousel
            },
            {
               path: 'r2',
               component: r
            }
       ]
    }
  ]
})
