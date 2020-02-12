import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeWeb from '../views/HomeWeb.vue';
import Index from '../views/Index.vue';
import Definition from '../views/Definition.vue';
import Report from '../views/Report.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
  },
  {
    path: '/home',
    name: 'home',
    component: HomeWeb,
    meta: {
      keepAlive: true,
      showNav: true,
    },
  },
  {
    path: '/def',
    name: 'definition',
    component: Definition,
    meta: {
      keepAlive: true,
      showNav: true,
    },
  },
  {
    path: '/report',
    name: 'report',
    component: Report,
    meta: {
      showNav: true,
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
