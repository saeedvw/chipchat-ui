import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPaperPlane,
  faEllipsisV,
  faUserFriends,
  faGrinAlt,
  faTimes,
  faUserPlus,
  faPlus,
  faMicrophone,
  faCheck,
  faPlay,
  faPause,
  faFeather,
  faImage,
  faCamera,
  faPaperclip,
  faFile,
  faRobot,
  faSearch,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faPaperPlane);
library.add(faEllipsisV);
library.add(faUserFriends);
library.add(faGrinAlt);
library.add(faTimes);
library.add(faUserPlus);
library.add(faPlus);
library.add(faMicrophone);
library.add(faCheck);
library.add(faPlay);
library.add(faPause);
library.add(faFeather);
library.add(faImage);
library.add(faCamera);
library.add(faPaperclip);
library.add(faFile);
library.add(faRobot);
library.add(faSearch);
library.add(faChevronRight);
library.add(faChevronLeft);

Vue.component("fa-icon", FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

const token = localStorage.getItem("token");
if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] =
    "Bearer " + token;
}
Vue.prototype.$http.defaults.headers.common["Content-Type"] =
  "application/json";

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
