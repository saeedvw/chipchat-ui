<template>
  <div class="create_room_form text-light m-3">
    <div class="mb-3">
      <label for="room_name" class="form-label">Room Name</label>
      <input
        id="room_name"
        class="form-control form-control-sm"
        type="text"
        v-model="roomName"
      />
    </div>
    <div class="form-check form-switch mb-3">
      <input
        class="form-check-input"
        v-model="isPublic"
        type="checkbox"
        id="isPublicSwitch"
      />
      <label class="form-check-label" for="isPublicSwitch">Public</label>
    </div>
    <button class="btn btn-sm btn-primary" @click="submitCreateRoom">
      Create
    </button>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "CreateRoomForm",
  data() {
    return {
      roomName: "",
      isPublic: false,
    };
  },

  methods: {
    ...mapActions(["createRoom"]),
    submitCreateRoom() {
      if (this.roomName.trim() !== "") {
        this.createRoom({ name: this.roomName, public: this.isPublic });
        this.roomName = "";
        this.$emit("submitted");
      }
    },
  },
};
</script>
<style scoped lang="scss">
.form-check-input:not(:checked) {
  border: 1px lighten($secondary, 30%) solid;
}
</style>
