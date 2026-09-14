import {Response} from "../utils/response-utils.js";
import {AuthTokens} from "../utils/auth-utils.js";

export class Logout {
    constructor(openNewRouteAutomatic) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.logoutUserName = document.getElementById('layoutUserNameBlock');
        this.logoutExitBtn = document.getElementById('exit-layout');
        this.isBlock = true;

        if (this.logoutUserName) {
            this.logoutUserName.onclick = this.showBtnExit.bind(this);
        }
        if (this.logoutExitBtn) {
            this.logoutExitBtn.onclick = this.logout.bind(this);
        }
    }

    showBtnExit() {
        if (!this.logoutExitBtn) return;

        this.isBlock = !this.isBlock;
        this.logoutExitBtn.style.display = this.isBlock ? 'none' : 'block';
    }

    async logout() {
        try {
            if (AuthTokens.refreshPromise) {
                await AuthTokens.refreshPromise;
            }

            const refreshToken = AuthTokens.getToken(AuthTokens.refreshTokenKey);
            if (refreshToken) {
                const result = await Response.getElementsFromBackend(
                    'POST',
                    '/logout',
                    null,
                    {refreshToken}
                );

                if (result?.error) {
                    console.error('Ошибка выхода из системы:', result.message);
                }
            }
        } catch (error) {
            console.error('Ошибка выхода из системы:', error);
        } finally {
            AuthTokens.clearAuthTokens();
            await this.openNewRouteAutomatic('/login');
        }
    }
}
