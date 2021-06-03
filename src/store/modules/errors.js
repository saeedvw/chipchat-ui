const state = {
  errors: [],
};

const getters = {
  errors(state) {
    return state.errors;
  },
};

const actions = {
  error({ commit }, error) {
    commit("addError", error);
    setTimeout(function () {
      commit("flush");
    }, 2000);
  },
  flush({ commit }) {
    commit("flush");
  },
};

const mutations = {
  addError(state, error) {
    state.errors.push(error);
  },
  flush(state) {
    state.errors = [];
  },
};

export default { state, getters, actions, mutations };
