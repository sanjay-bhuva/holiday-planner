import Vue from 'vue';
import Vuex from 'vuex';
import publicHolidays from '@/data/public_holidays.json';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    holidays: publicHolidays,
  },
  getters: {
    holidays: (state) => state.holidays,
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
});
