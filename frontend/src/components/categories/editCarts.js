import {AuthTokens} from "../utils/auth-utils.js";
import {Response} from "../utils/response-utils.js";

export class EditCarts {
    constructor(openNewRouteAutomatic, urlRequest, url) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.urlRequest = urlRequest;
        this.url = url;
        this.incomeElementTitle = localStorage.getItem('incomeElementTitle');
        this.incomeElementId = localStorage.getItem('incomeElementId');
        this.editElementTitle = document.getElementById('nameEditElement');
        this.saveBtn = document.getElementById('saveBtn');
        this.cancelBtn = document.getElementById('cancelEdit');
        this.setEditElementValue();
        this.saveBtn.onclick = this.changeElementValue.bind(this);
        this.cancelBtn.onclick = this.cancelEditElement.bind(this);
    }

    setEditElementValue() {
        this.editElementTitle.value = this.incomeElementTitle;
    }

    async changeElementValue() {
        const accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        const editElementTitle = this.editElementTitle.value;
        if (!accessToken) {
            console.log('No access token');
            return;
        }

         const result = await Response.getElementsFromBackend('PUT', this.urlRequest + this.incomeElementId, accessToken, {title: editElementTitle});

        if (result) {
            this.openNewRouteAutomatic(this.url);
        }
    }

    cancelEditElement() {
        this.openNewRouteAutomatic(this.url);
    }
}