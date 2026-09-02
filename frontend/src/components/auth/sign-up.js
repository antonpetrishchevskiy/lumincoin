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

        const validationResult = Validation.validForm(this.inputsElement, this.password);

        if (!validationResult) {
            this.errorSignUp.innerText = 'Пожалуйста, заполните все поля корректно';
            return;
        }

        const result = await AuthTokens.signUp({
            name: validationResult.nameInputElement,
            lastName: validationResult.lastNameInputElement,
            email: validationResult.emailInputElement,
            password: validationResult.passwordInputElement,
            passwordRepeat: validationResult.passwordReplaceInputElement
        });

        if (result.error || !result.user) {
            const isExistingUser = result.message?.toLowerCase().includes('already exist');

            if (isExistingUser) {
                AuthTokens.setUserEmail(validationResult.emailInputElement);
                await this.openNewRouteAutomatic('/login');
                return;
            }

            this.errorSignUp.innerText = result.message || 'Ошибка регистрации';
            return;
        }

        const resultToken = await AuthTokens.login(
            result.user.email,
            validationResult.passwordInputElement
        );

        if (resultToken.error || !resultToken.tokens || !resultToken.user) {
            this.errorSignUp.innerText = resultToken.message || 'Регистрация выполнена, но войти не удалось';
            return;
        }

        this.errorSignUp.innerText = '';
        this.openNewRouteAutomatic('/');
    }
}
