import { createApp } from "vue";

import router from "@/router";
import store from "@/store";

import App from "@/App.vue";
import AppLink from "@/components/AppLink.vue";

import "@/assets/templatemo-xtra-blog.css";
import "@/assets/style.css";

const app = createApp(App);

app.use(router);
app.use(store);
app.component("AppLink", AppLink);
app.mount("#app");
