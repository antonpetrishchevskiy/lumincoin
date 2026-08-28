import {AuthTokens} from "../utils/auth-utils.js";
import {config} from "../config/config.js";

export class AuthService {
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

            const result = await this.parseResponse(response);

            if (!response.ok || result.error || !result.tokens?.accessToken || !result.tokens?.refreshToken || !result.user) {
                return result;
            }

            AuthTokens.setToken(AuthTokens.accessTokenKey, result.tokens.accessToken);
            AuthTokens.setToken(AuthTokens.refreshTokenKey, result.tokens.refreshToken);
            AuthTokens.setToken(AuthTokens.userInfoTokenKey, JSON.stringify(result.user));

            return result;
        } catch (error) {
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

            return {
                response,
                result: await this.parseResponse(response)
            };
        } catch (error) {
            return {
                response: null,
                result: {
                    error: true,
                    message: 'Ошибка соединения с сервером'
                }
            };
        }
    }

    static async logout(refreshToken) {
        if (!refreshToken) {
            return true;
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

            return response.ok;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    }
}
