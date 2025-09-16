import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routes";
import mdiVue from "mdi-vue/v3";
import "preline/preline";
import * as mdijs from "@mdi/js";
import { createPinia } from "pinia";
import { globalcomponent } from "./plugins/global-component";
import { Collapse } from "vue-collapsed";
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";
import i18n from "./plugins/i18n";
import { install } from "vue3-recaptcha-v2";

const app = createApp(App);
const mdi = { icons: mdijs };

app.use(createPinia());
globalcomponent(app);

app
  .use(router)
  .use(i18n)
  .use(mdiVue, mdi)
  .use(install, {
    sitekey: "6LeIMsUrAAAAAA1LP8100YskHxXpGTs9c-xuKQ9-"
  })
  .use(VueAwesomePaginate)
  .component("Collapse", Collapse)
  .mount("#app");
