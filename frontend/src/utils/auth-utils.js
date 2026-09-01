import {config} from "../config/config.js";

export class AuthTokens {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';

    static setToken(tokenName, tokenValue) {
        localStorage.setItem(tokenName, tokenValue);
    }

    static getToken(tokenName) {
        return localStorage.getItem(tokenName);
    }

    static removeToken() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    static async parseResponse(response) {
        const contentType = response.headers.get('content-type') || '';

        if (!contentType.includes('application/json')) {
            return {};
        }

        return response.json();
    }

    static async processUnauthorisedResponse() {
        const refreshToken = this.getToken(this.refreshTokenKey);

        if (!refreshToken) {
            this.removeToken();
            location.href = '/login';
            return false;
        }

        try {
            const response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken})
            });

            const result = await this.parseResponse(response);
            const tokens = result.tokens;

            if (!response.ok || result.error || !tokens?.accessToken || !tokens?.refreshToken) {
                throw new Error(result.message || 'Не удалось обновить токен');
            }

            this.setToken(this.accessTokenKey, tokens.accessToken);
            this.setToken(this.refreshTokenKey, tokens.refreshToken);

            if (result.user) {
                this.setToken(this.userInfoTokenKey, JSON.stringify(result.user));
            }

            return true;
        } catch (error) {
            this.removeToken();
            location.href = '/login';
            return false;
        }
    }
}
