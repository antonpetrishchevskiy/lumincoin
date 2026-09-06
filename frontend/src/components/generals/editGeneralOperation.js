import {AuthTokens} from "../utils/auth-utils.js";
import {Response} from "../utils/response-utils.js";
import {Validation} from "../utils/validation.js";
import {url} from "../../config/config.js";
import flatpickr from "flatpickr";
import {Russian} from "flatpickr/dist/l10n/ru";

export class EditGeneralOperation {
    constructor(openNewRouteAutomatic, urlRequest, url) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.urlRequest = urlRequest;
        this.url = url;
        this.generalElementId = null;
        this.selects = document.querySelectorAll('select');
        this.editTypeElement = this.selects[0];
        this.editCategoryElement = this.selects[1];
        this.editAmountElement = document.getElementById('sumEditGeneralElement');
        this.editDateElement = document.getElementById('dataEditGeneralElement');
        this.editCommentElement = document.getElementById('commentEditGeneralElement');
        this.saveBtn = document.getElementById('saveBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.saveBtn.onclick = this.clickBtnEdit.bind(this);
        this.cancelBtn.onclick = this.clickBtnCancel.bind(this);
        this.editElement();

        flatpickr("#dataEditGeneralElement", {
            dateFormat: "Y-m-d",
            locale: Russian,
        });
    }

    editElement() {
        this.rowData = JSON.parse(AuthTokens.getToken('rowData'));
        Array.from(this.editTypeElement.options).forEach((item) => {

            if(item.textContent === this.rowData.type) {
                    item.setAttribute('selected', 'selected');
            } else {
                item.removeAttribute('selected');
            }
            this.editTypeElement.setAttribute('disabled', 'disabled');
        })

        this.addSelectCategoryValue().then();

        this.editAmountElement.value = this.rowData.amount;
        this.editDateElement.value = this.rowData.date;
        this.editCommentElement.value = this.rowData.comment;

        this.selects[0].addEventListener('change', (e) => {
            this.addSelectCategoryValue().then();
        })
    }

    async addSelectCategoryValue() {
        let urlRequest = null;
        this.accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        if (this.selects[0].value === 'income') {
            urlRequest = url.changeIncomes;
        } else {
            urlRequest = url.changeExpenses;
        }
        this.element = await Response.getElementsFromBackend('GET', urlRequest, this.accessToken);
        this.createSelectOptionsCategory();
    }

    createSelectOptionsCategory() {
        this.selects[1].querySelectorAll('option').forEach(option => {
            if (option.value !== '') {
                option.remove();
            }
        })

        for (let i = 0; i < this.element.length; i++) {
            const option = document.createElement('option');
            option.value = this.element[i].title;
            option.id = this.element[i].id;
            option.innerText = this.element[i].title;
            this.selects[1].appendChild(option);
        }

        if(this.rowData.category === 'без категории') {
            const option = document.createElement('option');
            option.value = '';
            option.innerText = 'без категории';
            option.setAttribute('selected', 'selected');
            this.selects[1].appendChild(option);
        } else {
            Array.from(this.editCategoryElement.options).forEach((item) => {
                if(item.textContent === this.rowData.category) {
                    item.setAttribute('selected', 'selected');
                } else {
                    item.removeAttribute('selected');
                }
            })
        }
    }

    async clickBtnEdit() {
        this.generalElementId = localStorage.getItem('idRowGenerals')
        if (Validation.validationGenerals(this.selects, this.editAmountElement, this.editDateElement, this.editCommentElement)) {
            const body = {
                type: this.selects[0].value,
                amount: +this.editAmountElement.value,
                date: this.editDateElement.value,
                comment: this.editCommentElement.value,
                category_id: Number(this.selects[1].options[this.selects[1].selectedIndex].id),
            }

            const result = await Response.getElementsFromBackend('PUT', this.urlRequest + this.generalElementId, this.accessToken, body);

            if(result) {
                this.openNewRouteAutomatic(this.url);
            }
        }
    }

    clickBtnCancel() {
        this.openNewRouteAutomatic(this.url);
    }
}