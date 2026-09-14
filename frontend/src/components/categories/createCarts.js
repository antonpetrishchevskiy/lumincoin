import {AuthTokens} from "../utils/auth-utils.js";
import {Response} from "../utils/response-utils.js";
import {ErrorUtils} from "../utils/error-utils.js";

export class CreateCart {
    constructor(url, pathEdit, pathDelete, pathCreate, container, element = null) {
        this.url = url;
        this.element = element;
        this.pathEdit = pathEdit;
        this.pathDelete = pathDelete;
        this.pathCreate = pathCreate;
        this.container = container;
        this.pagePath = location.pathname;
        this.accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        this.errorElement = document.getElementById('server-error');
        this.init().catch(error => console.error('Ошибка загрузки категорий:', error));
    }

    isCurrentPage() {
        return location.pathname === this.pagePath;
    }

    async init() {
        const result = await Response.getElementsFromBackend('GET', this.url, this.accessToken);
        if (!this.isCurrentPage()) return;

        if (!Array.isArray(result)) {
            console.error('Некорректный ответ категорий:', result);
            ErrorUtils.show(result, this.errorElement, 'загрузить категории');
            return;
        }

        this.element = result;
        this.createCarts();
        this.getIncomeElementValue();
    }

    createCarts() {
        this.container ||= document.querySelector('.income-elements');
        if (!this.container || !this.isCurrentPage()) {
            return;
        }

        this.element.forEach(item => {
            const incomeElement = document.createElement('div');
            incomeElement.classList.add('income-element', 'd-flex', 'flex-column', 'justify-content-center');

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('income-element-title', 'ps-3');
            titleDiv.textContent = item.title;
            titleDiv.dataset.id = item.id;

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

            buttonsDiv.append(editButton, deleteButton);
            incomeElement.append(titleDiv, buttonsDiv);
            this.container.appendChild(incomeElement);
        });

        const addButton = document.createElement('a');
        addButton.href = this.pathCreate;
        addButton.classList.add(
            'income-element',
            'd-flex',
            'flex-column',
            'align-items-center',
            'justify-content-center',
            'text-decoration-none'
        );

        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-plus', 'text-secondary');
        addButton.appendChild(icon);
        this.container.appendChild(addButton);
    }

    getIncomeElementValue() {
        if (!this.container || !this.isCurrentPage()) return;

        this.container.querySelectorAll('.btn-edit').forEach(button => {
            button.onclick = event => {
                const element = event.currentTarget.closest('.income-element');
                const title = element?.querySelector('.income-element-title');
                if (!title) return;

                localStorage.setItem('incomeElementTitle', title.innerText);
                localStorage.setItem('incomeElementId', title.dataset.id);
            };
        });

        this.container.querySelectorAll('.deleteBtnRed').forEach(button => {
            button.onclick = event => {
                const element = event.currentTarget.closest('.income-element');
                const title = element?.querySelector('.income-element-title');
                if (title) {
                    localStorage.setItem('incomeElementId', title.dataset.id);
                }
            };
        });
    }
}
