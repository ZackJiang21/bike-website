import fabric from 'fabric';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element';
import './plugins/pdf';
import './assets/css/icon-font.css';


Vue.config.productionTip = false;

Vue.use(fabric);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
