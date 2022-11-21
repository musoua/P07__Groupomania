import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    role:null,
    userId:null,
    token:null
  },
  getters: {
  },
  mutations: {
    SET_USER_ROLE(state, role){
      state.role = role;
    },
    SET_USER_ID(state, id){
      state.userId = id;
    },
    SET_USER_TOKEN(state, token){
      state.token = token;
    },
    CLEAR_USER_ROLE(state){
      state.role = null;
    }, 
    CLEAR_USER_ID(state){
      state.userId = null;
    }, 
    CLEAR_USER_TOKEN(state){
      state.token = null;
    }, 
    
  },
  actions: {
  },
  modules: {
  }
});
