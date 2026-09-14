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
        this.navigationId = 0;
        this.handleDocumentClick = this.openNewRouteToClick.bind(this);
        this.handlePopState = this.activateRoute.bind(this);

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                load: () => new Generals(),
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                load: () => new Login(this.openNewRouteAutomatic.bind(this)),
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                load: () => new SignUp(this.openNewRouteAutomatic.bind(this)),
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
                load: () => new Expenses(),
            },
            {
                route: '/expenses/create',
                title: 'Создание',
                filePathTemplate: '/templates/pages/expenses/create.html',
                useLayout: '/templates/layout.html',
                load: () => new AddCart(this.openNewRouteAutomatic.bind(this), url.changeExpenses, '/expenses'),
            },
            {
                route: '/expenses/edit',
                title: 'Редактирование',
                filePathTemplate: '/templates/pages/expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: () => new EditCarts(this.openNewRouteAutomatic.bind(this), url.changeExpenses, '/expenses'),
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
                load: () => new Generals(),
            },
            {
                route: '/generals/create',
                title: 'Создание',
                filePathTemplate: '/templates/pages/generals/create.html',
                useLayout: '/templates/layout.html',
                load: () => new CreateGeneralOperation(this.openNewRouteAutomatic.bind(this), url.urlGenerals, '/generals'),
            },
            {
                route: '/generals/edit',
                title: 'Редактирование',
                filePathTemplate: '/templates/pages/generals/edit.html',
                useLayout: '/templates/layout.html',
                load: () => new EditGeneralOperation(this.openNewRouteAutomatic.bind(this), url.urlGenerals + '/', '/generals'),
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
                load: () => new Incomes(),
            },
            {
                route: '/incomes/create',
                title: 'Создание',
                filePathTemplate: '/templates/pages/incomes/create.html',
                useLayout: '/templates/layout.html',
                load: () => new AddCart(this.openNewRouteAutomatic.bind(this), url.changeIncomes, '/incomes'),
            },
            {
                route: '/incomes/edit',
                title: 'Редактирование',
                filePathTemplate: '/templates/pages/incomes/edit.html',
                useLayout: '/templates/layout.html',
                load: () => new EditCarts(this.openNewRouteAutomatic.bind(this), url.changeIncomes, '/incomes'),
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
        ];

        new AuthTokens(this.openNewRouteAutomatic.bind(this));
        this.initEvents();
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.handlePopState, {once: true});
        window.addEventListener('popstate', this.handlePopState);
        document.addEventListener('click', this.handleDocumentClick);

        if (document.readyState !== 'loading') {
            this.activateRoute().catch(error => console.error('Ошибка инициализации маршрута:', error));
        }
    }

    async openNewRouteAutomatic(nextUrl) {
        if (typeof nextUrl !== 'string' || !nextUrl.startsWith('/')) {
            console.error('Некорректный внутренний маршрут:', nextUrl);
            return;
        }

        if (window.location.pathname + window.location.search !== nextUrl) {
            history.pushState(null, '', nextUrl);
        }
        await this.activateRoute();
    }

    async openNewRouteToClick(event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        const element = event.target.closest?.('a');
        if (!element || element.target === '_blank' || element.hasAttribute('download')) {
            return;
        }

        const href = element.getAttribute('href');
        if (!href || href === '#' || href.startsWith('javascript:')) {
            return;
        }

        let targetUrl;
        try {
            targetUrl = new URL(element.href, window.location.origin);
        } catch (error) {
            return;
        }

        if (targetUrl.origin !== window.location.origin) {
            return;
        }

        event.preventDefault();
        await this.openNewRouteAutomatic(targetUrl.pathname + targetUrl.search);
    }

    async loadTemplate(path) {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Не удалось загрузить шаблон ${path}: HTTP ${response.status}`);
        }
        return response.text();
    }

    async activateRoute() {
        const currentNavigationId = ++this.navigationId;
        window.onresize = null;

        const isAuthenticated = Boolean(AuthTokens.getToken(AuthTokens.accessTokenKey));
        let urlRoute = window.location.pathname;

        if (isAuthenticated && (urlRoute === '/login' || urlRoute === '/sign-up')) {
            history.replaceState(null, '', '/');
            urlRoute = '/';
        }

        if (!isAuthenticated && !['/login', '/sign-up', '/404'].includes(urlRoute)) {
            history.replaceState(null, '', '/login');
            urlRoute = '/login';
        }

        let newRoute = this.routes.find(route => route.route === urlRoute);
        if (!newRoute) {
            history.replaceState(null, '', '/404');
            newRoute = this.routes.find(route => route.route === '/404');
        }

        if (!newRoute || !this.contentElement) {
            throw new Error('Маршрут или контейнер страницы не найден');
        }

        if (this.titlePageElement && newRoute.title) {
            this.titlePageElement.innerText = `${newRoute.title} | Lumincoin Finance`;
        }

        try {
            let content = '';
            if (newRoute.useLayout) {
                content = await this.loadTemplate(newRoute.useLayout);
                if (currentNavigationId !== this.navigationId) return;

                this.contentElement.innerHTML = content;

                const userInfoRaw = AuthTokens.getToken(AuthTokens.userInfoTokenKey);
                if (!userInfoRaw) {
                    await AuthTokens.handleSessionExpired();
                    return;
                }

                let userInfo;
                try {
                    userInfo = JSON.parse(userInfoRaw);
                } catch (error) {
                    await AuthTokens.handleSessionExpired();
                    return;
                }

                const userNameElement = document.getElementById('layoutUserName');
                if (userNameElement) {
                    userNameElement.innerText = `${userInfo?.name ?? ''} ${userInfo?.lastName ?? ''}`.trim();
                }

                const result = await Response.getElementsFromBackend(
                    'GET',
                    '/balance',
                    AuthTokens.getToken(AuthTokens.accessTokenKey)
                );

                if (currentNavigationId !== this.navigationId) return;

                const balanceElement = document.getElementById('userBalance');
                if (balanceElement) {
                    balanceElement.innerText = !result?.error && result?.balance !== undefined && result?.balance !== null
                        ? `${result.balance} $`
                        : '0 $';
                }
            } else {
                this.contentElement.innerHTML = '';
            }

            if (newRoute.filePathTemplate) {
                this.contentElement.innerHTML += await this.loadTemplate(newRoute.filePathTemplate);
            }

            if (newRoute.usePopup) {
                this.contentElement.innerHTML += await this.loadTemplate(newRoute.usePopup);
            }

            if (currentNavigationId !== this.navigationId) return;

            if (newRoute.load && typeof newRoute.load === 'function') {
                await newRoute.load();
            }

            if (newRoute.useLayout && currentNavigationId === this.navigationId) {
                new Logout(this.openNewRouteAutomatic.bind(this));
                new Layout();
            }
        } catch (error) {
            console.error(`Ошибка загрузки маршрута ${urlRoute}:`, error);
            if (currentNavigationId === this.navigationId && urlRoute !== '/404') {
                history.replaceState(null, '', '/404');
                await this.activateRoute();
            }
        }
    }
}
