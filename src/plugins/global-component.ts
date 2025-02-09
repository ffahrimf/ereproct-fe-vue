import { App, defineAsyncComponent } from "vue";
import hIcon from "../components/base/h-icon.vue";
import hBtn from "../components/base/h-btn.vue";
import hSelect from "../components/base/h-select.vue";
import hMenu from "../components/base/h-menu.vue";
import hNavMenu from "../components/base/h-nav-menu.vue";
import hInput from "../components/base/h-input.vue";
import hSearch from "../components/base/h-search.vue";
import hDrawer from "../components/base/h-drawer.vue";
import IconBtn from "../components/base/icon-btn.vue";
import hArea from "../components/base/h-area.vue";
import hInputPassword from "../components/base/h-input-password.vue";
import HAccordion from "../components/base/h-accordion.vue";

const spinner = defineAsyncComponent(
  () => import("../components/base/spinner.vue")
);

const hOverlay = defineAsyncComponent(
  () => import("../components/base/h-overlay.vue")
);

const hDialog = defineAsyncComponent(
  () => import("../components/base/h-dialog.vue")
);

export const globalcomponent = (app: App): void => {
  app.component("h-accordion", HAccordion);
  app.component("h-select", hSelect);
  app.component("h-menu", hMenu);
  app.component("h-nav-menu", hNavMenu);
  app.component("h-input", hInput);
  app.component("h-search", hSearch);
  app.component("h-input-password", hInputPassword);
  app.component("h-area", hArea);
  app.component("h-overlay", hOverlay);
  app.component("icon-btn", IconBtn);
  app.component("h-dialog", hDialog);
  app.component("h-drawer", hDrawer);
  app.component("h-btn", hBtn);
  app.component("spinner", spinner);
  app.component("h-icon", hIcon);
};
