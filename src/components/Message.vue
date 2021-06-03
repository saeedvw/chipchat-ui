<template>
  <div :class="!lastInBulk ? 'message' : 'message margin'">
    <div class="message_details" v-if="!sameBulk">
      <UserAvatar :user_id="message.from.user_id" />
      <div class="details">
        <span class="username">
          {{ message.from.username }}
        </span>
        <span class="date text-muted">{{
          new Date(message.message.createdAt)
            .toLocaleTimeString()
            .replace(/:\d\d /, " ")
        }}</span>
      </div>
    </div>
    <p v-html="renderMessageData()" class="message_body"></p>
    <div class="attachment" v-if="message.message.attachments.length > 0">
      <VoiceMessage
        v-if="
          message.message.attachments.length === 1 &&
          message.message.attachments[0].mimetype === 'audio/wav'
        "
        :attachment="message.message.attachments[0]"
      />
      <ImageAttachment
        v-if="
          message.message.attachments.length === 1 &&
          message.message.attachments[0].mimetype.includes('image')
        "
        :attachment="message.message.attachments[0]"
      />
      <DownloadableAttachment
        v-if="
          message.message.attachments.length === 1 &&
          message.message.attachments[0].mimetype !== 'audio/wav' &&
          !message.message.attachments[0].mimetype.includes('image')
        "
        :attachment="message.message.attachments[0]"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import anchorme from "anchorme";
import UserAvatar from "./UserAvatar";
import VoiceMessage from "./VoiceMessage";
import DownloadableAttachment from "./DownloadableAttachment";
import ImageAttachment from "./ImageAttachment";
export default {
  name: "Message",
  props: {
    message: Object,
    sameBulk: {
      type: Boolean,
      default: false,
    },
    lastInBulk: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    UserAvatar,
    VoiceMessage,
    DownloadableAttachment,
    ImageAttachment,
  },
  computed: {
    ...mapState({ user: (state) => state.users.user }),
  },
  methods: {
    renderMessageData() {
      let msg_data = this.message.message.data;
      return anchorme({
        input: msg_data,
        options: {
          attributes: {
            target: "_blank",
            class: "link",
          },
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
.message {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.message_details {
  display: flex;
  flex-direction: row;
}
.details {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8em;
}
.username {
  color: lighten($primary, 4%);
  font-weight: bold;
  font-size: 1.2em;
  margin-left: 10px;
}
.sender_avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1.1em;
  text-transform: uppercase;
  font-weight: bold;
}
.message_body {
  margin: 0px;
  padding: 0px;
  margin-left: 60px;
  white-space: pre-line;
  max-width: 80%;
  word-break: break-word;
  color: $white;
}
.margin {
  margin-bottom: 20px;
}
.message_body::v-deep .link {
  color: $primary;
  text-decoration: none;
}
</style>
