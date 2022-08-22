import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import counterModule from "./module/counterModule";
export default new Vuex.Store({
    modules: { counterModule }
});