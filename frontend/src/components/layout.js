export class Layout {
    constructor() {
        this.burger = document.getElementById('burger');
        this.slider = document.getElementById('slider');
        this.layoutLinks = document.getElementById('layoutLinks');

        if (this.layoutLinks) {
            this.layoutLinks.querySelectorAll('a').forEach(link => {
                if (link.pathname !== location.pathname) {
                    return;
                }

                if (location.pathname === '/incomes' || location.pathname === '/expenses') {
                    link.closest('details')?.classList.add('checked');
                    link.closest('li')?.classList.add('checked-category');
                } else {
                    link.closest('li')?.classList.add('checked');
                }
            });
        }

        if (this.burger && this.slider) {
            this.burger.onclick = this.clickBurger.bind(this);
        }
    }

    clickBurger() {
        if (!this.slider) return;
        this.slider.classList.toggle('close');
    }
}
