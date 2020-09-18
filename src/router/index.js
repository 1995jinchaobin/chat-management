import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/views/Main.vue'
import Login from '@/views/Login.vue'
import Home from '@/views/home/Home.vue'
import Android from '@/views/app/Android.vue'
import Apple from '@/views/app/Apple.vue'
import ContentList from '@/views/content/ContentList.vue'
import Level from '@/views/member/Level.vue'
import Site from '@/views/member/Site.vue'
import User from '@/views/member/User.vue'
import BlackList from '@/views/member/BlackList.vue'
import UserChat from '@/views/member/UserChat.vue'
import ChatRoom from '@/views/member/ChatRoom.vue'
import Switch from '@/views/images/Switch.vue'
import SysInform from '@/views/images/SysInform.vue'
import UserImg from '@/views/images/UserImg.vue'
import Admin from '@/views/xtsite/Admin.vue'
import Power from '@/views/xtsite/Power.vue'
import SenWord from '@/views/xtsite/SenWord.vue'
import GroupM from '@/views/menu/GroupM.vue'
import GroupChat from '@/views/menu/GroupChat.vue'
import ComplaintList from '@/views/complaint/ComplaintList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      { path: 'home', component: Home },
      { path: 'android', component: Android },
      { path: 'apple', component: Apple },
      { path: 'contentlist', component: ContentList },
      { path: 'level', component: Level },
      { path: 'site', component: Site },
      { path: 'user', component: User },
      { path: 'blacklist', component: BlackList },
      { path: 'userchat', component: UserChat },
      { path: 'chatroom', component: ChatRoom },
      { path: 'switch', component: Switch },
      { path: 'sysinform', component: SysInform },
      { path: 'userimg', component: UserImg },
      { path: 'admin', component: Admin },
      { path: 'power', component: Power },
      { path: 'senword', component: SenWord },
      { path: 'groupm', component: GroupM },
      { path: 'groupchat', component: GroupChat },
      { path: 'complaintlist', component: ComplaintList }
    ]
  }
]
// 获取原型对象上的push函数(下面两行代码为了防止路由重复报错)
const originalPush = VueRouter.prototype.push
// 修改原型对象中的push方法
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  mode: 'history',
  routes
})
// 请求拦截
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('userToken')
  if (!tokenStr) return next('/login')
  next()
})
export default router
