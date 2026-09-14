import {AuthTokens} from "../utils/auth-utils.js";
import {Response} from "../utils/response-utils.js";
import {ErrorUtils} from "../utils/error-utils.js";

export class DeleteGeneralElement {
    constructor(openNewRouteAutomatic, urlRequest, url) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.urlRequest = urlRequest;
        this.url = url;
        this.deleteBtn = document.getElementById('deleteBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.errorElement = document.getElementById('server-error');

        if (this.deleteBtn) this.deleteBtn.onclick = this.deleteElement.bind(this);
        if (this.cancelBtn) this.cancelBtn.onclick = this.cancelDelete.bind(this);
    }

    async deleteElement() {
        if (this.errorElement) this.errorElement.innerText = '';

        const generalElementId = localStorage.getItem('idRowGenerals');
        if (!generalElementId) {
            await this.openNewRouteAutomatic(this.url);
            return;
        }

        const accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        if (!accessToken) {
            await AuthTokens.handleSessionExpired();
            return;
        }

        const result = await Response.getElementsFromBackend(
            'DELETE',
            this.urlRequest + generalElementId,
            accessToken
        );

        if (!result || result.error) {
            console.error('Ошибка удаления операции:', result);
            ErrorUtils.show(result, this.errorElement, 'удалить операцию');
            return;
        }

        localStorage.removeItem('idRowGenerals');
        localStorage.removeItem('rowData');
        await this.openNewRouteAutomatic(this.url);
    }

    async cancelDelete() {
        await this.openNewRouteAutomatic(this.url);
    }
}
