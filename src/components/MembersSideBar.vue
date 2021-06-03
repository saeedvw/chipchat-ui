<template>
  <OffCanvas :showen="showRoomMembers">
    <div class="members_side_bar" slot="content" v-if="showRoomMembers">
      <div class="members_side_bar_header bg-secondary text-light">
        <div class="members_side_bar_header_title" v-if="!searchBar">
          Members
        </div>
        <div v-if="searchBar" class="members_side_bar_header_search">
          <input id="" v-model="searchTerm" class="form-control" type="text" />
        </div>
        <div class="members_side_bar_header_controls">
          <div class="members_side_bar_header_add" @click="toggleSearchBar">
            <fa-icon icon="user-plus"></fa-icon>
          </div>

          <div class="members_side_bar_header_close">
            <fa-icon @click="toggleShowRoomMembers" icon="times"></fa-icon>
          </div>
        </div>
      </div>
      <div
        class="members_side_bar_members"
        v-if="current_room_users && !searchBar"
      >
        <UserHandle
          v-for="user in current_room_users"
          :key="user.user_id"
          :user_id="user.user_id"
          :username="user.username"
          :active="user.status"
          :showPM="true"
        />
      </div>

      <div
        class="members_side_bar_members"
        v-if="current_room_users && searchBar && searched_users !== null"
      >
        <UserHandle
          v-for="user in searched_users"
          :key="user.user_id"
          :user_id="user.user_id"
          :username="user.username"
          :showInvite="true"
        />
      </div>
    </div>
  </OffCanvas>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import UserHandle from "./UserHandle";
import OffCanvas from "./OffCanvas";
export default {
  name: "MembersSideBar.vue",
  data() {
    return {
      searchBar: false,
      searchTerm: "",
    };
  },
  components: { UserHandle, OffCanvas },
  props: {
    showRoomMembers: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["current_room_users", "searched_users"]),
  },
  watch: {
    searchTerm(n) {
      this.searchUsers({ username: n });
    },
  },
  methods: {
    ...mapActions(["searchUsers"]),
    toggleShowRoomMembers() {
      this.$emit("toggleShowRoomMembers");
    },
    toggleSearchBar() {
      this.searchBar = !this.searchBar;
    },
  },
};
</script>
<style scoped lang="scss">
.members_side_bar {
  /*position: absolute;*/
  display: flex;
  flex-direction: column;
  /*z-index: 1000;*/
  width: 100%;
  height: 100%;
  /*right: 0;*/
  background-color: $dark;
}
.members_side_bar_header {
  width: 100%;
  height: 50px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.members_side_bar_header_controls {
  display: flex;
}
.members_side_bar_header_close {
  margin-left: 10px;
}
.members_side_bar_members {
  overflow-y: scroll;
  height: 100%;
  scrollbar-width: thin;
  scrollbar-color: $secondary $dark;
}

.members_side_bar_members::-webkit-scrollbar {
  width: 5px;
  background-color: $dark;
}

.members_side_bar_members::-webkit-scrollbar-thumb {
  background-color: $secondary;
}
</style>
