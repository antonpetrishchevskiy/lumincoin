import {AuthTokens} from "./auth-utils";
import {config} from "../../config/config.js";

export class Response {
    static async getElementsFromBackend(method, url, accessToken, body, params) {
        let headers = {};

        if (accessToken) {
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': accessToken,
            }
        } else {
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        let object = {
            method: method,
            headers: headers,
        }

        if (body) {
            object.body = JSON.stringify(body);
        }

        if (params) {
            object.params = JSON.stringify(params);
        }

        const response = await fetch(config.api + url, object);

        if (!response.status >= 200 && !response.status < 300) {
            console.log('Error fetching incomes from backend');
            return;
        }

        const result = await response.json();

        if (result.error) {
            if (result.message === "jwt expired") {
                await AuthTokens.refreshToken();
                await this.getElementsFromBackend(method, url, accessToken, body);
                return;
            } else if (result.message === "Invalid email or password") {
                return result;
            } else if (result.message) {
                localStorage.clear();
                return result;
            } else {
                console.log(`Error: ${result.message}`);
                localStorage.clear();
            }
        }
        return result;
    }
}