import { App, defineAsyncComponent } from "vue";
import hIcon from "../components/base/h-icon.vue";
import hBtn from "../components/base/h-btn.vue";
import hSelect from "../components/base/h-select.vue";
import hMenu from "../components/base/h-menu.vue";
import hNavMenu from "../components/base/h-nav-menu.vue";
import hInput from "../components/base/h-input.vue";
import hAvatar from "../components/base/h-avatar.vue";
import hSearch from "../components/base/h-search.vue";
import hDatePicker from "../components/base/h-date-picker.vue";
import IconBtn from "../components/base/icon-btn.vue";
import hArea from "../components/base/h-area.vue";
import hRadio from "../components/base/h-radio.vue";
import hPhone from "../components/base/h-phone.vue";
import hLabel from "../components/base/h-label.vue";
import hInputFile from "../components/base/h-input-file.vue";
import hErrs from "../components/base/h-errs.vue";
import hInputPassword from "../components/base/h-input-password.vue";
import HAccordion from "../components/base/h-accordion.vue";
import HMenuFilter from "../components/base/h-menu-filter.vue";
import HSelectTotalData from "../components/base/h-select-total-data.vue";
import HSelectFilter from "../components/base/h-select-filter.vue";

const spinner = defineAsyncComponent(
  () => import("../components/base/spinner.vue")
);

const hOverlay = defineAsyncComponent(
  () => import("../components/base/h-overlay.vue")
);

const hDialog = defineAsyncComponent(
  () => import("../components/base/h-dialog.vue")
);

const hDrawer = defineAsyncComponent(
  () => import("../components/base/h-drawer.vue")
);

export const globalcomponent = (app: App): void => {
  app.component("h-avatar", hAvatar);
  app.component("h-accordion", HAccordion);
  app.component("h-select", hSelect);
  app.component("h-date-picker", hDatePicker);
  app.component("h-select-total-data", HSelectTotalData);
  app.component("h-select-filter", HSelectFilter);
  app.component("h-menu", hMenu);
  app.component("h-radio", hRadio);
  app.component("h-label", hLabel);
  app.component("h-errs", hErrs);
  app.component("h-menu-filter", HMenuFilter);
  app.component("h-input-file", hInputFile);
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
  app.component("h-phone", hPhone);
  app.component("spinner", spinner);
  app.component("h-icon", hIcon);
};
