import { App, defineAsyncComponent } from "vue";
import hRadio from "../components/base/h-radio.vue";
import hRadioGroup from "../components/base/h-radio-group.vue";
import hCheckbox from "../components/base/h-checkbox.vue";
import hHover from "../components/base/h-hover.vue";
import hIcon from "../components/base/h-icon.vue";
import hInputFile from "../components/base/h-input-file.vue";
// import hInputMultipleFile from "../components/base/h-input-multiple-file.vue";
import hAvatar from "../components/base/h-avatar.vue";
import hBtn from "../components/base/h-btn.vue";
import hSelect from "../components/base/h-select.vue";
import hSelectFilter from "../components/base/h-select-filter.vue";
import hMenu from "../components/base/h-menu.vue";
import hMenuFilter from "../components/base/h-menu-filter.vue";
import hInput from "../components/base/h-input.vue";
import hSearch from "../components/base/h-search.vue";
// import hCurrency from "../components/base/h-currency.vue";
import hPhone from "../components/base/h-phone.vue";
import hArea from "../components/base/h-area.vue";
import hDatePicker from "../components/base/h-date-picker.vue";
import hInputPassword from "../components/base/h-input-password.vue";
import IconBtn from "../components/base/icon-btn.vue";
import hTooltip from "../components/base/h-tooltip.vue";
import hTimePicker from "../components/base/h-time-picker.vue";
import hLabel from "../components/base/h-label.vue";
import hMonthPicker from "../components/base/h-month-picker.vue";
import hYearPicker from "../components/base/h-year-picker.vue";

const spinner = defineAsyncComponent(
  () => import("../components/base/spinner.vue"),
);

const hOverlay = defineAsyncComponent(
  () => import("../components/base/h-overlay.vue"),
);

const hDialog = defineAsyncComponent(
  () => import("../components/base/h-dialog.vue"),
);

export const globalcomponent = (app: App): void => {
  app.component("h-avatar", hAvatar);
  app.component("h-select", hSelect);
  app.component("h-select-filter", hSelectFilter);
  app.component("h-menu", hMenu);
  app.component("h-menu-filter", hMenuFilter);
  app.component("h-input", hInput);
  app.component("h-search", hSearch);
  app.component("h-input-password", hInputPassword);
  //   app.component("h-currency", hCurrency);
  app.component("h-phone", hPhone);
  app.component("h-area", hArea);
  app.component("h-date-picker", hDatePicker);
  app.component("icon-btn", IconBtn);
  app.component("h-overlay", hOverlay);
  app.component("h-dialog", hDialog);
  app.component("h-btn", hBtn);
  app.component("spinner", spinner);
  app.component("h-radio", hRadio);
  app.component("h-radio-group", hRadioGroup);
  app.component("h-checkbox", hCheckbox);
  app.component("h-hover", hHover);
  app.component("h-icon", hIcon);
  app.component("h-tooltip", hTooltip);
  app.component("h-input-file", hInputFile);
  //   app.component("h-input-multiple-file", hInputMultipleFile);
  app.component("h-time-picker", hTimePicker);
  app.component("h-label", hLabel);
  app.component("h-month-picker", hMonthPicker);
  app.component("h-year-picker", hYearPicker);
};
