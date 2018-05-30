import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

//配置store
var store = new Vuex.Store({
  state:{
        limits:[]
    }
})

export default store