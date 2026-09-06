import {Period} from "./utils/period.js";
import Chart from 'chart.js/auto';

export class Main {
    constructor() {
        // this.canvas1 = null;
        // this.chartExpenses = null;
        // this.chartIncomes = null;
        new Period();
    }

    static paintDiagramms(result) {
        this.result = result;
        this.canvas1 = document.getElementById('myChart');
        this.canvas2 = document.getElementById('myChart2');

        if (this.chartExpenses) {
            this.chartExpenses.destroy();
        }

        if (this.chartIncomes) {
            this.chartIncomes.destroy();
        }

        this.mapIncomes = new Map();
        this.mapExpenses = new Map();
        this.categoryIncomes = [];
        this.amountIncomes = [];
        this.categoryExpenses = [];
        this.amounExpenses = [];

        this.result.forEach(item => {
            if (item.type === 'income') {
                let i = 0;
                if(!this.categoryIncomes.includes(item.category) && item.category !== undefined) {
                    this.categoryIncomes.push(item.category);
                    this.mapIncomes.set(item.category, item.amount);
                }  else if(!this.categoryIncomes.includes('без категории') && item.category === undefined) {
                    this.categoryIncomes.push('без категории');
                    this.mapIncomes.set('без категории', item.amount);
                } else if (this.categoryIncomes.includes('без категории') && item.category === undefined) {
                    this.mapIncomes.set('без категории', +this.mapIncomes.get('без категории') + item.amount);
                } else {
                    this.mapIncomes.set(item.category, +this.mapIncomes.get(item.category) + item.amount);
                }
            } else if (item.type === 'expense') {
                let i = 0;
                if(!this.categoryExpenses.includes(item.category) && item.category !== undefined) {
                    this.categoryExpenses.push(item.category);
                    this.mapExpenses.set(item.category, item.amount);
                }  else if(!this.categoryExpenses.includes('без категории') && item.category === undefined) {
                    this.categoryExpenses.push('без категории');
                    this.mapExpenses.set('без категории', item.amount);
                } else if (this.categoryExpenses.includes('без категории') && item.category === undefined) {
                    this.mapExpenses.set('без категории', +this.mapExpenses.get('без категории') + item.amount);
                } else {
                    this.mapExpenses.set(item.category, +this.mapExpenses.get(item.category) + item.amount);
                }
            }
        })

        this.categoryIncomes.forEach(item => {
            this.amountIncomes.push(this.mapIncomes.get(item));
        })

        this.categoryExpenses.forEach(item => {
            this.amounExpenses.push(this.mapExpenses.get(item));
        })


        this.chartIncomes = new Chart(this.canvas1, {
            type: 'pie',
            data: {
                labels: this.categoryIncomes,
                datasets: [{
                    data: this.amountIncomes,
                    backgroundColor: [
                        'rgb(218,53,68)',
                        'rgb(251,125,20)',
                        'rgb(253,191,7)',
                        'rgb(32,199,150)',
                        'rgb(13,109,251)',
                        'rgb(113,9,151)',
                        'rgb(18,213,218)',
                        'rgb(201,205,100)',
                        'rgb(253,1,127)',
                        'rgb(132,9,250)',
                        'rgb(13,29,251)',
                        'rgb(118,13,18)',
                        'rgb(151,25,20)',
                        'rgb(193,91,17)',
                        'rgb(102,99,50)',
                    ]
                }]
            },
        });


        this.chartExpenses = new Chart(this.canvas2, {
            type: 'pie',
            data: {
                labels: this.categoryExpenses,
                datasets: [{
                    data: this.amounExpenses,
                    backgroundColor: [
                        'rgb(218,53,68)',
                        'rgb(251,125,20)',
                        'rgb(253,191,7)',
                        'rgb(32,199,150)',
                        'rgb(13,109,251)',
                        'rgb(113,9,151)',
                        'rgb(18,213,218)',
                        'rgb(201,205,100)',
                        'rgb(253,1,127)',
                        'rgb(132,9,250)',
                        'rgb(13,29,251)',
                        'rgb(118,13,18)',
                        'rgb(151,25,20)',
                        'rgb(193,91,17)',
                        'rgb(102,99,50)',
                    ]
                }]
            },
        });
    }
}