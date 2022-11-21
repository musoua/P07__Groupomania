import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Routes from './routes';
import store from './store';
import axios from 'axios';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
  routes: Routes,
  mode: 'history'
});

new Vue({
  render: function (h) { return h(App); },
  store,
  router: router
}).$mount('#app');

/* Automatically redirecting user to the login page when the token is expired using axios interceptors */
axios.interceptors.response.use(
  function(response){
    return response;
  },
  error => {
    if(error.response.data.error && error.response.data.error.name == 'TokenExpiredError'){
      router.push('/login');
      store.commit('CLEAR_USER_ID');
      store.commit('CLEAR_USER_ROLE');
      store.commit('CLEAR_USER_TOKEN');
      localStorage.clear();
    } else {
      return Promise.reject(error);
    }
  });
