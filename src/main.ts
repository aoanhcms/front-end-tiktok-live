import "@/core/plugins/prismjs";

import ApiService from "@/core/services/ApiService";
import App from "./App.vue";
import ElementPlus from "element-plus";
import { createApp } from "vue";
import i18n from "@/core/plugins/i18n";
import { initApexCharts } from "@/core/plugins/apexcharts";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";
import router from "./router";
import store from "./store";

/*
TIP: To get started with clean router change path to @/router/clean.ts.
 */

//imports for app initialization

const app = createApp(App);

app.use(store);
app.use(router);
app.use(ElementPlus);

ApiService.init(app);
initApexCharts(app);
initInlineSvg(app);
initVeeValidate();

app.use(i18n);

app.mount("#app");
