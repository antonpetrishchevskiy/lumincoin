import flatpickr from "flatpickr";
import {Russian} from "flatpickr/dist/l10n/ru";
import {GetDataUtils} from "./getData-utils";
import {Generals} from "../generals/generals";

export class Period {
    constructor() {
        this.perionBtns = document.querySelectorAll('.btn-period');
        this.activeButton = null;
        this.today = new Date();
        this.perionBtns.forEach(button => {
            button.onclick = this.clickPeriodButton.bind(this);
        })
        this.dataInputFrom = document.getElementById('dataInputFrom');
        this.dataInputTo = document.getElementById('dataInputTo');
        this.dataInputFromValue = this.dataInputFrom.value;
        this.dataInputToValue = this.dataInputTo.value;
    }

    clickPeriodButton(event) {
        this.perionBtns.forEach(button => {
            if (event.target.textContent === button.textContent) {
                button.setAttribute('disabled', 'disabled');
                this.activeButton = button;
                this.createUrlPeriod();
            } else {
                button.removeAttribute('disabled');
            }
        })
    }

    createUrlPeriod() {
        this.dataInputFrom.classList.add('inactive');
        this.dataInputTo.classList.add('inactive');
        const today = GetDataUtils.getData(this.today);

        if(this.activeButton.innerText === 'Сегодня') {
            this.period = `?period=${today}`;
        }
        else if(this.activeButton.innerText === 'Неделя') {
            const dayOfWeek = this.today.getDay();
            let monday = new Date(this.today);
            monday.setDate(this.today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
            monday = GetDataUtils.getData(monday);
            this.period = `?period=interval&dateFrom=${monday}&dateTo=${today}`;
        }
        else if (this.activeButton.innerText === 'Месяц') {
            const month =  GetDataUtils.getData(new Date(this.today.setDate('1')));
            this.period = `?period=interval&dateFrom=${month}&dateTo=${today}`;
        }
        else if (this.activeButton.innerText === 'Год') {
            const year =  GetDataUtils.getData(new Date(this.today.setMonth('0', 1)));
            this.period = `?period=interval&dateFrom=${year}&dateTo=${today}`;
        }
        else if (this.activeButton.innerText === 'Все') {
            this.period = `?period=all`;
        }
        else if (this.activeButton.innerText === 'Интервал') {
            this.dataInputFrom.classList.remove('inactive');
            this.dataInputTo.classList.remove('inactive');
            flatpickr("#dataInputFrom", {
                dateFormat: "Y-m-d",
                locale: Russian,
            });
            flatpickr("#dataInputTo", {
                dateFormat: "Y-m-d",
                locale: Russian,
            });

            this.dataInputFrom.addEventListener('change', this.changeData.bind(this));
            this.dataInputTo.addEventListener('change', this.changeData.bind(this));
        }

        if(this.activeButton.innerText !== 'Интервал') {
            new Generals(this.period);
        }
    }

    changeData(event) {
        if (event.target.id === 'dataInputFrom') {
            this.dataInputFromValue = event.target.value;
        } else {
            this.dataInputToValue = event.target.value;
        }

        if(this.dataInputFromValue !== '' && this.dataInputToValue !== '') {
            this.period  = `?period=interval&dateFrom=${this.dataInputFromValue}&dateTo=${this.dataInputToValue}`;
            new Generals(this.period);
        }
    }
}