import {CreateCart} from "../categories/createCarts.js";

export class Incomes {
    constructor() {
        this.incomeElements = document.querySelector('.income-elements');
        new CreateCart('/categories/income','/incomes/edit', '/incomes/popup', '/incomes/create', this.incomeElements);
    }
}