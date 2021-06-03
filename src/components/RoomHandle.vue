<template>
  <div
    @click="clickRoomHandler"
    :class="isCurrentRoom ? 'current_room room_handler' : 'room_handler'"
    :data-expanded="expanded.toString()"
  >
    <div class="room_avatar">
      <UserAvatar v-if="isPM" :user_id="otherUser.user_id" />
      <RoomAvatar v-if="!isPM" :room_id="room._id" />
    </div>
    <transition name="handle_details">
      <div
        class="room_handle_details"
        v-if="expanded"
        :aria-expanded="expanded.toString()"
      >
        <div class="room_name">
          {{ room_name }}
        </div>
        <div class="last_message" v-if="!isSearch && lastMessage">
          <div class="last_message_content">
            <span class="last_message_sender"
              >{{ lastMessage.from.username }}:</span
            >
            {{ lastMessage.message.data }}
          </div>
          <span class="badge bg-danger" v-if="room.new_messages">{{
            room.new_messages
          }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import UserAvatar from "./UserAvatar";
import RoomAvatar from "./RoomAvatar";

export default {
  name: "RoomHandler",
  props: {
    roomId: String,
    expanded: {
      type: Boolean,
      default: true,
    },
    isSearch: {
      type: Boolean,
      default: false,
    },
  },
  components: { UserAvatar, RoomAvatar },
  computed: {
    ...mapState({
      room(state) {
        if (this.isSearch) {
          return state.rooms.searchedRooms.filter(
            (r) => r._id === this.roomId
          )[0];
        }
        return state.rooms.rooms.filter((r) => r._id === this.roomId)[0];
      },
      isCurrentRoom(state) {
        return state.rooms.currentRoom === this.roomId;
      },
      user(state) {
        return state.users.user;
      },
      lastMessage(state) {
        const room = state.rooms.rooms.filter((r) => r._id === this.roomId)[0];
        if (room.messages && room.messages.length > 0) {
          return room.messages[room.messages.length - 1];
        }
        return null;
      },
    }),
    isPM() {
      if (this.room) {
        if (
          !this.room.public &&
          this.room.users.length === 2 &&
          !this.room.name
        ) {
          return true;
        }
        return false;
      }
      return false;
    },
    otherUser() {
      if (this.isPM) {
        return this.room.users.filter((u) => u.user_id !== this.user._id)[0];
      }
      return null;
    },
    room_name() {
      if (this.room) {
        if (this.isPM) {
          return this.room.users.filter((u) => u.user_id !== this.user._id)[0]
            .username;
        }
        return this.room.name;
      }
      return "";
    },
  },
  methods: {
    clickRoomHandler() {
      this.$emit("click", this.roomId);
    },
  },
};
</script>

<style scoped lang="scss">
.room_handler {
  background-color: $dark;
  border-bottom: 1px solid $nord3;
  padding: 10px;
  display: flex;
}
.current_room {
  background-color: lighten($dark, 2%);
}
.last_message {
  font-size: 0.8em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.last_message_content {
  max-width: 25ch;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: $light;
}
.room_name {
  color: lighten($primary, 4%);
}
.last_message_sender {
  color: lighten($gray-500, 9%);
}
.room_avatar {
  width: 48px;
  height: 48px;
  margin-right: 10px;
}

.handle_details-enter-active {
  animation: details-grow 0.1s;
}
.handle_details-leave-active {
  animation: details-grow 0.5s reverse;
}

@keyframes details-grow {
  0% {
    opacity: 0;
    width: 0%;
  }
  100% {
    opacity: 1;
    width: 100%;
  }
}
</style>
