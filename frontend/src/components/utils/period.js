import flatpickr from "flatpickr";
import {Russian} from "flatpickr/dist/l10n/ru";
import {GetDataUtils} from "./getData-utils.js";
import {Generals} from "../generals/generals.js";

export class Period {
    constructor() {
        this.periodButtons = document.querySelectorAll('.btn-period');
        this.activeButton = null;
        this.today = new Date();
        this.dataInputFrom = document.getElementById('dataInputFrom');
        this.dataInputTo = document.getElementById('dataInputTo');
        this.dataInputFromValue = this.dataInputFrom?.value || '';
        this.dataInputToValue = this.dataInputTo?.value || '';

        this.periodButtons.forEach(button => {
            button.onclick = this.clickPeriodButton.bind(this);
        });
    }

    clickPeriodButton(event) {
        const button = event.currentTarget;
        this.periodButtons.forEach(item => {
            const isActive = item === button;
            item.toggleAttribute('disabled', isActive);
        });

        this.activeButton = button;
        this.createUrlPeriod();
    }

    createUrlPeriod() {
        if (!this.activeButton) {
            return;
        }

        this.dataInputFrom?.classList.add('inactive');
        this.dataInputTo?.classList.add('inactive');
        const today = GetDataUtils.getData(this.today);
        const buttonText = this.activeButton.innerText.trim();

        if (buttonText === 'Сегодня') {
            this.period = `?period=${today}`;
        } else if (buttonText === 'Неделя') {
            const mondayDate = new Date(this.today);
            const dayOfWeek = mondayDate.getDay();
            mondayDate.setDate(mondayDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
            this.period = `?period=interval&dateFrom=${GetDataUtils.getData(mondayDate)}&dateTo=${today}`;
        } else if (buttonText === 'Месяц') {
            const monthStart = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
            this.period = `?period=interval&dateFrom=${GetDataUtils.getData(monthStart)}&dateTo=${today}`;
        } else if (buttonText === 'Год') {
            const yearStart = new Date(this.today.getFullYear(), 0, 1);
            this.period = `?period=interval&dateFrom=${GetDataUtils.getData(yearStart)}&dateTo=${today}`;
        } else if (buttonText === 'Все') {
            this.period = '?period=all';
        } else if (buttonText === 'Интервал') {
            this.enableCustomRange();
            return;
        }

        new Generals(this.period);
    }

    enableCustomRange() {
        if (!this.dataInputFrom || !this.dataInputTo) {
            return;
        }

        this.dataInputFrom.classList.remove('inactive');
        this.dataInputTo.classList.remove('inactive');

        if (this.dataInputFrom._flatpickr) {
            this.dataInputFrom._flatpickr.destroy();
        }
        if (this.dataInputTo._flatpickr) {
            this.dataInputTo._flatpickr.destroy();
        }

        flatpickr(this.dataInputFrom, {
            dateFormat: 'Y-m-d',
            locale: Russian,
        });
        flatpickr(this.dataInputTo, {
            dateFormat: 'Y-m-d',
            locale: Russian,
        });

        this.dataInputFrom.onchange = this.changeData.bind(this);
        this.dataInputTo.onchange = this.changeData.bind(this);
    }

    changeData(event) {
        if (event.target === this.dataInputFrom) {
            this.dataInputFromValue = event.target.value;
        } else if (event.target === this.dataInputTo) {
            this.dataInputToValue = event.target.value;
        }

        if (this.dataInputFromValue && this.dataInputToValue) {
            this.period = `?period=interval&dateFrom=${this.dataInputFromValue}&dateTo=${this.dataInputToValue}`;
            new Generals(this.period);
        }
    }
}
