<template>
  <transition name="dropdown_slide">
    <div class="custom_dropdown" v-if="showen">
      <slot name="content" class="content"></slot>
    </div>
  </transition>
</template>
<script>
export default {
  name: "Dropdown",
  props: {
    showen: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped lang="scss">
.custom_dropdown {
  position: absolute;
  top: 40px;
  right: 10px;
  z-index: 1000;
}
.dropdown_slide-enter-active {
  animation: dropdown-slide 0.2s;
}
.dropdown_slide-leave-active {
  animation: dropdown-slide 0.2s reverse;
}

@keyframes dropdown-slide {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
