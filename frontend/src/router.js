import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {AuthTokens} from "./components/utils/auth-utils.js";
import {Logout} from "./components/auth/logout.js";
import {Expenses} from "./components/expenses/expenses.js";
import {Incomes} from "./components/incomes/incomes.js";
import {EditCarts} from "./components/categories/editCarts.js";
import {url} from "./config/config.js";
import {AddCart} from "./components/categories/addCarts.js";
import {DeleteCart} from "./components/categories/deleteCarts.js";
import {Response} from "./components/utils/response-utils.js";
import {Generals} from "./components/generals/generals.js";
import {EditGeneralOperation} from "./components/generals/editGeneralOperation.js";
import {CreateGeneralOperation} from "./components/generals/createGeneralOperation.js";
import {DeleteGeneralElement} from "./components/generals/deleteGeneralElement.js";
import {Layout} from "./components/layout.js";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('page-title');
        this.contentElement = document.getElementById('content');
        this.initEvents();
        new AuthTokens(this.openNewRouteAutomatic.bind(this));

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Generals()
                    // new Main();
                },
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                load: () => {
                    new Login(this.openNewRouteAutomatic.bind(this));
                },
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                load: () => {
                    new SignUp(this.openNewRouteAutomatic.bind(this));
                },
            },
            {
                route: '/404',
                title: 'Ошибка',
                filePathTemplate: '/templates/pages/404.html',
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expenses/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expenses();
                },
            },
            {
                route: '/expenses/create',
                title: 'Создание',
                filePathTemplate: '/templates/pages/expenses/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new AddCart(this.openNewRouteAutomatic.bind(this), url.changeExpenses, '/expenses');
                },
            },
            {
                route: '/expenses/edit',
                title: 'Редактирование',
                filePathTemplate: '/templates/pages/expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditCarts(this.openNewRouteAutomatic.bind(this), url.changeExpenses, '/expenses');
                },
            },
            {
                route: '/expenses/popup',
                title: 'Попап',
                filePathTemplate: '/templates/pages/expenses/main.html',
                useLayout: '/templates/layout.html',
                usePopup: '/templates/pages/expenses/popup.html',
                load: () => {
                    new Expenses();
                    new DeleteCart(this.openNewRouteAutomatic.bind(this), url.changeExpenses, '/expenses');
                },
            },
            {
                route: '/generals',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/generals/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Generals();
                },
            },
            {
                route: '/generals/create',
                title: 'Создание',
                filePathTemplate: '/templates/pages/generals/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateGeneralOperation(this.openNewRouteAutomatic.bind(this), url.urlGenerals, '/generals');
                },
            },
            {
                route: '/generals/edit',
                title: 'Редактирование',
                filePathTemplate: '/templates/pages/generals/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditGeneralOperation(this.openNewRouteAutomatic.bind(this), url.urlGenerals + '/', '/generals');
                },
            },
            {
                route: '/generals/popup',
                title: 'Попап',
                filePathTemplate: '/templates/pages/generals/main.html',
                useLayout: '/templates/layout.html',
                usePopup: '/templates/pages/generals/popup.html',
                load: () => {
                    new Generals();
                    new DeleteGeneralElement(this.openNewRouteAutomatic.bind(this), url.urlGenerals + '/', '/generals');
                },
            },
            {
                route: '/incomes',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/incomes/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Incomes();
                },
            },
            {
                route: '/incomes/create',
                title: 'Создание',
                filePathTemplate: '/templates/pages/incomes/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new AddCart(this.openNewRouteAutomatic.bind(this), url.changeIncomes, '/incomes');
                },
            },
            {
                route: '/incomes/edit',
                title: 'Редактирование',
                filePathTemplate: '/templates/pages/incomes/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditCarts(this.openNewRouteAutomatic.bind(this), url.changeIncomes, '/incomes');
                },
            },
            {
                route: '/incomes/popup',
                title: 'Попап',
                filePathTemplate: '/templates/pages/incomes/main.html',
                useLayout: '/templates/layout.html',
                usePopup: '/templates/pages/incomes/popup.html',
                load: () => {
                    new Incomes();
                    new DeleteCart(this.openNewRouteAutomatic.bind(this), url.changeIncomes, '/incomes');
                },
            },
        ]
    }

    initEvents() {
        window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
        window.addEventListener("popstate", this.activateRoute.bind(this));
        document.addEventListener('click', this.openNewRouteToClick.bind(this));
        this.refreshTokenAutomatic();
    }

    async openNewRouteAutomatic(url) {
        history.pushState(null, '', url);
        await this.activateRoute().then();
    }

    async openNewRouteToClick(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();
            const url = element.href.replace(window.location.origin, '');
            if (!element.href || element.href === '#' || element.href === 'javascript:void(0)') {
                return;
            }
            await this.openNewRouteAutomatic(url);
        }
    }

    async activateRoute() {
        const urlRoute = window.location.pathname;
        let newRoute = null;
        if (localStorage.getItem("accessToken")) {
            this.refreshTokenAutomatic();
            newRoute = this.routes.find((route) => route.route === urlRoute);
        } else {
            newRoute = this.routes.find((route) => route.route === '/login');
            if (urlRoute === '/sign-up') {
                newRoute = this.routes.find((route) => route.route === '/sign-up');
            }
            if (urlRoute === '/login') {
                newRoute = this.routes.find((route) => route.route === '/login');
            }
        }

        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.useLayout) {
                this.contentElement.innerHTML = await fetch(newRoute.useLayout).then(res => res.text());
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                document.getElementById('layoutUserName').innerText = userInfo.name + ' ' + userInfo.lastName;

                try {
                    const result = await Response.getElementsFromBackend('GET', '/balance', AuthTokens.getToken(AuthTokens.accessTokenKey));

                    if(!result.error) {
                        console.log('Ошибка получения баланса!!!!!');
                    }

                    if (result && result.balance !== 'undefined') {
                        document.getElementById('userBalance').innerText = result.balance + ' $';
                    } else {
                        document.getElementById('userBalance').innerText = '0 $';
                    }
                } catch (error) {
                    console.error("Ошибка при получении баланса:", error);
                    document.getElementById('userBalance').innerText = 'Ошибка загрузки';
                }
            } else {
                this.contentElement.innerHTML = '';
            }

            if (newRoute.filePathTemplate) {
                this.contentElement.innerHTML += await fetch(newRoute.filePathTemplate).then(res => res.text());
            }

            if (newRoute.usePopup) {
                this.contentElement.innerHTML += await fetch(newRoute.usePopup).then(res => res.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

            if (newRoute.useLayout) {
                new Logout(this.openNewRouteAutomatic.bind(this));
                new Layout();
            }

        } else {
            window.location = '/404';
        }
    }

    refreshTokenAutomatic() {
        setInterval(() => {
            AuthTokens.refreshToken().then();
        }, 250000)
    }
}