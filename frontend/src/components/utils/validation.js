export class Validation {
    static validForm(inputsElement, password = '') {
        let isValid = true;
        const data = {
            nameInputElement: null,
            lastNameInputElement: null,
            emailInputElement: null,
            passwordInputElement: null,
            passwordReplaceInputElement: null,
            rememberMeInputElement: null,
        };

        let primaryPassword = password;

        inputsElement.forEach(inputElement => {
            const parentInputElement = inputElement.closest('.input-block');
            const iconInputElement = inputElement.closest('.form-floating')?.previousElementSibling;
            const errorElement = parentInputElement?.nextElementSibling;
            const invalidate = () => {
                inputElement.classList.add('invalid');
                iconInputElement?.classList.add('invalid');
                errorElement?.classList.add('invalid');
                isValid = false;
            };
            const validateSuccess = () => {
                inputElement.classList.remove('invalid');
                iconInputElement?.classList.remove('invalid');
                errorElement?.classList.remove('invalid');
            };

            const value = inputElement.type === 'password'
                ? inputElement.value
                : inputElement.value.trim();
            if (!value) {
                invalidate();
                return;
            }

            if (inputElement.id === 'signUpInputName') {
                if (/^.{3,}$/u.test(value)) {
                    data.nameInputElement = value;
                    validateSuccess();
                } else {
                    invalidate();
                }
            } else if (inputElement.id === 'signUpInputLastName') {
                if (/^.{3,}$/u.test(value)) {
                    data.lastNameInputElement = value;
                    validateSuccess();
                } else {
                    invalidate();
                }
            } else if (inputElement.type === 'email') {
                if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(value)) {
                    data.emailInputElement = value;
                    validateSuccess();
                } else {
                    invalidate();
                }
            } else if (inputElement.type === 'password') {
                if (inputElement.id === 'signUpInputRepeatPassword') {
                    if (primaryPassword && value === primaryPassword) {
                        data.passwordReplaceInputElement = value;
                        validateSuccess();
                    } else {
                        invalidate();
                    }
                } else if (value.length >= 6) {
                    data.passwordInputElement = value;
                    primaryPassword = value;
                    validateSuccess();
                } else {
                    invalidate();
                }
            } else {
                validateSuccess();
            }
        });

        return isValid ? data : false;
    }

    static validationGenerals(selects, amount, data, comment, options = {}) {
        let isValid = true;
        const categoryElement = options.categoryElement || selects[1];
        const categoryRequired = options.categoryRequired !== false;

        selects.forEach(select => {
            if (!select.value) {
                select.nextElementSibling?.style.setProperty('display', 'block');
                select.classList.add('invalid');
                isValid = false;
            } else {
                select.nextElementSibling?.style.setProperty('display', 'none');
                select.classList.remove('invalid');
            }
        });

        if (categoryElement && !categoryRequired) {
            categoryElement.nextElementSibling?.style.setProperty('display', 'none');
            categoryElement.classList.remove('invalid');
        }

        const amountValue = Number(amount?.value);
        if (!Number.isFinite(amountValue) || amountValue <= 0) {
            amount?.nextElementSibling?.style.setProperty('display', 'block');
            amount?.classList.add('invalid');
            isValid = false;
        } else {
            amount?.nextElementSibling?.style.setProperty('display', 'none');
            amount?.classList.remove('invalid');
        }

        const dateValue = data?.value || '';
        const dateParts = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        let validDate = false;
        if (dateParts) {
            const year = Number(dateParts[1]);
            const month = Number(dateParts[2]);
            const day = Number(dateParts[3]);
            const date = new Date(Date.UTC(year, month - 1, day));
            validDate = date.getUTCFullYear() === year
                && date.getUTCMonth() === month - 1
                && date.getUTCDate() === day;
        }

        if (!validDate) {
            data?.nextElementSibling?.style.setProperty('display', 'block');
            data?.classList.add('invalid');
            isValid = false;
        } else {
            data?.nextElementSibling?.style.setProperty('display', 'none');
            data?.classList.remove('invalid');
        }

        if (!comment?.value.trim()) {
            comment?.nextElementSibling?.style.setProperty('display', 'block');
            comment?.classList.add('invalid');
            isValid = false;
        } else {
            comment?.nextElementSibling?.style.setProperty('display', 'none');
            comment?.classList.remove('invalid');
        }

        return isValid;
    }
}
