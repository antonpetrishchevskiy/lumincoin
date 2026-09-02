import {config} from "../config/config.js";

export class AuthTokens {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';
    static userEmailKey = 'userEmail';

    static setToken(tokenName, tokenValue) {
        localStorage.setItem(tokenName, tokenValue);
    }

    static getToken(tokenName) {
        return localStorage.getItem(tokenName);
    }

    static clearTokens() {
        localStorage.removeItem(AuthTokens.accessTokenKey);
        localStorage.removeItem(AuthTokens.refreshTokenKey);
        localStorage.removeItem(AuthTokens.userInfoTokenKey);
    }

    static setUserEmail(email) {
        AuthTokens.setToken(AuthTokens.userEmailKey, email);
    }

    static async parseResponse(response) {
        const contentType = response.headers.get('content-type') || '';

        if (!contentType.includes('application/json')) {
            return {};
        }

        return response.json();
    }

    static async login(email, password, rememberMe = false) {
        try {
            const response = await fetch(`${config.api}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({email, password, rememberMe})
            });

            const result = await AuthTokens.parseResponse(response);

            if (!response.ok || result.error || !result.tokens?.accessToken || !result.tokens?.refreshToken || !result.user) {
                return result.error
                    ? result
                    : {error: true, message: result.message || 'Ошибка авторизации'};
            }

            AuthTokens.setToken(AuthTokens.accessTokenKey, result.tokens.accessToken);
            AuthTokens.setToken(AuthTokens.refreshTokenKey, result.tokens.refreshToken);
            AuthTokens.setToken(AuthTokens.userInfoTokenKey, JSON.stringify(result.user));
            AuthTokens.setUserEmail(email);

            return result;
        } catch (error) {
            console.error('Login error:', error);
            return {
                error: true,
                message: 'Ошибка соединения с сервером'
            };
        }
    }

    static async signUp(userData) {
        try {
            const response = await fetch(`${config.api}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const result = await AuthTokens.parseResponse(response);

            if (!response.ok || result.error || !result.user) {
                return result.error
                    ? result
                    : {error: true, message: result.message || 'Ошибка регистрации'};
            }

            AuthTokens.setUserEmail(userData.email);
            return result;
        } catch (error) {
            console.error('SignUp error:', error);
            return {
                error: true,
                message: 'Ошибка соединения с сервером'
            };
        }
    }

    static async logout() {
        const refreshToken = AuthTokens.getToken(AuthTokens.refreshTokenKey);

        if (!refreshToken) {
            AuthTokens.clearTokens();
            return {success: true};
        }

        try {
            const response = await fetch(`${config.api}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken})
            });

            const result = await AuthTokens.parseResponse(response);

            return response.ok && !result.error
                ? {success: true}
                : {success: false, error: true, message: result.message || 'Ошибка выхода из аккаунта'};
        } catch (error) {
            console.error('Logout error:', error);
            return {
                success: false,
                error: true,
                message: 'Ошибка соединения с сервером'
            };
        }
    }
}
