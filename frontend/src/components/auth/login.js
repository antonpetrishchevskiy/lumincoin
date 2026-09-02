import {Validation} from "../../utils/validation.js";
import {AuthTokens} from "../../utils/auth-utils.js";
import {FormUtils} from "../../utils/reset-validation.js";

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

        // Запускаем валидацию и сохраняем результат в переменную
        const validationResult = Validation.validForm(this.inputsElement);

        // Если валидация не прошла, показываем сообщение об ошибке и выходим из валидации
        if (!validationResult) {
            this.errorLogin.innerText = 'Пожалуйста, заполните все поля корректно';
            return;
        }

        // получаем токены
        const result = await AuthTokens.getTokensAfterRegistration(
            validationResult.emailInputElement,
            validationResult.passwordInputElement,
            this.rememberMeInput.checked
        );

        if (result.error || !result.tokens || !result.user) {
            this.errorLogin.innerText = result.message;
            return;
        }

        // Очищаем поля и переводим на главную страницу.
        this.errorLogin.innerText = '';
        this.openNewRouteAutomatic('/');
    }
}