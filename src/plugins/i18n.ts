import { createI18n } from "vue-i18n";

import id from "../lang/id";
const i18n = createI18n({
  legacy: false,
  locale: "id",
  messages: {
    id: id,
  },
});

export default i18n;
