import {Response} from "../utils/response-utils.js";
import {AuthTokens} from "../utils/auth-utils.js";
import {url} from "../../config/config.js";
import {Validation} from "../utils/validation.js";
import {ErrorUtils} from "../utils/error-utils.js";
import flatpickr from "flatpickr";
import {Russian} from "flatpickr/dist/l10n/ru";

export class CreateGeneralOperation {
    constructor(openNewRouteAutomatic, urlRequest, url) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.urlRequest = urlRequest;
        this.url = url;
        this.amountElement = document.getElementById('sumCreateGeneralElement');
        this.dataElement = document.getElementById('dataCreateGeneralElement');
        this.commentElement = document.getElementById('commentCreateGeneralElement');
        this.btnCreate = document.getElementById('btn-create');
        this.btnCancel = document.getElementById('btn-cancel');
        this.errorElement = document.getElementById('server-error');
        this.selects = document.querySelectorAll('select');
        this.type = AuthTokens.getToken('createBtn');
        this.accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);

        this.selectColorText();
        this.automaticChoiceType().catch(error => {
            console.error('Ошибка загрузки категорий:', error);
            ErrorUtils.show({networkError: true}, this.errorElement, 'загрузить категории');
        });
        if (this.btnCancel) this.btnCancel.onclick = this.clickBtnCancel.bind(this);
        if (this.btnCreate) this.btnCreate.onclick = this.clickBtnCreate.bind(this);

        const dateInput = document.getElementById('dataCreateGeneralElement');
        if (dateInput) {
            flatpickr(dateInput, {
                dateFormat: 'Y-m-d',
                locale: Russian,
            });
        }
    }

    selectColorText() {
        if (this.selects.length < 2) return;

        this.selects[1].style.color = '#6c757d';
        this.selects[0].onfocus = () => {
            this.selects[0].style.color = 'black';
        };
        this.selects[1].onfocus = () => {
            this.selects[1].style.color = 'black';
        };
        this.selects[1].onblur = () => {
            if (this.selects[1].value === '') this.selects[1].style.color = '#6c757d';
        };
    }

    async automaticChoiceType() {
        if (this.selects.length < 2) return;

        Array.from(this.selects[0].options).forEach(option => {
            option.selected = option.value === this.type;
        });
        this.selects[0].disabled = true;
        await this.addSelectCategoryValue();
    }

    async addSelectCategoryValue() {
        if (this.selects.length < 2) return;

        this.accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        if (!this.accessToken) {
            await AuthTokens.handleSessionExpired();
            return;
        }

        const urlRequest = this.selects[0].value === 'income' ? url.changeIncomes : url.changeExpenses;
        const result = await Response.getElementsFromBackend('GET', urlRequest, this.accessToken);

        if (!Array.isArray(result)) {
            console.error('Некорректный ответ категорий:', result);
            ErrorUtils.show(result, this.errorElement, 'загрузить категории');
            return;
        }

        this.element = result;
        this.createSelectOptionsCategory();
    }

    createSelectOptionsCategory() {
        if (!this.selects[1] || !Array.isArray(this.element)) return;

        Array.from(this.selects[1].options).forEach(option => {
            if (option.value !== '') option.remove();
        });

        this.element.forEach(item => {
            const option = document.createElement('option');
            option.value = item.title;
            option.dataset.id = String(item.id);
            option.id = String(item.id);
            option.textContent = item.title;
            this.selects[1].appendChild(option);
        });
    }

    async clickBtnCreate() {
        if (this.errorElement) this.errorElement.innerText = '';
        if (!Validation.validationGenerals(this.selects, this.amountElement, this.dataElement, this.commentElement)) return;

        const selectedCategory = this.selects[1]?.options[this.selects[1].selectedIndex];
        const categoryId = Number(selectedCategory?.id);
        if (!Number.isInteger(categoryId) || categoryId <= 0) return;

        this.accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        if (!this.accessToken) {
            await AuthTokens.handleSessionExpired();
            return;
        }

        const body = {
            type: this.selects[0].value,
            amount: Number(this.amountElement.value),
            date: this.dataElement.value,
            comment: this.commentElement.value.trim(),
            category_id: categoryId,
        };

        const result = await Response.getElementsFromBackend('POST', this.urlRequest, this.accessToken, body);
        if (!result || result.error) {
            console.error('Ошибка создания операции:', result);
            ErrorUtils.show(result, this.errorElement, 'создать операцию');
            return;
        }

        await this.openNewRouteAutomatic(this.url);
    }

    async clickBtnCancel() {
        await this.openNewRouteAutomatic(this.url);
    }
}
