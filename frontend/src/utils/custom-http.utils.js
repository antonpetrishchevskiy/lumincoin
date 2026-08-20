import {AuthTokens} from "./auth-utils";

export class CustomHttpUtils {
    static async request(url, method = 'GET', isLogged = true, body = null) {
        const params = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            }
        }
        if (isLogged) {
            const token = localStorage.getItem('authToken');
            if (token != null) {
                params.headers['x-auth-token'] = token;
            }
        }
        if (body != null) {
            params.body = JSON.stringify(body);
        }

        const response = await fetch(url, params);

        if (response.status < 200 && response.status >= 300) {
            if (response.status === 401) {
                const result = await AuthTokens.processUnauthorisedResponse();
                if (result) {
                    return await this.request(url, method, islogged, result);
                } else {
                    return null;
                }
            }
            throw new Error(response.message)
        }
        return await response.json();
    }
}