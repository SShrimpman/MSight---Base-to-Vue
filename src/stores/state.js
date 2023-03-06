import { createStore } from "vuex";

export default createStore({
    state: {
        showLoading: false,
    },
    mutations: {
        toggleLoading(state) { 
            state.showLoading = !state.showLoading;
          },
        hideLoading(state) {
            state.showLoading = !state.showLoading;
        }
    },
    actions: {
        
    },
    getters: {

    }
})