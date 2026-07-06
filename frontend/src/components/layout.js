export class Layout {
    constructor() {
        this.burger = document.getElementById("burger");
        this.slider = document.getElementById("slider");
        this.layoutLinks = document.getElementById('layoutLinks');
        this.elementsLi = this.layoutLinks.querySelectorAll('a');
        this.elementsLi.forEach(el => {
            if (el.pathname === location.pathname) {

                if (location.pathname === '/incomes' || location.pathname === '/expenses') {
                    el.closest('details').classList.add('checked');
                    el.closest('li').classList.add('checked-category');
                } else {
                    el.closest('li').classList.add('checked');
                }
            }
        })
        this.burger.onclick = this.clickBurger.bind(this);
    }

    clickBurger() {
        if (this.slider.classList.contains('close')) {
            this.slider.classList.remove('close');
        } else {
            this.slider.classList.add('close');
        }
    }
}