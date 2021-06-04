import io from "socket.io-client";
import { UploadAttachment } from "../../services/Message";

const socketServer = process.env.VUE_APP_SOCKETIO_SERVER;

const state = {
  messages: [],
  socket: null,
};

const getters = {
  messages: (state) => {
    return state.messages;
  },
};

const actions = {
  connectSocket({ commit, rootState, dispatch }) {
    const connection = io(`${socketServer}`, {
      query: {
        auth_token: rootState.users.token,
      },
    });
    connection.on("message", (data) => dispatch("onMessage", data));
    connection.on("active_users", (data) => dispatch("onActiveUsers", data));
    connection.on("user_disconnected", (data) =>
      dispatch("onUserDisconnected", data)
    );
    connection.on("user_connected", (data) =>
      dispatch("onUserConnected", data)
    );
    connection.on("invited", (data) => dispatch("onInvited", data));
    connection.on("join_accepted", (data) => dispatch("onJoinAccepted", data));
    commit("setSocket", connection);
  },
  onMessage({ commit }, data) {
    commit("addMessageToRoom", data);
  },
  sendMessage({ state }, { data, room }) {
    console.log("SENDING MESSAGE", room, data);
    state.socket.emit("message", { message: data, room: room });
  },
  socketEmit({ state }, { event, data }) {
    if (state.socket && state.socket.connected) {
      state.socket.emit(event, data);
    }
  },
  async sendAttachment({ dispatch }, data) {
    dispatch("socketEmit", { event: "send_attachment", data });
  },
  async uploadAttachment({ dispatch }, data) {
    const res = await UploadAttachment(data, (e) => console.log(e));
    if (res.success) {
      dispatch("sendMessage", {
        room: res.roomId,
        data: { data: "", attachments: [res.attachment._id] },
      });
    }
  },
};

const mutations = {
  setSocket(state, socket) {
    state.socket = socket;
  },
  addMessage(state, message) {
    state.messages.push(message);
  },
};

export default { state, getters, actions, mutations };
