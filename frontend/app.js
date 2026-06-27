import {Router} from "./src/router.js";

class App {
    constructor() {
        new Router();
    }
}

(new App());

const ctx = document.getElementById('myChart');

// круги на воде
new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', ''],
        datasets: [{
            data: [12, 19, 3, 5, 2, 0],
            backgroundColor: [
                'rgb(218,53,68)',
                'rgb(251,125,20)',
                'rgb(253,191,7)',
                'rgb(32,199,150)',
                'rgb(13,109,251)',
                'rgba(13,109,251, 0)',
            ]
        }]
    },
});


const ctx2 = document.getElementById('myChart2');

new Chart(ctx2, {
    type: 'pie',
    data: {
        labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', ''],
        datasets: [{
            data: [12, 19, 3, 5, 2, 0],
            backgroundColor: [
                'rgb(218,53,68)',
                'rgb(251,125,20)',
                'rgb(253,191,7)',
                'rgb(32,199,150)',
                'rgb(13,109,251)',
                'rgba(13,109,251, 0)',
            ]
        }]
    },
});