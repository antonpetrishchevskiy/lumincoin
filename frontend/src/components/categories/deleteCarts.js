import {AuthTokens} from "../utils/auth-utils.js";
import {Response} from "../utils/response-utils.js";
import {ErrorUtils} from "../utils/error-utils.js";

export class DeleteCart {
    constructor(openNewRouteAutomatic, urlRequest, url) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.urlRequest = urlRequest;
        this.url = url;
        this.deleteBtnGreen = document.getElementById('deleteBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.errorElement = document.getElementById('server-error');

        if (this.deleteBtnGreen) this.deleteBtnGreen.onclick = this.deleteElement.bind(this);
        if (this.cancelBtn) this.cancelBtn.onclick = this.cancelDelete.bind(this);
    }

    async deleteElement() {
        if (this.errorElement) this.errorElement.innerText = '';

        const incomeElementId = localStorage.getItem('incomeElementId');
        if (!incomeElementId) {
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
            this.urlRequest + incomeElementId,
            accessToken
        );

        if (!result || result.error) {
            console.error('Ошибка удаления категории:', result);
            ErrorUtils.show(result, this.errorElement, 'удалить категорию');
            return;
        }

        localStorage.removeItem('incomeElementId');
        localStorage.removeItem('incomeElementTitle');
        await this.openNewRouteAutomatic(this.url);
    }

    async cancelDelete() {
        await this.openNewRouteAutomatic(this.url);
    }
}
