import {AuthTokens} from "../utils/auth-utils.js";
import {Response} from "../utils/response-utils.js";

export class CreateCart {
    constructor(url, pathEdit, pathDelete, pathCreate, container, element = null) {
        this.url = url;
        this.element = element;
        this.pathEdit = pathEdit;
        this.pathDelete = pathDelete;
        this.pathCreate = pathCreate;
        this.container = container;
        this.accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        this.init().then();
    }

    async init() {
        this.element = await Response.getElementsFromBackend('GET', this.url, this.accessToken);
        this.createCarts();
        this.getIncomeElementValue();
    }

    createCarts() {
        if(this.container === null) {
            this.container = document.querySelector('.income-elements');
        }
        for (let i = 0; i < this.element.length; i++) {
            const incomeElement = document.createElement('div');
            incomeElement.classList.add('income-element', 'd-flex', 'flex-column', 'justify-content-center');

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('income-element-title', 'ps-3');
            titleDiv.textContent = this.element[i].title;
            titleDiv.setAttribute('id', this.element[i].id);

            const buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('income-element-buttons', 'ps-3', 'mt-3');

            const editButton = document.createElement('a');
            editButton.href = this.pathEdit;
            editButton.classList.add('btn', 'btn-edit', 'btn-primary', 'me-3');
            editButton.textContent = 'Редактировать';

            const deleteButton = document.createElement('a');
            deleteButton.href = this.pathDelete;
            deleteButton.classList.add('btn', 'btn-danger', 'deleteBtnRed');
            deleteButton.textContent = 'Удалить';

            buttonsDiv.appendChild(editButton);
            buttonsDiv.appendChild(deleteButton);

            incomeElement.appendChild(titleDiv);
            incomeElement.appendChild(buttonsDiv);
            this.container.appendChild(incomeElement);
        }

        const addButton = document.createElement('a');
        addButton.href = this.pathCreate;
        addButton.classList.add('income-element', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'text-decoration-none');

        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-plus', 'text-secondary');

        addButton.appendChild(icon);
        this.container.appendChild(addButton);
    }

    getIncomeElementValue() {
        this.btnEdits = document.querySelectorAll('.btn-edit');
        this.btnEdits.forEach((btnEdit) => {
            btnEdit.onclick = function () {
                const incomeElementTitle = btnEdit.closest('.income-element-buttons').previousElementSibling;
                const incomeElementId = incomeElementTitle.getAttribute('id');

                localStorage.setItem('incomeElementTitle', incomeElementTitle.innerText);
                localStorage.setItem('incomeElementId', incomeElementId);
            }
        })

        this.deleteBtnsRed = document.querySelectorAll('.deleteBtnRed');
        this.deleteBtnsRed.forEach((deleteBtnRed) => {
            deleteBtnRed.onclick = function () {
                const incomeElementId = deleteBtnRed.closest('.income-element-buttons').previousElementSibling.getAttribute('id');
                localStorage.setItem('incomeElementId', incomeElementId);
            }
        })
    }
}