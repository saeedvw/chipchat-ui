<template>
  <div class="home_page">
    <div class="content">
      <transition name="overlay_ease">
        <div class="overlay" @click="overlayClicked" v-if="overlayShowen"></div>
      </transition>
      <RoomsBar />
      <Chat @toggleOverlay="toggleOverlay" :overlayShowen="overlayShowen" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Chat from "../components/Chat";
import RoomsBar from "../components/RoomsBar";

export default {
  name: "Home",
  components: { Chat, RoomsBar },
  data() {
    return {
      showChat: false,
      showCreateRoom: true,
      new_room_name: "",
      new_room_public: true,
      overlayShowen: false,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.users.user,
      currentRoom: (state) => state.rooms.currentRoom,
    }),
    ...mapGetters(["isLoggedIn", "joined_rooms"]),
  },
  created() {
    this.$store.dispatch("getMe");
  },
  mounted() {
    this.connectSocket();
  },
  methods: {
    ...mapActions(["connectSocket", "createRoom", "setCurrentRoom"]),
    clickCreateRoom() {
      this.showChat = false;
      this.showCreateRoom = true;
    },
    clickChangeRoom(roomId) {
      /*this.currentRoom = roomId;*/
      this.setCurrentRoom(roomId);
      this.showCreateRoom = false;
      this.showChat = true;
    },
    submitCreateRoom() {
      this.createRoom({
        name: this.new_room_name,
        public: this.new_room_public,
      });
    },
    toggleOverlay() {
      this.overlayShowen = !this.overlayShowen;
    },
    overlayClicked() {
      this.toggleOverlay();
    },
  },
};
</script>
<style scoped lang="scss">
.home_page {
  height: 100%;
  /*padding: 20px;*/
  overflow: hidden;
  width: 100%;
  position: relative;
  background: $nord0;
}
.content {
  display: flex;
  height: 100%;
  width: 100%;
}
.overlay {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 1000;
  position: absolute;
  overflow: hidden;
}
.overlay_ease-enter-active {
  animation: overlay-ease 0.2s;
}
.overlay_ease-leave-active {
  animation: overlay-ease 0.2s reverse;
}
@keyframes overlay-ease {
  0% {
    background-color: rgba(0, 0, 0, 0);
  }
  100% {
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
