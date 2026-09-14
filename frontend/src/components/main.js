import {Period} from "./utils/period.js";
import Chart from 'chart.js/auto';

export class Main {
    constructor() {
        new Period();
    }

    static getCategoryColor(category, palette) {
        const normalizedCategory = String(category ?? 'без категории');
        let hash = 0;

        for (let index = 0; index < normalizedCategory.length; index += 1) {
            hash = (hash * 31 + normalizedCategory.charCodeAt(index)) >>> 0;
        }

        return palette[hash % palette.length];
    }

    static paintDiagramms(result) {
        if (!Array.isArray(result)) {
            return;
        }

        this.canvas1 = document.getElementById('myChart');
        this.canvas2 = document.getElementById('myChart2');

        if (!this.canvas1 || !this.canvas2) {
            return;
        }

        this.chartExpenses?.destroy();
        this.chartIncomes?.destroy();

        const incomeMap = new Map();
        const expenseMap = new Map();

        result.forEach(item => {
            if (item?.type !== 'income' && item?.type !== 'expense') {
                return;
            }

            const category = item.category ?? 'без категории';
            const amount = Number(item.amount);
            if (!Number.isFinite(amount)) {
                return;
            }

            const targetMap = item.type === 'income' ? incomeMap : expenseMap;
            targetMap.set(category, (targetMap.get(category) || 0) + amount);
        });

        const categoryIncomes = [...incomeMap.keys()];
        const amountIncomes = [...incomeMap.values()];
        const categoryExpenses = [...expenseMap.keys()];
        const amountExpenses = [...expenseMap.values()];

        const incomePalette = [
            '#198754',
            '#20c997',
            '#0d6efd',
            '#6f42c1',
            '#0dcaf0',
        ];
        const expensePalette = [
            '#dc3545',
            '#fd7e14',
            '#ffc107',
            '#d63384',
            '#bb2d3b',
        ];

        const incomeColors = categoryIncomes.map(category =>
            this.getCategoryColor(category, incomePalette)
        );
        const expenseColors = categoryExpenses.map(category =>
            this.getCategoryColor(category, expensePalette)
        );

        this.chartIncomes = new Chart(this.canvas1, {
            type: 'pie',
            data: {
                labels: categoryIncomes,
                datasets: [{
                    data: amountIncomes,
                    backgroundColor: incomeColors,
                }],
            },
        });

        this.chartExpenses = new Chart(this.canvas2, {
            type: 'pie',
            data: {
                labels: categoryExpenses,
                datasets: [{
                    data: amountExpenses,
                    backgroundColor: expenseColors,
                }],
            },
        });
    }
}
