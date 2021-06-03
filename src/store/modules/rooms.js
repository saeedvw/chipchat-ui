import { GetRoomMessages, CreateRoom, SearchRooms } from "../../services/Room";

const state = { rooms: [], currentRoom: "", searchedRooms: [] };

const getters = {
  default_room_messages: (state, getters, rootState) => {
    if (rootState.users.user && rootState.users.user.rooms) {
      return getters.room_messages(rootState.users.user.rooms[0]);
    }
    return [];
  },
  searchedRooms: (state) => state.searchedRooms,
  room_messages: (state) => (roomId) => {
    const room = state.rooms.filter((room) => room._id === roomId);
    if (room.length > 0) {
      return room[0].messages;
    }
    return [];
  },
  current_room_messages: (state, getters) => {
    if (state.currentRoom) {
      return getters.room_messages(state.currentRoom);
    }
    return [];
  },
  current_room_active_users: (state) => {
    if (state.currentRoom) {
      const room = state.rooms.filter((r) => r._id === state.currentRoom)[0];
      return room.active_users ? room.active_users : [];
    }
    return [];
  },
  current_room_users: (state) => {
    if (state.currentRoom) {
      const room = state.rooms.filter((r) => r._id === state.currentRoom)[0];
      const room_users = room.users.map((u) => {
        const isActive = room.active_users
          ? room.active_users.findIndex((au) => au.user_id === u.user_id) > -1
            ? true
            : false
          : false;
        return { ...u, status: isActive };
      });
      return room_users;
    }
    return [];
  },
  joined_rooms: (state) => state.rooms,
  public_rooms: (state) => state.rooms.filter((room) => room.public),
};

const actions = {
  async getRoomMessages({ commit, state }, { roomId }) {
    const res = await GetRoomMessages(roomId);
    if (res.success) {
      commit("setRoomMessages", res);
      if (!state.currentRoom) {
        commit("setCurrentRoom", res.room._id);
      }
    }
  },
  async searchRooms({ commit }, roomName) {
    const res = await SearchRooms(roomName);
    if (res.success) {
      commit("setSearchedRooms", res.rooms);
    }
  },
  async createRoom({ commit, dispatch }, data) {
    const res = await CreateRoom(data);
    if (res.success) {
      commit("addRoom", res.room);
      dispatch("joinRoom", res.room._id);
      dispatch("getRoomMessages", { roomId: res.room._id });
      commit("setCurrentRoom", res.room._id);
    }
  },
  async joinRoom({ dispatch }, roomId) {
    dispatch("socketEmit", { event: "join_room", data: { roomId } });
  },
  onActiveUsers({ commit, state }, data) {
    if (
      data.roomId &&
      state.rooms.filter((room) => room._id === data.roomId).length > 0
    ) {
      commit("setRoomActiveUsers", data);
    }
  },
  async inviteUserToRoom(
    { dispatch, state, rootState },
    { invitedUser, roomId }
  ) {
    const room = state.rooms.filter((r) => r._id === roomId);
    if (
      room.length > 0 &&
      (room[0].admin === rootState.users.user._id || room.public)
    ) {
      dispatch("socketEmit", {
        event: "invite_user",
        data: { room: roomId, invitedUser },
      });
    }
  },
  setCurrentRoom({ commit, dispatch }, roomId) {
    dispatch("getRoomActiveUsers", roomId);
    dispatch("getRoomMessages", { roomId });
    commit("setCurrentRoom", roomId);
  },
  async invitePrivateMessage({ dispatch }, { user_id, username }) {
    //TODO: need to check if user already has a private room with invided user
    const res = await CreateRoom({ public: false, name: username });
    if (res.success) {
      dispatch("socketEmit", {
        event: "invite_user",
        data: { room: res.room._id, invitedUser: user_id },
      });
      //dispatch("getRoomMessages", { roomId: res.room._id });
      dispatch("setCurrentRoom", res.room._id);
      //dispatch("inviteUserToRoom", {
      //invitedUser: user_id,
      //room: res.room._id,
      //});
    }
  },
  getRoomActiveUsers({ dispatch, state }, roomId) {
    const room = state.rooms.filter((r) => r._id == roomId);
    if (room.length > 0) {
      dispatch("socketEmit", {
        event: "active_users",
        data: { roomId: roomId },
      });
    }
  },
  onUserDisconnected({ commit, state }, data) {
    const rooms = state.rooms.filter((r) => r._id === data.roomId);
    if (rooms.length > 0) {
      const room = rooms[0];
      if (room.active_users) {
        const current_active_users = room.active_users;
        commit("setRoomActiveUsers", {
          roomId: data.roomId,
          active_users: current_active_users.filter(
            (u) => u.user_id !== data.user_id
          ),
        });
      }
    }
  },
  onUserConnected({ commit, state }, data) {
    const rooms = state.rooms.filter((r) => r._id === data.roomId);
    if (rooms.length > 0) {
      const room = rooms[0];
      if (room.active_users) {
        const current_active_users = room.active_users;
        current_active_users.push({
          user_id: data.user_id,
          username: data.username,
        });
        commit("setRoomActiveUsers", {
          roomId: data.roomId,
          active_users: current_active_users,
        });
      }
    }
  },
  onInvited({ dispatch }, data) {
    dispatch("getRoomMessages", { roomId: data.room._id });
  },
  onJoinAccepted({ commit, dispatch }, data) {
    if (data.newly) {
      commit("setUser", data.user);
      commit("addRoom", data.room);
      commit("setCurrentRoom", data.room._id);
      dispatch("getRoomMessages", { roomId: data.room._id });
    }
  },
};

const mutations = {
  setRoomMessages(state, data) {
    let rooms = state.rooms.filter((r) => r._id === data.room._id);
    if (rooms.length === 0) {
      const room = data.room;
      room.messages = data.roomMessages;
      state.rooms = [room, ...state.rooms];
      return;
    }
    const room = data.room;
    room.messages = data.roomMessages;
    state.rooms = state.rooms.map((r) => (r._id === room._id ? room : r));
  },
  addMessageToRoom(state, data) {
    const room = state.rooms.filter((room) => room._id === data.message.room);
    if (room.length > 0) {
      room[0].messages.push(data);
      if (state.currentRoom !== data.message.room) {
        const newRoom = room[0];
        newRoom.new_messages = room[0].new_messages
          ? room[0].new_messages + 1
          : 1;
        state.rooms = state.rooms.map((room) => {
          if (room._id == newRoom._id) {
            return newRoom;
          }
          return room;
        });
      }
    }
  },
  addRoom(state, data) {
    if (state.rooms.indexOf(data._id) > -1) {
      state.rooms[state.rooms.indexOf(data._id)] = data;
      return;
    }
    state.rooms.push(data);
  },
  setCurrentRoom(state, roomId) {
    state.currentRoom = roomId;
    state.rooms.filter((room) => room._id == roomId)[0].new_messages = 0;
  },
  setRoomActiveUsers(state, data) {
    state.rooms = state.rooms.map((room) => {
      if (room._id === data.roomId) {
        return { ...room, active_users: data.active_users };
      }
      return room;
    });
  },
  setSearchedRooms(state, rooms) {
    state.searchedRooms = rooms;
  },
};

export default { state, getters, actions, mutations };
