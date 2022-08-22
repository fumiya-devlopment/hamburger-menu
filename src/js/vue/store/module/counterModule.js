export default {
    namespaced: true,
    state: {
        count: 0,
    },
    getters: {
        countTxt(state) {
            return `${state.count}回`
        }
    },
    mutations: {
        increment(state) {
            state.count++
        },
        decrement(state, payload) {
            state.count = state.count - payload.number;
        }
    },
    actions: {
        decrement(context) {
            context.commit('decrement', { "number": 1 })
        }
    }
};