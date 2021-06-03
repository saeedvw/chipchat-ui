<template>
  <div class="voice_message">
    <div class="voice_controls">
      <fa-icon
        class="control"
        v-if="!playing && ready"
        icon="play"
        @click="play"
      ></fa-icon>
      <div v-if="!ready" class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <fa-icon class="control" v-if="playing" icon="pause" @click="pause" />
    </div>
    <div class="progress_bar_container">
      <div
        ref="progress_container"
        class="progress_bar"
        @click="progressClicked"
      >
        <div
          class="progress_bar_content"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
      <div class="time text-muted">
        {{ currentSeconds }}
      </div>
    </div>
    <audio
      :src="'http://localhost:8888/messages/attachment/' + attachment._id"
      ref="audio"
    ></audio>
  </div>
</template>

<script>
import { padNum } from "../utils/utils";
export default {
  name: "VoiceMessage",
  props: {
    attachment: Object,
  },
  data() {
    return {
      playing: false,
      totalDuration: 0,
      currentTime: 0,
      progress: 0,
      ready: false,
    };
  },
  computed: {
    currentSeconds() {
      const mins = Math.floor(this.currentTime / 60);
      const secs = this.currentTime - mins * 60;
      return `${padNum(mins, 2)}:${padNum(Math.round(secs), 2)}`;
    },
  },
  mounted() {
    if (this.$refs && this.$refs.audio) {
      this.$refs.audio.onloadedmetadata = this.onLoadedMetaData;
    }
  },
  methods: {
    onPlay() {
      this.playing = true;
    },
    progressClicked(e) {
      const rect = this.$refs.progress_container.getBoundingClientRect();
      const x = e.clientX - rect.left; //x position within the element.
      const precentage = x / rect.width;
      const timeToSeek = precentage * this.totalDuration;
      this.seek(timeToSeek);
    },
    seek(time) {
      console.log(time);
      this.$refs.audio.currentTime = time;
      this.currentTime = time;
      this.progress = (this.currentTime / this.totalDuration) * 100;
      this.play();
    },
    onPause() {
      this.playing = false;
    },
    onStop() {
      this.playing = false;
    },
    onSeek() {
      this.progress = (this.currentTime / this.totalDuration) * 100;
    },
    onTimeUpdate(e) {
      this.currentTime = e.srcElement.currentTime;
      this.progress = (this.currentTime / this.totalDuration) * 100;
    },
    onLoadedMetaData(e) {
      this.totalDuration = e.srcElement.duration;
      this.ready = true;
    },
    play() {
      const audio = this.$refs.audio;
      audio.play();
      audio.onplay = this.onPlay;
      audio.onstop = this.onStop;
      audio.onpause = this.onPause;
      audio.ontimeupdate = this.onTimeUpdate;
      audio.onseek = this.onSeek;
    },
    pause() {
      const audio = this.$refs.audio;
      audio.pause();
    },
  },
};
</script>
<style scoped lang="scss">
.voice_message {
  display: flex;
  align-items: center;
  height: 50px;
  background-color: $secondary;
  width: 300px;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 60px;
}
.controls {
  display: flex;
  flex-direction: column;
}
.progress_bar_container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: 18px;
  margin-left: 10px;
}
.progress_bar {
  width: calc(300px - 20px - 25px - 10px);
  height: 5px;
  background-color: $nord3;
}
.progress_bar_content {
  height: 100%;
  width: 0px;
  background-color: $light;
}
.time {
  /*padding-top: 3px;*/
  font-size: 0.7em;
}
.control {
  color: $light;
  height: 25px;
  font-size: 20px;
  margin-top: 1px;
}
</style>
