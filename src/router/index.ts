import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/layout',
      name: '布局',
      component: () => import('../views/Layout.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login/Login.vue')
    },
    {
      path: '/flow',
      name: 'Flow',
      component: () => import('../views/flow/Flow.vue'),
      props: route => ({ id: route.query.id })
    },
    {
      path: '/login22',
      name: 'Login222',
      component: () => import('../views/login/Login.vue')
    },
  ],
});
router.beforeEach(async (to) => {
  const isAuthenticated = localStorage.getItem('access_token');
  if (
    // 检查用户是否已登录
    !isAuthenticated &&
    // ❗️ 避免无限重定向
    to.name !== 'Login'
  ) {
    // 将用户重定向到登录页面
    return { name: 'Login' };
  }
});


export default router;
