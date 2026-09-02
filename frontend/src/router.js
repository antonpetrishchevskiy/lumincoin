import {Main} from "./components/main.js";
import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {AuthTokens} from "./utils/auth-utils.js";
import {Logout} from "./components/auth/logout.js";
import {Layout} from "./components/layout.js";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('page-title');
        this.contentElement = document.getElementById('content');
        this.initEvents();

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main();
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
                },
            },
            {
                route: '/expenses/create',
                title: 'Создание',
                filePathTemplate: '/templates/pages/expenses/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                },
            },
            {
                route: '/expenses/edit',
                title: 'Редактирование',
                filePathTemplate: '/templates/pages/expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                },
            },
            {
                route: '/expenses/popup',
                title: 'Попап',
                filePathTemplate: '/templates/pages/expenses/main.html',
                useLayout: '/templates/layout.html',
                usePopup: '/templates/pages/expenses/popup.html',
                load: () => {
                },
            },
            {
                route: '/generals',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/generals/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                },
            },
            {
                route: '/generals/create',
                title: 'Создание',
                filePathTemplate: '/templates/pages/generals/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                },
            },
            {
                route: '/generals/edit',
                title: 'Редактирование',
                filePathTemplate: '/templates/pages/generals/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                },
            },
            {
                route: '/generals/popup',
                title: 'Попап',
                filePathTemplate: '/templates/pages/generals/main.html',
                useLayout: '/templates/layout.html',
                usePopup: '/templates/pages/generals/popup.html',
                load: () => {
                },
            },
            {
                route: '/incomes',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/incomes/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                },
            },
            {
                route: '/incomes/create',
                title: 'Создание',
                filePathTemplate: '/templates/pages/incomes/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                },
            },
            {
                route: '/incomes/edit',
                title: 'Редактирование',
                filePathTemplate: '/templates/pages/incomes/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                },
            },
            {
                route: '/incomes/popup',
                title: 'Попап',
                filePathTemplate: '/templates/pages/incomes/main.html',
                useLayout: '/templates/layout.html',
                usePopup: '/templates/pages/incomes/popup.html',
                load: () => {
                },
            },
        ];
    }

    initEvents() {
        window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
        window.addEventListener("popstate", this.activateRoute.bind(this));
        document.addEventListener('click', this.openNewRouteToClick.bind(this));
    }

    async openNewRouteAutomatic(url) {
        history.pushState(null, '', url);
        await this.activateRoute();
    }

    async openNewRouteToClick(e) {
        let element = null;

        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode?.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (!element) {
            return;
        }

        if (!element.href || element.getAttribute('href') === '#' || element.getAttribute('href') === 'javascript:void(0)') {
            return;
        }

        e.preventDefault();
        const url = element.href.replace(window.location.origin, '');
        await this.openNewRouteAutomatic(url);
    }

    async loadTemplate(path) {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Не удалось загрузить шаблон: ${path}`);
        }

        return response.text();
    }

    setUserName() {
        const userNameElement = document.getElementById('layoutUserName');
        const userInfoRaw = AuthTokens.getToken(AuthTokens.userInfoTokenKey);

        if (!userNameElement || !userInfoRaw) {
            return;
        }

        try {
            const userInfo = JSON.parse(userInfoRaw);
            userNameElement.innerText = `${userInfo?.name || ''} ${userInfo?.lastName || ''}`.trim();
        } catch (error) {
            AuthTokens.clearTokens();
        }
    }

    async activateRoute() {
        const urlRoute = window.location.pathname;
        const isAuthenticated = !!AuthTokens.getToken(AuthTokens.accessTokenKey);
        let newRoute = this.routes.find(route => route.route === urlRoute);

        if (!isAuthenticated && newRoute?.useLayout) {
            history.replaceState(null, '', '/sign-up');
            newRoute = this.routes.find(route => route.route === '/sign-up');
        }

        if (!newRoute) {
            newRoute = this.routes.find(route => route.route === '/404');
        }

        if (!newRoute || !this.contentElement) {
            return;
        }

        if (newRoute.title && this.titlePageElement) {
            this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
        }

        try {
            if (newRoute.useLayout) {
                this.contentElement.innerHTML = await this.loadTemplate(newRoute.useLayout);
                this.setUserName();
            } else {
                this.contentElement.innerHTML = '';
            }

            if (newRoute.filePathTemplate) {
                this.contentElement.innerHTML += await this.loadTemplate(newRoute.filePathTemplate);
            }

            if (newRoute.usePopup) {
                this.contentElement.innerHTML += await this.loadTemplate(newRoute.usePopup);
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

            if (newRoute.useLayout) {
                new Logout(this.openNewRouteAutomatic.bind(this));
                new Layout();
            }
        } catch (error) {
            console.error('Route loading error:', error);
            this.contentElement.innerHTML = '<div class="p-5">Не удалось загрузить страницу.</div>';
        }
    }
}
