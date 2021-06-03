<template>
  <div class="rooms_bar" :data-expanded="expanded.toString()">
    <div class="resize_button" v-on:click.prevent="expanded = !expanded">
      <fa-icon :icon="expanded ? 'chevron-left' : 'chevron-right'" />
    </div>
    <div class="rooms_bar_content">
      <div class="rooms_bar_header bg-secondary text-light">
        <div class="rooms_bar_header_title me-2">
          <div class="title" v-if="!searchShown && !showCreateRoom && expanded">
            Rooms
          </div>

          <div class="title" v-if="!searchShown && showCreateRoom">
            Create Room
          </div>
          <input
            class="form-control form-control-sm"
            type="text"
            v-if="searchShown && expanded"
            placeholder="Search Rooms..."
            v-model="searchTerm"
          />
        </div>
        <div class="rooms_bar_header_options_toggle" v-if="expanded">
          <fa-icon
            v-if="!showCreateRoom && !searchShown"
            icon="search"
            class="control"
            v-on:click.prevent="searchShown = !searchShown"
          />
          <fa-icon
            icon="plus"
            class="control"
            v-if="!searchShown && !showCreateRoom"
            v-on:click.prevent="showCreateRoom = !showCreateRoom"
          />
          <fa-icon
            icon="times"
            class="control"
            v-if="searchShown || showCreateRoom"
            @click="toggleContent"
          />
        </div>
      </div>
      <div class="rooms" v-if="!showCreateRoom && !searchShown">
        <RoomHandler
          v-for="room in joined_rooms"
          :key="room._id"
          :roomId="room._id"
          :expanded="expanded"
          @click="clickRoomHandler"
        />
      </div>
      <div class="rooms" v-if="!showCreateRoom && searchShown && expanded">
        <RoomHandler
          v-for="room in searchedRooms"
          :key="room._id"
          :roomId="room._id"
          @click="clickSearchedRoom"
          :isSearch="true"
        />
      </div>
      <div class="rooms" v-if="showCreateRoom">
        <CreateRoomForm v-on:submitted="showCreateRoom = !showCreateRoom" />
      </div>
    </div>
  </div>
</template>
<script>
import RoomHandler from "./RoomHandle";
import { mapGetters, mapActions } from "vuex";
import CreateRoomForm from "./CreateRoomForm";

export default {
  name: "RoomsBar",
  data() {
    return {
      searchShown: false,
      showCreateRoom: false,
      searchTerm: "",
      expanded: true,
    };
  },
  components: { RoomHandler, CreateRoomForm },
  computed: {
    ...mapGetters(["joined_rooms", "searchedRooms"]),
  },
  watch: {
    searchTerm(n) {
      this.searchRooms(n);
    },
  },
  methods: {
    ...mapActions(["searchRooms", "setCurrentRoom", "joinRoom"]),
    toggleContent() {
      if (this.searchShown) {
        this.searchShown = false;
      }
      if (this.showCreateRoom) {
        this.showCreateRoom = false;
      }
    },
    clickRoomHandler(roomId) {
      this.setCurrentRoom(roomId);
    },
    clickSearchedRoom(roomId) {
      if (this.joined_rooms) {
        const r = this.joined_rooms.filter((jr) => jr._id === roomId);
        if (r.length === 0) {
          this.joinRoom(roomId);
          this.searchTerm = "";
          this.searchShown = false;
        } else {
          this.setCurrentRoom(roomId);
          this.searchTerm = "";
          this.showCreateRoom = false;
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
.rooms_bar {
  display: flex;
  flex-direction: column;
  width: 30%;
  justify-content: space-between;
  position: relative;
  transition: width 0.5s ease-in-out;
}
.rooms_bar[data-expanded="false"] {
  width: 75px;
}
.rooms_bar_header {
  padding: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  font-weight: bold;
  border-right: 0px;
}
.rooms_bar_content {
  display: flex;
  height: 100%;
  flex-direction: column;
}
.rooms_bar_header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}
.rooms_bar_header_options_toggle {
  display: flex;
  justify-content: flex-end;
  font-size: 0.8em;
}
.rooms {
  border-right: 1px solid $nord3;
  height: 100%;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: $secondary $dark;
}
.rooms::-webkit-scrollbar {
  width: 5px;
  background-color: $dark;
}

.rooms::-webkit-scrollbar-thumb {
  background-color: $secondary;
}
.control {
  margin-right: 10px;
}
.control:hover {
  color: $primary;
}
.resize_button {
  position: absolute;
  left: calc(100% - 10px);
  top: calc(50% - 30px);
  width: 10px;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: darken($secondary, 4%);
  color: $secondary;
  padding: 0px;
  z-index: 1050;
}
.resize_button:hover {
  color: $light;
}
</style>
