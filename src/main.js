import fabric from 'fabric';
import Vue from 'vue';
import Vant from 'vant';
import 'vant/lib/index.css';
import App from './App.vue';
import router from './router';
import './plugins/element';
import './plugins/pdf';
import './assets/css/icon-font-ele.css';
import './assets/css/iconfont.css';


Vue.config.productionTip = false;

Vue.use(fabric);
Vue.use(Vant);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
