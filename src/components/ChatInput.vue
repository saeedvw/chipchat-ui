<template>
  <div class="chat_input_container">
    <Emojis
      :open="emojiesShowen"
      backgroundColor="#3b4252"
      radius="6"
      class="emojies"
      color="#d8dee9"
      @click="emojiClicked"
    />
    <div
      class="chat_input_textarea"
      @keydown="textAreaKeyDown"
      @keyup="textAreaKeyUp"
      @focus="() => (emojiesShowen ? toggleShowEmojies() : null)"
      @input="textAreaInput"
      contenteditable
      ref="textarea"
    ></div>

    <transition name="inpt_ctrls_slide">
      <div class="input_controls">
        <fa-icon
          class="emoji_toggle"
          @click="toggleShowEmojies"
          icon="grin-alt"
          v-if="!recording"
        />
        <fa-icon
          class="microphone_toggle"
          icon="microphone"
          v-if="!recording"
          @click="startRecording"
        ></fa-icon>

        <label for="file_upload_input" v-if="!recording">
          <fa-icon class="upload_file" icon="paperclip"></fa-icon>
        </label>
      </div>
    </transition>
    <input
      ref="file_input"
      type="file"
      id="file_upload_input"
      @change="onFileUploadChange"
    />
    <transition name="v_msg_ctrls_slide">
      <div class="voice_message_controls" v-if="recording">
        <div @click="cancelRecording" class="cancel_voice_message bg-danger">
          <fa-icon icon="times"></fa-icon>
        </div>
        <div class="voice_message_time">{{ recording_time }}</div>
        <div @click="stopRecording" class="submit_voice_message bg-success">
          <fa-icon icon="check"></fa-icon>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { VueChatEmoji } from "vue-chat-emoji";
import { mapActions, mapState } from "vuex";
import { padNum } from "../utils/utils";
require("vue-chat-emoji/dist/vue-chat-emoji.min.css");

