import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../pages/UserView.vue') },
  { path: '/user/:id', name: 'orders', component: () => import('../pages/UserOrders.vue') },
  { path: '/404', name: '404', component: () => import('../pages/404.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/404' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
