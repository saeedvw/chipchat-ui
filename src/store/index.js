import Vue from "vue";
import Vuex from "vuex";

import UsersStore from "./modules/users";
import MessagesStore from "./modules/messages";
import RoomsStore from "./modules/rooms";
import ErrorsStore from "./modules/errors";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    users: UsersStore,
    messages: MessagesStore,
    rooms: RoomsStore,
    errors: ErrorsStore,
  },
});
