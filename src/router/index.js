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
import VipList from '@/components/VipList'
import VideoList from '@/components/VideoList'
import UserList from '@/components/UserList'
import Irregularity from '@/components/Irregularity'
import Inform from '@/components/Inform'
import AdminList from '@/components/AdminList'
import UpdataPassword from '@/components/UpdataPassword'
import VideoSold from '@/components/VideoSold'
import SoldList from '@/components/SoldList'

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
            },
            {
               path: 'vipVideo',
               component: VipList
            },
            {
               path: 'videoList',
               component: VideoList
            },
            {
               path: 'userList',
               component: UserList
            },
            {
               path: 'irregularity',
               component: Irregularity
            },
            {
               path: 'inform',
               component: Inform
            },
            {
               path: 'adminList',
               component: AdminList
            },
            {
               path: 'updataPassword',
               component: UpdataPassword
            },
            {
               path: 'videoSold',
               component: VideoSold
            },
            {
               path: 'soldList',
               component: SoldList
            }
       ]
    }
  ]
})
