import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Admin from '@/components/index'
import Channel from '@/components/Channel'
import Carousel from '@/components/Carousel'
import Leval from '@/components/Leval'
import Video from '@/components/Video'
import Recommend from '@/components/Recommend'
import Rank from '@/components/Rank'

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
               path: 'channel',
               component: Channel
            },
            {
               path: 'leval',
               component: Leval
            },
            {
               path: 'video',
               component: Video
            },
            {
               path: 'recommend',
               component: Recommend
            },
            {
               path: 'rank',
               component: Rank
            }
       ]
    }
  ]
})
