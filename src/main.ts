import { createApp } from "vue";

import router from "@/router";
import store from "@/store";

import App from "@/App.vue";
import AppLink from "@/components/AppLink.vue";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faStar,
  faMagnifyingGlass,
  faPlus,
  faTrashCan,
  faPenToSquare,
  faFeatherPointed,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "@/assets/templatemo-xtra-blog.css";
import "@/assets/style.css";

library.add(
  faTrashCan,
  faPenToSquare,
  faFeatherPointed,
  faBook,
  faStar,
  faMagnifyingGlass,
  faPlus,
  faGithub
);

const app = createApp(App);

app.use(router);
app.use(store);
app.component("font-awesome-icon", FontAwesomeIcon);
app.component("AppLink", AppLink);
app.mount("#app");
