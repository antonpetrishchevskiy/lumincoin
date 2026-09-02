import {Validation} from "../../utils/validation.js";
import {AuthTokens} from "../../utils/auth-utils.js";
import {FormUtils} from "../../utils/reset-validation.js";

export class Login {
    constructor(openNewRouteAutomatic) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.inputsElement = document.querySelectorAll('.form-floating  input');
        this.rememberMeInput = document.getElementById('remember-meInput');
        this.errorLogin = document.getElementById('error-login');

        const savedEmail = AuthTokens.getToken(AuthTokens.userEmailKey);
        const emailInput = document.getElementById('loginEmail');

        if (savedEmail && emailInput) {
            emailInput.value = savedEmail;
        }

        document.getElementById("loginBtn").addEventListener("click", this.login.bind(this));
    }

    async login() {
        FormUtils.resetValidationErrors(this.inputsElement, this.errorLogin);

        const validationResult = Validation.validForm(this.inputsElement);

        if (!validationResult) {
            this.errorLogin.innerText = 'Пожалуйста, заполните все поля корректно';
            return;
        }

        const result = await AuthTokens.login(
            validationResult.emailInputElement,
            validationResult.passwordInputElement,
            this.rememberMeInput.checked
        );

        if (result.error || !result.tokens || !result.user) {
            this.errorLogin.innerText = result.message || 'Ошибка авторизации';
            return;
        }

        this.errorLogin.innerText = '';
        this.openNewRouteAutomatic('/');
    }
}
