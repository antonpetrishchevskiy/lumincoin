import {AuthTokens} from "../utils/auth-utils.js";
import {Response} from "../utils/response-utils.js";

export class DeleteGeneralElement {
    constructor(openNewRouteAutomatic, urlRequest, url) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.urlRequest = urlRequest;
        this.url = url;
        this.generalElementId = null;
        this.deleteBtn = document.getElementById('deleteBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.deleteBtn.onclick = this.deleteElement.bind(this);
        this.cancelBtn.onclick = this.cancelDelete.bind(this);
    }

    async deleteElement() {
        this.generalElementId = localStorage.getItem('idRowGenerals');
        const accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        if (!accessToken) {
            console.log('No access token');
            return;
        }

        const result = await Response.getElementsFromBackend('DELETE', this.urlRequest + this.generalElementId, accessToken);

        if (result.error) {
            console.log(`Error: ${result.message}`)
            return;
        }
        this.openNewRouteAutomatic(this.url);
    }

    cancelDelete() {
        this.openNewRouteAutomatic(this.url);
    }
}