export default {
  name: "ChatInput",
  computed: {
    ...mapState({ currentRoom: (state) => state.rooms.currentRoom }),
    recording_time() {
      const mins =
        this.recording_seconds > 0
          ? Math.floor(this.recording_seconds / 60)
          : 0;
      const secs = this.recording_seconds - mins * 60;
      return `${padNum(mins, 2)}:${padNum(secs, 2)}`;
    },
  },
  data() {
    return {
      shiftDown: false,
      text: "",
      emojiesShowen: false,
      audioRecordingChunk: [],
      mediaRecorder: null,
      streamObject: null,
      recording: false,
      recording_seconds: 0,
      recordingCanceled: false,
    };
  },
  created() {},
  components: { Emojis: VueChatEmoji },
  methods: {
    ...mapActions(["uploadAttachment"]),
    textAreaInput(e) {
      this.text = e.target.innerText;
    },
    textAreaKeyDown(e) {
      if (e.keyCode === 16) {
        this.shiftDown = true;
      }
      if (e.keyCode === 13 && !this.shiftDown) {
        this.submit();
        e.target.innerText = "";
        e.preventDefault();
      }
    },
    textAreaKeyUp(e) {
      if (e.keyCode === 16) {
        this.shiftDown = false;
      }
    },
    submit() {
      this.$emit("submit", this.text.trim());
      this.text = "";
      this.emojiesShowen = false;
    },
    emojiClicked(e) {
      this.$refs.textarea.innerText += e.emoji;
      this.text += e.emoji;
    },
    toggleShowEmojies() {
      this.emojiesShowen = !this.emojiesShowen;
    },
    onFileUploadChange() {
      const files = this.$refs.file_input.files;
      if (files.length > 0) {
        this.uploadAttachment({ blob: files[0], roomId: this.currentRoom });
      }
    },
    async cancelRecording() {
      if (this.recording) {
        console.log("CANCELING RECORDING");
        this.recordingCanceled = true;
        await this.stopRecording();
      }
    },
    async mediaRecorderOnStop() {
      console.log("On stop");
      if (this.recording) {
        console.log("is recording");
        const audioData = new Blob(this.audioRecordingChunk, {
          type: "audio/wav",
        });
        if (!this.recordingCanceled) {
          this.uploadAttachment({ blob: audioData, roomId: this.currentRoom });
        }
        this.recordingCanceled = false;
        this.audioRecordingChunk = [];
        this.recording = false;
        this.mediaRecorder = null;
        this.streamObject.getAudioTracks().forEach((t) => t.stop());
      }
      console.log("Streamobj is ", this.streamObject);
      this.streamObject.getAudioTracks().forEach((t) => t.stop());
      this.streamObject = null;
      console.log("now is ", this.streamObject);
    },
    mediaRecorderOnDataAvailable(ev) {
      this.recording_seconds += 1;
      console.log(ev);
      this.audioRecordingChunk.push(ev.data);
    },
    async getUserMicrophone() {
      const streamObj = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleSize: 8,
          channelCount: 0,
        },
      });
      console.log("GETTING USER MICROPHONE", this.streamObject);
      this.streamObject = streamObj;
      console.log("GOT USER MICROPHONE", this.streamObject);
    },
    mediaRecorderOnStart() {
      this.recording = true;
      this.recordingCanceled = false;
    },
    async setUpMediaRecorder() {
      if (!this.streamObject || !this.streamObject.active) {
        await this.getUserMicrophone();
      }
      console.log("Setting up media recorder");
      this.audioRecordingChunk = [];
      const mediaRecorder = new MediaRecorder(this.streamObject);
      this.mediaRecorder = mediaRecorder;
      this.mediaRecorder.onstart = this.mediaRecorderOnStart;
      this.mediaRecorder.ondataavailable = this.mediaRecorderOnDataAvailable;
      this.mediaRecorder.onstop = this.mediaRecorderOnStop;
    },
    async startRecording() {
      if (!this.mediaRecorder) {
        await this.setUpMediaRecorder();
      }
      this.recording = true;
      if (
        this.recording &&
        this.mediaRecorder &&
        this.mediaRecorder.state === "inactive"
      ) {
        this.recording_seconds = 0;
        this.mediaRecorder.start(1000);
      }
    },
    async stopRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state == "recording") {
        this.mediaRecorder.stop();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.chat_input_container {
  /*min-height: 80px;*/
  position: relative;
  vertical-align: bottom;
  margin: 0px;
  padding: 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.chat_input_textarea {
  width: 100%;
  height: auto;
  min-height: 50px;
  border: 0px;
  vertical-align: bottom;
  outline: none;
  box-shadow: none;
  padding: 15px;
  scrollbar-width: none;
  resize: none;
  position: relative;
  background-color: lighten($dark, 2%);
  color: $light;
  margin: 0px;
}
.chat_input_textarea:focus {
  background-color: lighten($dark, 3%);
}
.emoji_toggle {
  font-size: 1.3em;
  color: $nord3;
}
.emoji_toggle:hover {
  color: lighten($nord3, 18%);
}
.emojies {
  position: absolute;
  right: 30px;
  top: 35%;
  width: 300px;
  height: 100px;
  scrollbar-width: thin;
  scrollbar-color: $dark $secondary;
  color: $light;
}

.microphone_toggle {
  font-size: 1.3em;
  color: $nord3;
}
.microphone_toggle:hover {
  color: lighten($nord3, 18%);
}
.microphone_toggle:active {
  color: red;
}
.upload_file {
  font-size: 1.3em;
  color: $nord3;
}
.upload_file:hover {
  color: lighten($nord3, 18%);
}
.voice_message_controls {
  position: absolute;
  bottom: calc(50% - 10px - 30);
  right: 15px;
  display: flex;
  background: $dark;
  padding: 10px;
  border-radius: 40px;
}
.submit_voice_message {
  color: white;
  padding: 5px;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cancel_voice_message {
  color: white;
  padding: 5px;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.voice_message_time {
  margin-left: 4px;
  margin-right: 4px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  margin-top: 3px;
  width: 6ch;
  color: $light;
}
.input_controls {
  position: absolute;
  bottom: 15px;
  right: 20px;
  display: flex;
  flex-direction: row-reverse;
  width: 75px;
  align-items: center;
  justify-content: space-between;
}
input[type="file"] {
  display: none;
  visibility: hidden;
  height: 0px;
}
.v_msg_ctrls_slide-enter-active {
  animation: slide_voice_controls 0.3s;
}

.v_msg_ctrls_slide-leave-active {
  animation: slide_voice_controls 0.3s reverse;
}
@keyframes slide_voice_controls {
  0% {
    bottom: -50px;
  }
  100% {
    bottom: 0px;
  }
}
.input_ctrls_slide-enter-active {
  animation: slide_input_ctrls 1.3s;
}

.input_ctrls_slide-leave-active {
  animation: slide_input_ctrls 1.3s reverse;
}

@keyframes slide_input_ctrls {
  0% {
    right: 20px;
  }
  100% {
    right: calc(20px + 100px);
  }
}
</style>
