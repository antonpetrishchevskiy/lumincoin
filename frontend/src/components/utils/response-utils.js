import {AuthTokens} from "./auth-utils.js";
import {config} from "../../config/config.js";

export class Response {
    static async getElementsFromBackend(method, url, accessToken, body, params, isRetry = false) {
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        if (accessToken) {
            headers['x-auth-token'] = accessToken;
        }

        const requestUrl = new URL(config.api + url, window.location.origin);
        if (params && typeof params === 'object') {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    requestUrl.searchParams.set(key, String(value));
                }
            });
        }

        const request = {
            method,
            headers,
        };

        if (body !== undefined && body !== null && !['GET', 'HEAD'].includes(method.toUpperCase())) {
            request.body = JSON.stringify(body);
        }

        const requestPath = url.split('?')[0].replace(/\/+$/, '') || '/';
        const isAuthRequest = ['/login', '/refresh', '/logout', '/signup'].includes(requestPath);

        try {
            const response = await fetch(requestUrl, request);
            const responseText = await response.text();
            let result = {};

            if (responseText) {
                try {
                    result = JSON.parse(responseText);
                } catch (error) {
                    console.error(`Некорректный JSON в ответе ${method} ${url}:`, error);
                    result = {
                        error: true,
                        status: response.status,
                        message: `Некорректный ответ сервера (HTTP ${response.status})`,
                    };
                }
            }

            const tokenExpired = response.status === 401 || result?.message === 'jwt expired';

            if (tokenExpired && !isAuthRequest && !isRetry) {
                const newAccessToken = await AuthTokens.refreshToken();

                if (newAccessToken) {
                    return this.getElementsFromBackend(method, url, newAccessToken, body, params, true);
                }

                if (!AuthTokens.getToken(AuthTokens.refreshTokenKey)) {
                    await AuthTokens.handleSessionExpired();
                }
            }

            if (tokenExpired && !isAuthRequest && isRetry) {
                await AuthTokens.handleSessionExpired();
            }

            if (result?.error) {
                return {
                    ...result,
                    error: true,
                    status: response.status,
                };
            }

            if (!response.ok) {
                return {
                    error: true,
                    status: response.status,
                    message: result?.message || `HTTP ${response.status}`,
                };
            }

            return result;
        } catch (error) {
            console.error(`Ошибка запроса ${method} ${url}:`, error);
            return {
                error: true,
                networkError: true,
                message: 'Ошибка соединения с сервером',
            };
        }
    }
}
