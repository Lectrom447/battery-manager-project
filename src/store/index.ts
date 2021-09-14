import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    conectionStatus: 'disconnected',
  },
  mutations: {
    setConectionState(state,payload) {
      state.conectionStatus = payload.value
    }
  },
  actions: {
    changeConectionState(context, value:string) {
      context.commit('setConectionState',{value})
    }

  },
  modules: {
  }
})
