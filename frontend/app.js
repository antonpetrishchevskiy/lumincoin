import {Router} from "./src/router.js";
import "./src/styles/styles.scss";

const startApp = () => {
    new Router();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp, {once: true});
} else {
    startApp();
}
