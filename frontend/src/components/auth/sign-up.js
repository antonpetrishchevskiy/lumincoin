import {config} from "../../config/config.js";
import {AuthTokens} from "../../utils/auth-utils.js";
import {Validation} from "../../utils/validation.js";
import {FormUtils} from "../../utils/reset-validation.js";

export class SignUp {
    password = '';

    constructor(openNewRouteAutomatic) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.inputsElement = document.querySelectorAll('.form-floating input');
        this.errorSignUp = document.getElementById('error-singUp');
        document.getElementById("singUpBtn").addEventListener("click", this.signUp.bind(this));

        document.getElementById("signUpInputPassword")?.addEventListener("input", (e) => {
            this.password = e.target.value;
        });
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
        try {
            const response = await fetch(config.api + '/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: validationResult.nameInputElement,
                    lastName: validationResult.lastNameInputElement,
                    email: validationResult.emailInputElement,
                    password: validationResult.passwordInputElement,
                    passwordRepeat: validationResult.passwordReplaceInputElement
                })
            });

            const result = await response.json();

            if (!result.user) {
                this.errorSignUp.innerText = result.message || 'Ошибка регистрации';
                return;
            }

            // Если регистрация успешна, получаем токены
            const resultToken = await AuthTokens.getTokensAfterRegistration(
                result.user.email,
                validationResult.passwordInputElement
            );

            if (resultToken.error) {
                this.errorSignUp.innerText = resultToken.message;
                return;
            }

            // Если все успешно, перенаправляем
            this.errorSignUp.innerText = '';
            this.openNewRouteAutomatic('/');

        } catch (error) {
            this.errorSignUp.innerText = 'Ошибка соединения с сервером';
            console.error('SignUp error:', error);
        }
    }
}