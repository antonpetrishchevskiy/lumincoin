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
        localStorage.clear();
    }

    static async processUnauthorisedResponse() {
        const refreshToken =localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const  response = await fetch(config.host + '/refresh',  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshTaken: refreshToken})
            });
            if (response &&  response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.setToken(result.accessToken, result.refreshToken);
                    return true;
                }
            }
        }
        this.removeToken();
        location.href = '=/login';
        return false;

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
