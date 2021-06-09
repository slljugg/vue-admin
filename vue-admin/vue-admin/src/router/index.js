import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/Login.vue'),
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: () => import('../views/home/Home.vue'),
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import('../components/welcome/Welcome.vue')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('../components/users/Users.vue')
      },
      {
        path: '/rights',
        name: 'rights',
        component: () => import('../components/power/Rights.vue')
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import('../components/power/Roles.vue')
      },
      {
        path: '/categories',
        name: 'cate',
        component: () => import('../components/goods/Cate.vue')
      },
      {
        path: '/params',
        name: 'params',
        component: () => import('../components/goods/Params.vue')
      },
      {
        path: '/goods',
        name: 'list',
        component: () => import('../components/goods/List.vue')
      },
      {
        path: '/goods/add',
        name: 'add',
        component: () => import('../components/goods/Add.vue')
      },
      {
        path: '/orders',
        name: 'order',
        component: () => import('../components/order/Order.vue')
      },
      {
        path: '/reports',
        name: 'report',
        component: () => import('../components/report/Report.vue')
      },
    ]
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
