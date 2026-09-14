import {Response} from "../utils/response-utils.js";
import {AuthTokens} from "../utils/auth-utils.js";
import {url} from "../../config/config.js";
import {Validation} from "../utils/validation.js";
import {ErrorUtils} from "../utils/error-utils.js";
import flatpickr from "flatpickr";
import {Russian} from "flatpickr/dist/l10n/ru";

export class EditGeneralOperation {
    constructor(openNewRouteAutomatic, urlRequest, url) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.urlRequest = urlRequest;
        this.url = url;
        this.selects = document.querySelectorAll('select');
        this.editTypeElement = this.selects[0];
        this.editCategoryElement = this.selects[1];
        this.editAmountElement = document.getElementById('sumEditGeneralElement');
        this.editDateElement = document.getElementById('dataEditGeneralElement');
        this.editCommentElement = document.getElementById('commentEditGeneralElement');
        this.saveBtn = document.getElementById('saveBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.errorElement = document.getElementById('server-error');
        this.accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);

        if (!this.editTypeElement || !this.editCategoryElement) {
            this.openNewRouteAutomatic(this.url).catch(error => console.error(error));
            return;
        }

        const rawRowData = AuthTokens.getToken('rowData');
        const generalElementId = AuthTokens.getToken('idRowGenerals');
        if (!rawRowData || !generalElementId) {
            this.openNewRouteAutomatic(this.url).catch(error => console.error('Не выбрана операция:', error));
            return;
        }

        try {
            this.rowData = JSON.parse(rawRowData);
        } catch (error) {
            this.openNewRouteAutomatic(this.url).catch(routeError => console.error(routeError));
            return;
        }

        if (this.saveBtn) this.saveBtn.onclick = this.clickBtnEdit.bind(this);
        if (this.cancelBtn) this.cancelBtn.onclick = this.clickBtnCancel.bind(this);

        this.editElement().catch(error => {
            console.error('Ошибка загрузки операции:', error);
            ErrorUtils.show({networkError: true}, this.errorElement, 'загрузить операцию');
        });

        if (this.editDateElement) {
            flatpickr(this.editDateElement, {
                dateFormat: 'Y-m-d',
                locale: Russian,
            });
        }
    }

    async editElement() {
        Array.from(this.editTypeElement.options).forEach(option => {
            option.selected = option.textContent.trim() === this.rowData.type
                || option.value === this.rowData.type;
        });
        this.editTypeElement.disabled = true;

        if (this.editAmountElement) this.editAmountElement.value = this.rowData.amount ?? '';
        if (this.editDateElement) this.editDateElement.value = this.rowData.date ?? '';
        if (this.editCommentElement) this.editCommentElement.value = this.rowData.comment ?? '';

        await this.addSelectCategoryValue();
    }

    async addSelectCategoryValue() {
        this.accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        if (!this.accessToken) {
            await AuthTokens.handleSessionExpired();
            return;
        }

        const urlRequest = this.editTypeElement.value === 'income' ? url.changeIncomes : url.changeExpenses;
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
        Array.from(this.editCategoryElement.options).forEach(option => {
            if (option.value !== '') option.remove();
        });

        this.element.forEach(item => {
            const option = document.createElement('option');
            option.value = item.title;
            option.id = String(item.id);
            option.dataset.id = String(item.id);
            option.textContent = item.title;
            this.editCategoryElement.appendChild(option);
        });

        const category = this.rowData.category?.trim() || '';
        const matchingOption = Array.from(this.editCategoryElement.options)
            .find(option => option.textContent.trim() === category);

        if (matchingOption) {
            matchingOption.selected = true;
            return;
        }

        const noCategoryOption = Array.from(this.editCategoryElement.options)
            .find(option => option.value === '');

        if (noCategoryOption) {
            noCategoryOption.selected = true;
            noCategoryOption.textContent = 'без категории';
            return;
        }

        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'без категории';
        option.selected = true;
        this.editCategoryElement.insertBefore(option, this.editCategoryElement.firstChild);
    }

    async clickBtnEdit() {
        if (this.errorElement) this.errorElement.innerText = '';
        const generalElementId = AuthTokens.getToken('idRowGenerals');
        if (!generalElementId) {
            await this.openNewRouteAutomatic(this.url);
            return;
        }

        if (!Validation.validationGenerals(
            [this.editTypeElement],
            this.editAmountElement,
            this.editDateElement,
            this.editCommentElement,
            {categoryElement: this.editCategoryElement, categoryRequired: false}
        )) return;

        this.accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        if (!this.accessToken) {
            await AuthTokens.handleSessionExpired();
            return;
        }

        const selectedCategory = this.editCategoryElement.options[this.editCategoryElement.selectedIndex];
        const categoryId = Number(selectedCategory?.id);
        const body = {
            type: this.editTypeElement.value,
            amount: Number(this.editAmountElement.value),
            date: this.editDateElement.value,
            comment: this.editCommentElement.value.trim(),
        };

        if (Number.isInteger(categoryId) && categoryId > 0) body.category_id = categoryId;

        const result = await Response.getElementsFromBackend('PUT', this.urlRequest + generalElementId, this.accessToken, body);
        if (!result || result.error) {
            console.error('Ошибка редактирования операции:', result);
            ErrorUtils.show(result, this.errorElement, 'редактировать операцию');
            return;
        }

        AuthTokens.setToken('rowData', null);
        AuthTokens.setToken('idRowGenerals', null);
        await this.openNewRouteAutomatic(this.url);
    }

    async clickBtnCancel() {
        AuthTokens.setToken('rowData', null);
        AuthTokens.setToken('idRowGenerals', null);
        await this.openNewRouteAutomatic(this.url);
    }
}
