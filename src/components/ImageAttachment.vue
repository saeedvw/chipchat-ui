<template>
  <div class="image_attachment">
    <img :src="`${api_url}/messages/attachment/${attachment._id}`" alt="" />
  </div>
</template>
<script>
export default {
  name: "ImageAttachment",
  props: {
    attachment: Object,
  },
  computed: {
    api_url() {
      return process.env.VUE_APP_API_URL;
    },
  },
};
</script>
<style scoped lang="scss">
.image_attachment {
  width: 300px;
  padding: 10px;
  background-color: $secondary;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 60px;
}

.image_attachment > img {
  width: 100%;
  /*height: 200px;*/
}
</style>
