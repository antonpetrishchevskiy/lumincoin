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
        if (this.isBlock) {
            this.logoutExitBtn.style.display = "block";
            this.isBlock = false;
        } else {
            this.logoutExitBtn.style.display = "none";
            this.isBlock = true;
        }
    }

    async logout() {
        const result = await AuthTokens.logout();

        if (!result.success) {
            return;
        }

        AuthTokens.clearTokens();
        localStorage.removeItem(AuthTokens.userEmailKey);
        await this.openNewRouteAutomatic('/login');
    }
}
