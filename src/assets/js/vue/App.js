/**
 * vueのコンポーネントを登録する
 */
import Vue from 'vue';
//import store from './store/store';
//import router from './router';
import ComponentSlider from './component/component-slider.vue';

export default new Vue({
  // router,
  // store,
  el: '#app',
  components: {
    ComponentSlider

  }
});
