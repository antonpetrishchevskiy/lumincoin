import {Router} from "./router.js";
import "./styles/styles.scss";

const startApp = () => {
    new Router();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp, {once: true});
} else {
    startApp();
}
