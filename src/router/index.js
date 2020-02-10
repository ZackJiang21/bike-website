import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeWeb from '../views/HomeWeb.vue';
import Index from '../views/Index.vue';
import Measurement from '../views/Measurement.vue';
import DefinitionPage from '../components/DefinitionPage.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
  },
  {
    path: '/measurement',
    name: 'measurement',
    component: Measurement,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/web',
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
    component: DefinitionPage,
    meta: {
      keepAlive: true,
      showNav: true,
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
