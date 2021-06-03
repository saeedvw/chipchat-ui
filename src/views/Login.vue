<template>
  <div class="login_page">
    <form
      class="
        login_form
        bg-dark
        text-light
        p-3
        m-3
        center
        col-lg-3 col-md-8 col-sm-12
      "
      @submit="submit"
    >
      <h3 class="mb-3 text-center">Login</h3>
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input
          type="text"
          v-model="username"
          class="form-control"
          id="username"
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          v-model="password"
          class="form-control"
          id="psassword"
        />
      </div>
      <div class="mb-3">
        <button class="btn btn-primary">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },

  computed: {},
  components: {},
  methods: {
    ...mapActions(["login"]),
    submit(e) {
      this.login({ username: this.username, password: this.password });
      e.preventDefault();
    },
  },
};
</script>

<style scoped lang="scss">
.login_page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 100%;
  background-color: $secondary;
  background-image: url("../assets/circuit-board.svg");
}
</style>
