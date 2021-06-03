<template>
  <transition name="toast">
    <div :class="type ? type + ' custom_toast' : 'custom_toast'" v-if="showen">
      <div class="default_content">
        <fa-icon v-if="icon" :icon="icon" />
        <div class="content" v-if="content">{{ content }}</div>
      </div>
      <div class="action" v-if="action">
        <fa-icon icon="times" />
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "Toast",
  props: {
    showen: {
      type: Boolean,
      default: false,
    },
    content: String,
    icon: String,
    type: String,
    action: String,
  },
};
</script>
<style scoped lang="scss">
.custom_toast {
  background: $secondary;
  /*border: 1px solid lighten($secondary, 10%);*/
  color: $light;
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  top: 10px;
  right: calc(50% - 300px / 2);
  width: 300px;
  z-index: 1000;
  overflow: hidden;
  padding: 5px;
  border-radius: 4px;
  justify-content: space-between;
}
.default_content {
  display: flex;
  align-items: center;
  font-size: 0.9em;
}
.action {
  display: flex;
  align-items: center;
}
.content {
  padding-left: 5px;
}
.toast-enter-active {
  animation: toast_apear 0.2s;
}

.toast-leave-active {
  animation: toast_apear 0.2s reverse;
}
.success {
  color: $dark;
  background: $success;
}
.danger {
  color: $light;
  background: $danger;
}
.warning {
  color: $dark;
  background: $warning;
}
.info {
  color: $dark;
  background: $info;
}

@keyframes toast_apear {
  0% {
    top: -50px;
  }
  100% {
    top: 10px;
  }
}
</style>
