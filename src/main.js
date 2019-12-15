import 'vue-fabric/dist/vue-fabric.min.css';
import { Fabric } from 'vue-fabric';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element';

Vue.config.productionTip = false;

Vue.use(Fabric);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
