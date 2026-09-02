export class Validation {
    static validForm(inputsElement, password = '') {
        let isValid = true;
        let date = {
            nameInputElement: null,
            lastNameInputElement: null,
            emailInputElement: null,
            passwordInputElement: null,
            passwordReplaceInputElement: null,
            rememberMeInputElement: null,
        };

        inputsElement.forEach((inputElement) => {
            const parentInputElement = inputElement.closest('.input-block');
            const iconInputElement = inputElement.closest('.form-floating').previousElementSibling;
            let fieldValid = true;

            // Убираем стили для ошибок
            inputElement.classList.remove('invalid');
            if (iconInputElement) iconInputElement.classList.remove('invalid');
            if (parentInputElement && parentInputElement.nextElementSibling) {
                parentInputElement.nextElementSibling.classList.remove('invalid');
            }

            if (inputElement.value === '') {
                fieldValid = false;
            } else {
                if (inputElement.id === 'signUpInputName' || inputElement.id === 'signUpInputLastName') {
                    if (!inputElement.value.match(/^[А-ЯЁ][а-яё]*$/)) {
                        fieldValid = false;
                    } else {
                        if (inputElement.id === 'signUpInputName') {
                            date.nameInputElement = inputElement.value;
                        } else {
                            date.lastNameInputElement = inputElement.value;
                        }
                    }
                }
                if (inputElement.type === 'email') {
                    if (!inputElement.value.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/)) {
                        fieldValid = false;
                    } else {
                        date.emailInputElement = inputElement.value;
                    }
                }
                if (inputElement.id === 'signUpInputPassword') {
                    // Валидация пароля (минимум 8 символов, хотя бы одна заглавная и одна цифра)
                    if (!inputElement.value.match(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
                        fieldValid = false;
                    } else {
                        date.passwordInputElement = inputElement.value;
                        this.password = inputElement.value; // Сохраняем пароль для проверки повторного ввода
                    }
                }
                if (inputElement.id === 'signUpInputRepeatPassword') {
                    // Проверка совпадения паролей
                    if (inputElement.value !== this.password) {
                        fieldValid = false;
                        // Показываем специальное сообщение для несовпадающих паролей
                        const errorElement = parentInputElement.nextElementSibling;
                        if (errorElement) {
                            errorElement.innerText = 'Пароли не совпадают';
                        }
                    } else {
                        date.passwordReplaceInputElement = inputElement.value;
                    }
                }
            }

            if (!fieldValid) {
                inputElement.classList.add('invalid');
                if (iconInputElement) iconInputElement.classList.add('invalid');
                if (parentInputElement && parentInputElement.nextElementSibling) {
                    parentInputElement.nextElementSibling.classList.add('invalid');
                }
                isValid = false;
            }
        });

        return isValid ? date : false;
    }
}