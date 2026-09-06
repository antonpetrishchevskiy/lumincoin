import {AuthTokens} from "../utils/auth-utils.js";
import {Response} from "../utils/response-utils.js";

export class AddCart {
    constructor(openNewRouteAutomatic,urlRequest, url) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.url = url;
        this.urlRequest = urlRequest;
        this.createBtn = document.getElementById("createCartBtn");
        this.cancelBtn = document.getElementById("cancelCreateCartBtn");
        this.inputCartValue = document.getElementById("nameCreateIncomeElement");
        this.createBtn.onclick = this.addCart.bind(this);
        this.cancelBtn.onclick = () => {
            this.openNewRouteAutomatic(this.url);
        }
    }

    async addCart() {
        const accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        if (!accessToken) {
            console.log('No access token');
            return;
        }

        const result = await Response.getElementsFromBackend('POST', this.urlRequest, accessToken, {title: this.inputCartValue.value});

        if (result.error || !result.title) {
            console.log(`Error: ${result.message}`)
            return;
        }
        this.openNewRouteAutomatic(this.url);
    }
}