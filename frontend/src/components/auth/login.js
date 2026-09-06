import {Validation} from "../utils/validation.js";
import {AuthTokens} from "../utils/auth-utils.js";
import {FormUtils} from "../utils/reset-validation.js";


export class Login {
    constructor(openNewRouteAutomatic) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.inputsElement = document.querySelectorAll('.form-floating  input');
        this.rememberMeInput = document.getElementById('remember-meInput');
        this.errorLogin = document.getElementById('error-login');
        document.getElementById("loginBtn").addEventListener("click", this.login.bind(this));
    }

    async login() {
        // Очищаем значения и стили полей с помощью утилиты
        FormUtils.resetValidationErrors(this.inputsElement, this.errorLogin);

        if (Validation.validForm(this.inputsElement)) {
            const date = Validation.validForm(this.inputsElement);

            const result = await AuthTokens.getTokensAfterRegistration(date.emailInputElement, date.passwordInputElement, this.rememberMeInput.checked);
            if (result) {
                if (result.error || !result.tokens || !result.user) {
                    this.errorLogin.innerText = 'Такого пользователя не существует';
                    return;
                } else {
                    this.errorLogin.innerText = '';
                }

                this.openNewRouteAutomatic('/');
                return

            }
            this.errorLogin.innerText = 'Пожалуйста, заполните все поля корректно';
        }
    }
}