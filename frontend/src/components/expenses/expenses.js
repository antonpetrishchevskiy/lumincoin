import {CreateCart} from "../categories/createCarts.js";

export class Expenses {
    constructor() {
        this.incomeElements = document.querySelector('.income-elements');
        new CreateCart('/categories/expense', '/expenses/edit', '/expenses/popup', '/expenses/create', this.incomeElements);
    }
}