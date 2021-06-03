<template>
  <div @click="clickUserHandle" class="user_handle">
    <div class="user_details">
      <div class="avatar">
        <UserAvatar
          :user_id="user_id"
          :status="active ? 'connected' : 'disconnected'"
        />
      </div>
      <div class="username">{{ username }}</div>
    </div>
    <div class="user_handle_controls">
      <div class="user_handle_controls_invite" v-if="showInvite">
        <fa-icon icon="plus" @click="clickInvite"></fa-icon>
      </div>
      <div class="user_handle_controls_pm" v-if="showPM">
        <fa-icon icon="paper-plane" @click="clickPM"></fa-icon>
      </div>
    </div>
  </div>
</template>
<script>
import UserAvatar from "./UserAvatar";
import { mapActions, mapState } from "vuex";
export default {
  name: "UserHandle",
  components: { UserAvatar },
  props: {
    username: String,
    user_id: String,
    active: Boolean,
    showInvite: {
      type: Boolean,
      default: false,
    },
    showPM: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({ currentRoom: (state) => state.rooms.currentRoom }),
  },
  methods: {
    ...mapActions(["invitePrivateMessage", "inviteUserToRoom"]),
    clickUserHandle() {},
    clickPM() {
      this.invitePrivateMessage({
        user_id: this.user_id,
        username: this.username,
      });
    },
    clickInvite() {
      console.log("Invite clicked");
      this.inviteUserToRoom({
        invitedUser: this.user_id,
        roomId: this.currentRoom,
      });
    },
  },
};
</script>
<style scoped lang="scss">
.user_handle {
  display: flex;
  flex-direction: row;
  padding: 10px;
  width: 100%;
  /*height: 80px;*/
  background-color: $dark;
  border-bottom: 1px solid $nord3;
  align-items: center;
  justify-content: space-between;
}
.user_details {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.username {
  margin-left: 10px;
  font-size: 1.1em;
  color: lighten($primary, 3%);
}
.user_handle_controls {
  display: flex;
  color: lighten($nord3, 8%);
}
.user_handle_controls > div:hover {
  color: $primary;
}
.user_handle_controls_invite {
  margin-right: 10px;
}
</style>
