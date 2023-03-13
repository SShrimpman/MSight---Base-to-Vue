import { createStore } from "vuex";

export default createStore({
    state: {
        showLoading: false,
        // controls: undefined
    },
    mutations: {
        toggleLoading(state) {
            state.showLoading = !state.showLoading;
        },
        hideLoading(state) {
            state.showLoading = !state.showLoading;
        },
        // setControls(state, value) {
        //     state.controls = value
        // }
    },
    actions: {
        // setControls(context, value) {
        //     context.commit('setControls', value)
        // }
    },
    getters: {

    }
})