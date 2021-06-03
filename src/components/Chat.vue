<template>
  <div class="chat_area">
    <MembersSideBar
      :showRoomMembers="showRoomMembers"
      @toggleShowRoomMembers="toggleShowRoomMembers"
      v-if="currentRoomInfo"
    />
    <div
      v-if="currentRoomInfo"
      class="chat_area_header bg-secondary text-light"
    >
      <div class="chat_area_header_room_details">
        <div class="room_name" v-if="currentRoomInfo">
          {{ room_name }}
        </div>
      </div>
      <div class="chat_area_header_options">
        <div class="members_toggle" @click="toggleShowRoomMembers">
          <fa-icon icon="user-friends" />
        </div>
        <div
          class="options_toggle"
          v-if="currentRoomInfo.public || currentRoomInfo.admin === user._id"
        >
          <fa-icon icon="ellipsis-v" />
        </div>
      </div>
    </div>
    <div class="messages" ref="messagesArea">
      <div
        v-for="(message_data, index) in messages"
        :key="message_data.message.id"
      >
        <div v-if="dateChanged(index)" class="date_changed">
          <span class="badge rounded-pill bg-secondary">{{
            new Date(message_data.message.createdAt).toDateString()
          }}</span>
        </div>
        <Message
          :key="message_data.message.id"
          :message="message_data"
          :sameBulk="isSameBulk(index)"
          :lastInBulk="
            messages.length > index + 1
              ? messages[index + 1].from.user_id != message_data.from.user_id
              : true
          "
        />
      </div>
    </div>
    <ChatInput @submit="submitSend" />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Message from "./Message.vue";
import ChatInput from "./ChatInput";
import MembersSideBar from "./MembersSideBar";

export default {
  name: "Chat",
  components: { Message, ChatInput, MembersSideBar },
  data() {
    return {
      message: "",
      showRoomMembers: false,
    };
  },
  props: {
    overlayShowen: { type: Boolean, default: false },
  },
  watch: {
    overlayShowen(n) {
      if (n === false) {
        this.showRoomMembers = false;
      }
    },
  },
  updated() {
    const area = this.$refs.messagesArea;
    if (area) {
      area.scrollTop = area.scrollHeight;
    }
  },
  computed: {
    ...mapGetters(["current_room_active_users", "current_room_users"]),
    ...mapState({
      currentRoom: (state) => state.rooms.currentRoom,
      currentRoomInfo(state) {
        const room = state.rooms.rooms.filter(
          (r) => r._id === this.currentRoom
        )[0];
        return room;
      },
      user: (state) => state.users.user,
    }),
    messages() {
      return this.$store.getters.current_room_messages;
    },

    isPM() {
      if (this.currentRoomInfo) {
        if (
          !this.currentRoomInfo.public &&
          this.currentRoomInfo.users.length === 2
        ) {
          return true;
        }
        return false;
      }
      return false;
    },
    otherUser() {
      if (this.isPM) {
        return this.currentRoomInfo.users.filter(
          (u) => u.user_id !== this.user._id
        )[0];
      }
      return null;
    },
    room_name() {
      if (this.currentRoomInfo) {
        if (this.isPM) {
          return this.currentRoomInfo.users.filter(
            (u) => u.user_id !== this.user._id
          )[0].username;
        }
        return this.currentRoomInfo.name;
      }
      return "";
    },
  },

  methods: {
    ...mapActions(["sendMessage"]),
    messsage_keypress(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        this.sendMessage({ data: this.message, room: this.currentRoom });
        this.message = "";
      }
    },
    submitSend(message) {
      this.sendMessage({ data: { data: message }, room: this.currentRoom });
    },
    isSameBulk(index) {
      if (index == 0) {
        return false;
      }
      const msg1 = this.messages[index - 1];
      const msg2 = this.messages[index];
      if (msg1.from.user_id !== msg2.from.user_id) {
        return false;
      }
      let d1 = new Date(msg1.message.createdAt);
      let d2 = new Date(msg2.message.createdAt);
      let time_difference = d2.getTime() - d1.getTime();
      time_difference = time_difference / 1000;
      if (time_difference > 60) {
        return false;
      }
      if (d1.getDate() !== d2.getDate()) {
        return false;
      }
      if (msg1.message.attachments.length > 0) {
        return false;
      }
      return true;
    },
    dateChanged(index) {
      if (index == 0) {
        return true;
      }
      const msg1 = this.messages[index - 1];
      const msg2 = this.messages[index];
      let d1 = new Date(msg1.message.createdAt);
      let d2 = new Date(msg2.message.createdAt);
      if (d1.getDate() !== d2.getDate()) {
        return true;
      }
      return false;
    },
    toggleShowRoomMembers() {
      this.$emit("toggleOverlay");
      this.showRoomMembers = !this.showRoomMembers;
    },
  },
};
</script>

<style scoped lang="scss">
.chat_area {
  display: flex;
  flex-direction: column;
  /*justify-content: space-between;*/
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  background-image: url("../assets/circuit-board.svg");
}
.chat_area_header {
  height: 50px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.chat_area_header_options {
  display: flex;
  flex-direction: row;
  font-size: 1.2em;
}
.options_toggle {
  margin-right: 10px;
  margin-left: 20px;
  font-size: 1.2em;
}
.messages {
  height: 90%;
  padding: 20px;
  padding-bottom: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  scrollbar-color: $nord3 $dark;
  scrollbar-width: thin;
}

.messages::-webkit-scrollbar {
  width: 5px;
  background-color: $dark;
}

.messages::-webkit-scrollbar-thumb {
  background-color: $secondary;
}
.date_changed {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
