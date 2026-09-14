import {AuthTokens} from "../utils/auth-utils.js";
import {Response} from "../utils/response-utils.js";
import {url} from "../../config/config.js";
import {Period} from "../utils/period.js";
import {GetDataUtils} from "../utils/getData-utils.js";
import {Main} from "../main.js";
import {ErrorUtils} from "../utils/error-utils.js";

export class Generals {
    constructor(period) {
        this.pagePath = location.pathname;
        this.todayData = GetDataUtils.getData();
        this.period = period || `?period=${this.todayData}`;
        this.result = [];
        this.wrapperTable = document.getElementById('wrapperGeneralTable');
        this.errorElement = document.getElementById('server-error');
        this.categoryFilter = document.getElementById('categoryFilter');

        this.bindCreateButtons();
        this.bindCategoryFilter();
        this.init().catch(error => console.error('Ошибка загрузки операций:', error));

        if (document.querySelectorAll('.btn-period').length) {
            new Period();
        }

        if (this.pagePath === '/') {
            window.onresize = this.resize.bind(this);
        }
    }

    isCurrentPage() {
        return location.pathname === this.pagePath;
    }

    bindCreateButtons() {
        document.querySelectorAll('.btn-create').forEach(button => {
            button.onclick = event => {
                AuthTokens.setToken('createBtn', event.currentTarget.getAttribute('type'));
            };
        });
    }

    bindCategoryFilter() {
        if (this.categoryFilter && this.pagePath === '/generals') {
            this.categoryFilter.onchange = () => this.applyCategoryFilter();
        }
    }

