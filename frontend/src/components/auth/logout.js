import {config} from "../../config/config.js";
import {AuthTokens} from "../../utils/auth-utils.js";

export class Logout {
    isBlock = true;
    constructor(openNewRouteAutomatic) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.logoutUserName = document.getElementById("layoutUserNameBlock");
        this.logoutExitBtn = document.getElementById("exit-layout");
        this.logoutUserName.addEventListener("click", this.showBtnExit.bind(this));
        this.logoutExitBtn.addEventListener("click", this.logout.bind(this));
    }

    showBtnExit() {
        if(this.isBlock) {
            this.logoutExitBtn.style.display = "block";
            this.isBlock = false;
        } else {
            this.logoutExitBtn.style.display = "none";
            this.isBlock = true;
        }
    }

    async logout(e) {
        const refreshToken = AuthTokens.getToken(AuthTokens.refreshTokenKey);

        const response = await fetch(config.api + '/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                refreshToken: refreshToken,
            })
        });

        const result = response.json();

        if(result && !result.error) {
            localStorage.clear();
            this.openNewRouteAutomatic('/login');
        }
    }
}