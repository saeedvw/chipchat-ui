<template>
  <div class="room_avatar">
    <div class="av" v-html="createAvatar()"></div>
    <span
      v-if="status && status.length !== 0"
      class="status"
      :style="{ backgroundColor: status_color }"
    ></span>
  </div>
</template>
<script>
import { createAvatar } from "@dicebear/avatars";
import * as av_style from "@dicebear/avatars-bottts-sprites";

export default {
  name: "RoomAvatar",
  props: {
    room_id: String,
    status: String,
  },
  methods: {
    createAvatar() {
      return createAvatar(av_style, {
        seed: this.room_id,
        width: 40,
        height: 40,
        radius: 10,
      });
    },
  },
  computed: {
    status_color() {
      if (this.status === "connected") {
        return "#20c997";
      } else if (this.status === "disconnected") {
        return "#dc3545";
      }
      return "#adb5bd";
    },
  },
};
</script>
<style scoped lang="scss">
.room_avatar {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 10%;
  background: $secondary;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1.1em;
  text-transform: uppercase;
  font-weight: bold;
  /*color: white;*/
  /*line-height: 40px;*/
  position: relative;
}
.status {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  position: absolute;
  top: 70%;
  left: 75%;
  outline: 2px solid white;
}
</style>
