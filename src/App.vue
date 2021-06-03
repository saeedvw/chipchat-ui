<template>
  <div class="app">
    <nav class="navbar">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1"
          ><fa-icon icon="robot" class="me-1" /> ChipChat</span
        >
        <div class="d-flex">
          <button
            v-if="user && isLoggedIn"
            class="btn btn-sm btn-danger"
            @click="clickLogout"
          >
            Logout
          </button>
          <UserAvatar
            v-if="user && isLoggedIn && user._id && false"
            :username="user.username"
            :user_id="user._id"
          />
        </div>
      </div>
    </nav>

    <Toast
      v-if="errors.length > 0"
      :showen="true"
      :content="errors[0].error"
      :type="errors[0].type"
    />
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import UserAvatar from "./components/UserAvatar";
import Toast from "./components/Toast";

export default {
  name: "App",
  data() {
    return {};
  },
  components: { UserAvatar, Toast },
  methods: {
    ...mapActions(["logout"]),
    clickLogout() {
      this.logout();
    },
    toggleAccountDropdown() {
      this.showAccountDropdown = !this.showAccountDropdown;
    },
  },
  computed: {
    ...mapGetters(["isLoggedIn", "errors"]),
    ...mapState({ user: (state) => state.users.user }),
  },
  created() {
    const store = this.$store;
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function () {
        if (
          err.response.status === 401 &&
          err.config &&
          !err.config.__isRetryRequest
        ) {
          store.dispatch("logout");
          store.dispatch("error", {
            type: "danger",
            error: err.response.data.error,
          });
        }
      });
    });
  },
};
</script>

<style lang="scss">
.app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden !important;
}
.navbar {
  color: $light;
  background-color: $dark;
}
</style>
