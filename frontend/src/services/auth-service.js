import {CustomHttpUtils} from "../utils/custom-http.utils";
import {config} from "../config/config";

export class AuthService {
    async login(username, password) {
        const body = { username, password };
        return CustomHttpUtils.request(`${config.api}/login`, 'POST', false, body);
    }
}