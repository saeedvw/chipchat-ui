<template>
  <div class="file_attachment">
    <fa-icon class="file_logo" icon="file" />
    <div class="file_details_container">
      <div class="file_details">
        <div class="file_name">
          {{ attachment.originalname }}
        </div>
        <div class="file_size text-muted">
          {{ humanFileSize(attachment.size, true, 2) }}
        </div>
      </div>
      <a
        class="file_download_link"
        download
        :href="'http://localhost:8888/messages/attachment/' + attachment._id"
        >Save File</a
      >
    </div>
  </div>
</template>

<script>
import { humanFileSize } from "../utils/utils";
export default {
  name: "DownloadableAttachment",
  props: {
    attachment: Object,
  },
  methods: {
    humanFileSize: humanFileSize,
  },
};
</script>

<style scoped lang="scss">
.file_attachment {
  width: 300px;
  padding: 10px;
  background-color: $secondary;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: $light;
}
.file_details_container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
}
.file_details {
  display: flex;
  flex-direction: row;
  /*justify-content: space-between;*/
  width: 100%;
}
.file_logo {
  color: $light;
  font-size: 20px;
  margin: 0;
  margin-right: 13px;
}
.file_download_link {
  font-size: 0.7em;
}
.file_name {
  max-width: 70%;
  width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.8em;
}
.file_size {
  font-size: 0.7em;
}
</style>
