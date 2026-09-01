import {AuthTokens} from "./auth-utils.js";

export class CustomHttpUtils {
    static async request(url, method = 'GET', isLogged = true, body = null) {
        const params = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };

        if (isLogged) {
            const token = AuthTokens.getToken(AuthTokens.accessTokenKey);

            if (token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body != null) {
            params.body = JSON.stringify(body);
        }

        const response = await fetch(url, params);

        if (response.status === 401 && isLogged) {
            const refreshed = await AuthTokens.processUnauthorisedResponse();

            if (refreshed) {
                return this.request(url, method, isLogged, body);
            }

            return null;
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Request failed');
        }

        return result;
    }
}
