import { Login, Me, SearchByUsername } from "../../services/Users";
import Router from "../../router/index";
import Vue from "vue";

const state = {
  user: {},
  token: localStorage.getItem("token") || "",
  searchedUsers: [],
};

const getters = {
  isLoggedIn(state) {
    return !!state.token;
  },
  searched_users(state) {
    return state.searchedUsers;
  },
};

const actions = {
  async login({ commit, dispatch }, { username, password }) {
    const res = await Login(username, password);
    console.log({ res });
    if (res.success) {
      commit("login", res);
      dispatch("error", { type: "success", error: "Logged In successfully" });
    } else {
      dispatch("error", { type: "danger", error: res.error });
    }
  },
  logout({ commit }) {
    localStorage.removeItem("token");
    commit("logout");
  },
  getMe: async function ({ commit, dispatch }) {
    const res = await Me();
    console.log(res);
    if (res.success) {
      commit("setUser", res.user);
      dispatch("error", { type: "success", error: "Logged In successfully" });
      if (res.user.rooms) {
        res.user.rooms.forEach((room) => {
          dispatch("getRoomMessages", { roomId: room });
        });
      }
    }
  },
  async searchUsers({ commit }, { username }) {
    const res = await SearchByUsername(username);
    if (res.success) {
      commit("setSearchedUsers", res.users);
    }
  },
};

const mutations = {
  login(state, res) {
    if (res.success) {
      state.user = res.user;
      state.token = res.token;
      localStorage.setItem("token", res.token);
      Vue.prototype.$http.defaults.headers.common["Authorization"] =
        "Bearer " + res.token;
      Router.push("/");
    }
  },
  logout(state) {
    state.user = null;
    state.token = "";
    Router.push("/login");
  },
  setUser(state, user) {
    state.user = user;
  },
  setSearchedUsers(state, users) {
    state.searchedUsers = users;
  },
};

export default { state, getters, actions, mutations };