    populateCategoryFilter(result) {
        if (!this.categoryFilter || this.pagePath !== '/generals' || !Array.isArray(result)) {
            return;
        }

        const selectedCategories = new Set(
            Array.from(this.categoryFilter.selectedOptions).map(option => option.value)
        );
        const categories = [...new Set(
            result.map(item => String(item?.category ?? '').trim() || 'без категории')
        )].sort((a, b) => a.localeCompare(b, 'ru'));

        this.categoryFilter.innerHTML = '';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            option.selected = selectedCategories.has(category);
            this.categoryFilter.appendChild(option);
        });
    }

    applyCategoryFilter() {
        if (!this.isCurrentPage() || !Array.isArray(this.result)) {
            return;
        }

        const selectedCategories = new Set(
            Array.from(this.categoryFilter?.selectedOptions || []).map(option => option.value)
        );
        const filteredResult = selectedCategories.size === 0
            ? this.result
            : this.result.filter(item => {
                const category = String(item?.category ?? '').trim() || 'без категории';
                return selectedCategories.has(category);
            });

        this.createTableWithOperations(filteredResult);
    }

    async init() {
        const result = await this.getGeneralsOperationsFromBackend();
        if (!result || !this.isCurrentPage()) {
            return;
        }

        if (this.pagePath === '/generals') {
            this.populateCategoryFilter(result);
            this.createTableWithOperations(result);
            this.editBtns = document.querySelectorAll('.editGeneralOperation');
            this.editBtns.forEach(button => {
                button.onclick = this.editGeneralOperation.bind(this);
            });

            this.deleteBtns = document.querySelectorAll('.deleteGeneralOperation');
            this.deleteBtns.forEach(button => {
                button.onclick = this.getIdClickElement.bind(this);
            });
        } else if (this.pagePath === '/') {
            Main.paintDiagramms(result);
        }
    }

    async getGeneralsOperationsFromBackend() {
        const accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        if (!accessToken) {
            return null;
        }

        const result = await Response.getElementsFromBackend('GET', url.urlGenerals + this.period, accessToken);
        if (!Array.isArray(result)) {
            console.error('Некорректный ответ операций:', result);
            this.result = [];
            ErrorUtils.show(result, this.errorElement, 'загрузить операции');
            return null;
        }

        this.result = result;
        if (this.errorElement) this.errorElement.innerText = '';
        return result;
    }

    createTableWithOperations(result = this.result) {
        if (!this.wrapperTable || !this.isCurrentPage()) {
            return;
        }

        this.wrapperTable.querySelector('table')?.remove();

        const table = document.createElement('table');
        table.classList.add('table', 'mt-4', 'w-9');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['№ операции', 'Тип', 'Категория', 'Сумма', 'Дата', 'Комментарий', ''].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        const tbody = document.createElement('tbody');
        const data = [...result].sort((a, b) => Number(a.id) - Number(b.id));

        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.classList.add('table-row');
            row.id = String(item.id);

            const idCell = document.createElement('th');
            idCell.classList.add('table-row-number');
            idCell.scope = 'row';
            idCell.textContent = String(index + 1);
            row.appendChild(idCell);

            const typeCell = document.createElement('td');
            typeCell.classList.add('table-row-type');
            const type = item.type === 'income' ? 'доход' : 'расход';
            typeCell.textContent = type;
            typeCell.classList.add(type === 'доход' ? 'text-success' : 'text-danger');
            row.appendChild(typeCell);

            ['category', 'amount', 'date', 'comment'].forEach((key, valueIndex) => {
                const cell = document.createElement('td');
                cell.classList.add(
                    ['table-row-category', 'table-row-amount', 'table-row-date', 'table-row-comment'][valueIndex]
                );
                cell.textContent = item[key] === undefined || item[key] === null || item[key] === ''
                    ? (key === 'category' ? 'без категории' : '')
                    : String(item[key]);
                row.appendChild(cell);
            });

            const actionsCell = document.createElement('td');

            const deleteLink = document.createElement('a');
            deleteLink.href = '/generals/popup';
            deleteLink.classList.add('me-2', 'deleteGeneralOperation');
            deleteLink.setAttribute('aria-label', 'Удалить операцию');
            deleteLink.innerHTML = '<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6V12M7 6V12M10 6V12M1 3H13M5 3V2H9V3M2 3L3 14H11L12 3" stroke="black" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            actionsCell.appendChild(deleteLink);

            const editLink = document.createElement('a');
            editLink.href = '/generals/edit';
            editLink.classList.add('editGeneralOperation');
            editLink.setAttribute('aria-label', 'Редактировать операцию');
            editLink.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 1.5L14.5 4.5M10 3L13 6M2 14L3 10L11 2L14 5L6 13L2 14Z" stroke="black" stroke-linejoin="round" stroke-linecap="round"/></svg>';
            actionsCell.appendChild(editLink);

            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });

        table.append(thead, tbody);
        this.wrapperTable.appendChild(table);

        if (this.pagePath === '/generals') {
            this.editBtns = document.querySelectorAll('.editGeneralOperation');
            this.editBtns.forEach(button => {
                button.onclick = this.editGeneralOperation.bind(this);
            });

            this.deleteBtns = document.querySelectorAll('.deleteGeneralOperation');
            this.deleteBtns.forEach(button => {
                button.onclick = this.getIdClickElement.bind(this);
            });
        }
    }

    editGeneralOperation(event) {
        const row = event.currentTarget.closest('.table-row');
        if (!row || !this.isCurrentPage()) return;

        const rowData = {
            type: row.querySelector('.table-row-type')?.innerText || '',
            category: row.querySelector('.table-row-category')?.innerText || '',
            amount: row.querySelector('.table-row-amount')?.innerText || '',
            date: row.querySelector('.table-row-date')?.innerText || '',
            comment: row.querySelector('.table-row-comment')?.innerText || '',
        };

        AuthTokens.setToken('rowData', JSON.stringify(rowData));
        AuthTokens.setToken('idRowGenerals', row.id);
    }

    getIdClickElement(event) {
        const row = event.currentTarget.closest('.table-row');
        if (row && this.isCurrentPage()) {
            AuthTokens.setToken('idRowGenerals', row.id);
        }
    }

    resize() {
        if (window.innerWidth < 1550 && window.innerWidth > 900 && this.isCurrentPage() && Array.isArray(this.result)) {
            Main.paintDiagramms(this.result);
        }
    }
}
