import {Response} from "./response-utils.js";

export class AuthTokens {
    constructor(openNewRouteAutomatic) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
    }

    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';

    static setToken(tokenName, tokenValue) {
        localStorage.setItem(tokenName, tokenValue);
    }

    static getToken(tokenName) {
        return localStorage.getItem(tokenName);
    }

    static async getTokensAfterRegistration(email, password, rememberMe = false) {

        const result = await Response.getElementsFromBackend('POST', '/login', null, {
            email: email,
            password: password,
            rememberMe: rememberMe,
        });

        if (result) {
            if (result.error || !result.tokens || !result.user) {
                return result;
            }

            AuthTokens.setToken(AuthTokens.accessTokenKey, result.tokens.accessToken);
            AuthTokens.setToken(AuthTokens.refreshTokenKey, result.tokens.refreshToken);
            AuthTokens.setToken(AuthTokens.userInfoTokenKey, JSON.stringify(result.user));

            return result;
        }
    }

    static async refreshToken() {
        const refreshToken = AuthTokens.getToken(AuthTokens.refreshTokenKey);

        if(refreshToken) {
            const result = await Response.getElementsFromBackend('POST', '/refresh', null, {refreshToken: refreshToken});

            if (result.error || !result.tokens) {
                console.log('Refresh token устарел')
                localStorage.clear();
                return;
            }

            AuthTokens.setToken(AuthTokens.accessTokenKey, result.tokens.accessToken);
            AuthTokens.setToken(AuthTokens.refreshTokenKey, result.tokens.refreshToken);
        }
    }
}