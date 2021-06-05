import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/Login.vue'),
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home/Home.vue'),
  },
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to表示将要访问的地址
  // from表示哪个路径跳转而来
  // next表示放行
  if (to.path === '/login') {
    next()
    return
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    next('/login')
    return
  }
  next()
})

export default router
