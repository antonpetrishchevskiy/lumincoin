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

    static async getTokensAfterRegistration(email, password, rememberMe = false) {
        const response = await fetch(config.api + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                rememberMe: rememberMe,
            })
        })

        const result = await response.json();

        if (result.error || !result.tokens || !result.user) {
            return result;
        }

        AuthTokens.setToken(AuthTokens.accessTokenKey, result.tokens.accessToken);
        AuthTokens.setToken(AuthTokens.refreshTokenKey, result.tokens.refreshToken);
        AuthTokens.setToken(AuthTokens.userInfoTokenKey, JSON.stringify(result.user));

        return result;
    }
}