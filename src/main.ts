import { createApp } from 'vue';
import './style.css';
import router from './router';
import stores from "./stores";
import App from './App.vue';
import { createVuestic } from "vuestic-ui";
import 'vuestic-ui/styles/essential.css';
import 'vuestic-ui/styles/typography.css';

const app = createApp(App);
const vuestic = createVuestic();

app.use(stores);
app.use(router);
app.use(vuestic);
app.mount('#app');
