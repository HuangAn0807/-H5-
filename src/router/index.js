import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout.vue'
import Home from '@/views/home/index.vue'
import Order from '@/views/order/index.vue'
import User from '@/views/user/index.vue'
import Login from '@/views/login/index.vue'
import CreateOrder from '@/views/createOrder/index.vue'
import Detail from '@/views/detail/index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: 'home',
          meta: { 
            icon: 'home-o',
            name: '首页'
          },
          component: Home
        },
        {
          path: 'order',
          meta: { 
            icon: 'orders-o',
            name: '订单'
          },
          component: Order
        },
        {
          path: 'user',
          meta: {
            icon: 'user-circle-o',
            name: '我的'
          },
          component: User
        }
      ]
    },
    {
      path: '/login',
      name:"login",
      component: Login
      
    },
    {
      path: '/createOrder',
      name:"createOrder",
      component: CreateOrder
    },
    {
      path: '/detail',
      name:"detail",
      component: Detail
    },
  ]
})

export default router
