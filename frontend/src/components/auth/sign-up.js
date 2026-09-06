import {config} from "../../config/config.js";
import {AuthTokens} from "../utils/auth-utils.js";
import {Validation} from "../utils/validation.js";
import {FormUtils} from "../utils/reset-validation.js";

export class SignUp {
    password = '';

    constructor(openNewRouteAutomatic) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.inputsElement = document.querySelectorAll('.form-floating  input');
        this.errorSignUp = document.getElementById('error-singUp');
        document.getElementById("singUpBtn").addEventListener("click", this.signUp.bind(this));
    }

    async signUp() {
        FormUtils.resetValidationErrors(this.inputsElement, this.errorSignUp);

        // Проводим валидацию
        const validationResult = Validation.validForm(this.inputsElement, this.password);

        if (!validationResult) {
            // Если валидация не прошла, показываем сообщение
            this.errorSignUp.innerText = 'Пожалуйста, заполните все поля корректно';
            return;
        }

        // Если валидация прошла, пытаемся зарегистрироваться
        if (Validation.validForm(this.inputsElement, this.password)) {
            const date = Validation.validForm(this.inputsElement);

            const response = await fetch(config.api + '/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: date.nameInputElement,
                    lastName: date.lastNameInputElement,
                    email: date.emailInputElement,
                    password: date.passwordInputElement,
                    passwordRepeat: date.passwordReplaceInputElement
                })
            })

            const result = await response.json();

            if (!result.user) {
                this.errorSignUp.innerText = "Ошибка регистрации";
                return;
            } else {
                this.errorSignUp.innerText = '';
            }

            await AuthTokens.getTokensAfterRegistration(result.user.email, date.passwordInputElement);

            this.openNewRouteAutomatic('/');

        } else {
            alert('Ошибка регистрации. Попробуйте снова!');
        }
    }
}