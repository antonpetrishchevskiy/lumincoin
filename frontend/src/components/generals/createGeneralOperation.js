import {Response} from "../utils/response-utils.js";
import {AuthTokens} from "../utils/auth-utils.js";
import {url} from "../../config/config.js";
import {Validation} from "../utils/validation.js";
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
        this.btnCreate = document.getElementById("btn-create");
        this.btnCancel = document.getElementById("btn-cancel");
        this.accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        this.type = AuthTokens.getToken('createBtn');
        this.selects = document.querySelectorAll('select');
        this.selectColorText();
        this.automaticChoiceType();
        this.btnCancel.onclick = this.clickBtnCancel.bind(this);
        this.btnCreate.onclick = this.clickBtnCreate.bind(this);

        flatpickr("#dataCreateGeneralElement", {
            dateFormat: "Y-m-d",
            locale: Russian,
        });
    }

    selectColorText() {
        this.selects[1].style.color = '#6c757d';
        this.selects[0].addEventListener('focus', (e) => {
            this.selects[0].style.color = 'black';
        })
        this.selects[1].addEventListener('focus', (e) => {
            this.selects[1].style.color = 'black';
        })
        this.selects[1].addEventListener('blur', (e) => {
            if (this.selects[1].value === '') {
                this.selects[1].style.color = '#6c757d';
            }
        })
    }

    automaticChoiceType() {
        this.selects[0].querySelectorAll('option').forEach(option => {
            if (option.value === this.type) {
                option.selected = true;
            }
            this.selects[0].setAttribute('disabled', 'disabled');
        });
        this.addSelectCategoryValue().then();
    }

    async addSelectCategoryValue() {
        let urlRequest = null;
        this.accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        if (this.selects[0].value === 'income') {
            console.log('доход')
            urlRequest = url.changeIncomes;
        } else {
            urlRequest = url.changeExpenses;
            console.log('расход')
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

        console.log(this.element)

        for (let i = 0; i < this.element.length; i++) {
            const option = document.createElement('option');
            option.value = this.element[i].title;
            option.id = this.element[i].id;
            option.innerText = this.element[i].title;
            this.selects[1].appendChild(option);
        }
    }

    async clickBtnCreate() {
        if (Validation.validationGenerals(this.selects, this.amountElement, this.dataElement, this.commentElement)) {

            const body = {
                type: this.selects[0].value,
                amount: this.amountElement.value,
                date: this.dataElement.value,
                comment: this.commentElement.value,
                category_id: Number(this.selects[1].options[this.selects[1].selectedIndex].id),
            }

            const result = await Response.getElementsFromBackend('POST', this.urlRequest, this.accessToken, body);
            if (result) {
                this.openNewRouteAutomatic(this.url);
            }
        }
    }

    clickBtnCancel() {
        this.openNewRouteAutomatic(this.url);
    }
}