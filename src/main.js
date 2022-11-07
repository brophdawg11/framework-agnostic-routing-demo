import { createApp } from "vue";
import App from "./App.vue";
import { worker } from "./mocks/browser";

worker
  .start({ onUnhandledRequest: "bypass" })
  .then(() => createApp(App).mount("#app"));
