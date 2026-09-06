export class Validation {

    static validForm(inputsElement, password = '') {
        let isValid = true;
        let date = {
            nameInputElement: null,
            lastNameInputElement: null, // Добавлено поле для фамилии
            emailInputElement: null,
            passwordInputElement: null,
            passwordReplaceInputElement: null,
            rememberMeInputElement: null,
        }
        inputsElement.forEach((inputElement) => {
            const parentInputElement = inputElement.closest('.input-block');
            const iconInputElement = inputElement.closest('.form-floating').previousElementSibling;
            isValid = true;

            if (inputElement.value !== '') {
                if (inputElement.id === 'signUpInputName') { // Валидация имени
                    if (inputElement.value.match(/^[А-ЯЁ][а-яё]+$/)) {
                        date.nameInputElement = inputElement.value;
                        inputElement.classList.remove('invalid');
                        iconInputElement.classList.remove('invalid');
                        parentInputElement.nextElementSibling.classList.remove('invalid');
                    } else {
                        inputElement.classList.add('invalid');
                        iconInputElement.classList.add('invalid');
                        parentInputElement.nextElementSibling.classList.add('invalid');
                        isValid = false;
                    }
                }
                else if (inputElement.id === 'signUpInputLastName') { // Валидация фамилии
                    if (inputElement.value.match(/^[А-ЯЁ][а-яё]+$/)) {
                        date.lastNameInputElement = inputElement.value;
                        inputElement.classList.remove('invalid');
                        iconInputElement.classList.remove('invalid');
                        parentInputElement.nextElementSibling.classList.remove('invalid');
                    } else {
                        inputElement.classList.add('invalid');
                        iconInputElement.classList.add('invalid');
                        parentInputElement.nextElementSibling.classList.add('invalid');
                        isValid = false;
                    }
                }
                else if (inputElement.type === 'email') {
                    if (inputElement.value && inputElement.value.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/)) {
                        date.emailInputElement = inputElement.value;
                        inputElement.classList.remove('invalid');
                        iconInputElement.classList.remove('invalid');
                        parentInputElement.nextElementSibling.classList.remove('invalid');
                    } else {
                        inputElement.classList.add('invalid');
                        iconInputElement.classList.add('invalid');
                        parentInputElement.nextElementSibling.classList.add('invalid');
                        isValid = false;
                    }
                }
                else if (inputElement.type === 'password') {
                    if (inputElement.value.match(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/) && password === '') {
                        date.passwordInputElement = inputElement.value;
                        inputElement.classList.remove('invalid');
                        iconInputElement.classList.remove('invalid');
                        parentInputElement.nextElementSibling.classList.remove('invalid');
                        password = inputElement.value;
                    } else if (password !== '' && inputElement.value === password) {
                        date.passwordReplaceInputElement = inputElement.value;
                        inputElement.classList.remove('invalid');
                        iconInputElement.classList.remove('invalid');
                        parentInputElement.nextElementSibling.classList.remove('invalid');
                    } else {
                        inputElement.classList.add('invalid');
                        iconInputElement.classList.add('invalid');
                        parentInputElement.nextElementSibling.classList.add('invalid');
                        isValid = false;
                    }
                }
            } else {
                inputElement.classList.add('invalid');
                iconInputElement.classList.add('invalid');
                parentInputElement.nextElementSibling.classList.add('invalid');
                isValid = false;
            }
        })

        if (isValid) {
            return date;
        }
        return false;
    }

    static validationGenerals(selects, amount, data, comment) {
        this.selects = selects;
        this.amountElement = amount;
        this.dataElement = data;
        this.commentElement = comment;

        let isError = true;

        this.selects.forEach(select => {
            if (select.value === '') {
                select.nextElementSibling.style.display = 'block';
                select.classList.add('invalid');
                isError = false;
            } else {
                select.nextElementSibling.style.display = 'none';
                select.classList.remove('invalid');
            }
        })

        if (this.amountElement.value === '') {
            this.amountElement.nextElementSibling.style.display = 'block';
            this.amountElement.classList.add('invalid');
            isError = false;
        } else {
            this.amountElement.nextElementSibling.style.display = 'none';
            this.amountElement.classList.remove('invalid');
        }
        if (this.dataElement.value === '' || !/^\d{4}-\d{2}-\d{2}$/.test(this.dataElement.value)) {
            this.dataElement.nextElementSibling.style.display = 'block';
            this.dataElement.classList.add('invalid');
            isError = false;
        } else {
            this.dataElement.nextElementSibling.style.display = 'none';
            this.dataElement.classList.remove('invalid');
        }
        if (this.commentElement.value === '') {
            this.commentElement.nextElementSibling.style.display = 'block';
            this.commentElement.classList.add('invalid');
            isError = false;
        } else {
            this.commentElement.nextElementSibling.style.display = 'none';
            this.commentElement.classList.remove('invalid');
        }
        return isError;
    }
}