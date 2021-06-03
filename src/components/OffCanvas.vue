<template>
  <transition name="slide_in">
    <div class="custom_offcanvas" v-if="showen">
      <slot class="content" name="content"></slot>
    </div>
  </transition>
</template>
<script>
export default {
  name: "OffCanvas",
  props: {
    showen: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped lang="scss">
.custom_offcanvas {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 30%;
  height: 100%;
  right: 0;
  top: 0;
  background-color: $dark;
  z-index: 1000;
}
.content {
  display: flex;
  flex-direction: column;
  z-index: 1000;
  width: 100%;
  height: 100%;
  /*right: 0;*/
  background-color: $dark;
}
.slide_in-enter-active {
  animation: slide-in 0.2s;
}
.slide_in-leave-active {
  animation: slide-in 0.2s reverse;
}
@keyframes slide-in {
  0% {
    right: -40%;
  }
  100% {
    right: 0px;
  }
}
</style>
