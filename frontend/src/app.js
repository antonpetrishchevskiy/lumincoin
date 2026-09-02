import "./src/styles/styles.scss";
import {Router} from "./src/router.js";

class App {
    constructor() {
        new Router();
    }
}

(new App());