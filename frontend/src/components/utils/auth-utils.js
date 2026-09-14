import {Response} from "./response-utils.js";

export class AuthTokens {
    constructor(openNewRouteAutomatic) {
        AuthTokens.sessionExpiredHandler = openNewRouteAutomatic;
    }

    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';
    static rememberMeKey = 'rememberMe';
    static refreshLockKey = 'authRefreshLock';
    static refreshLockTimeout = 15000;
    static refreshLockRetryDelay = 150;
    static tabId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    static refreshPromise = null;
    static sessionExpiredPromise = null;
    static sessionExpiredHandler = null;

    static setToken(tokenName, tokenValue) {
        if (tokenValue === undefined || tokenValue === null) {
            localStorage.removeItem(tokenName);
            return;
        }
        localStorage.setItem(tokenName, String(tokenValue));
    }

    static getToken(tokenName) {
        return localStorage.getItem(tokenName);
    }

    static clearAuthTokens() {
        localStorage.removeItem(AuthTokens.accessTokenKey);
        localStorage.removeItem(AuthTokens.refreshTokenKey);
        localStorage.removeItem(AuthTokens.userInfoTokenKey);
        localStorage.removeItem(AuthTokens.rememberMeKey);
        AuthTokens.releaseRefreshLock();
    }

    static async handleSessionExpired() {
        if (AuthTokens.sessionExpiredPromise) {
            return AuthTokens.sessionExpiredPromise;
        }

        AuthTokens.sessionExpiredPromise = (async () => {
            AuthTokens.clearAuthTokens();
            if (AuthTokens.sessionExpiredHandler) {
                await AuthTokens.sessionExpiredHandler('/login');
            }
        })();

        try {
            await AuthTokens.sessionExpiredPromise;
        } finally {
            AuthTokens.sessionExpiredPromise = null;
        }
    }

    static async acquireRefreshLock(expectedRefreshToken) {
        while (true) {
            const currentRefreshToken = AuthTokens.getToken(AuthTokens.refreshTokenKey);
            if (!currentRefreshToken) {
                return false;
            }
            if (currentRefreshToken !== expectedRefreshToken) {
                return false;
            }

            const now = Date.now();
            const currentLock = AuthTokens.getToken(AuthTokens.refreshLockKey);
            let lock = null;

            if (currentLock) {
                try {
                    lock = JSON.parse(currentLock);
                } catch (error) {
                    lock = null;
                }
            }

            if (!lock || now - Number(lock.timestamp) >= AuthTokens.refreshLockTimeout) {
                const newLock = JSON.stringify({owner: AuthTokens.tabId, timestamp: now});
                AuthTokens.setToken(AuthTokens.refreshLockKey, newLock);

                if (AuthTokens.getToken(AuthTokens.refreshLockKey) === newLock
                    && AuthTokens.getToken(AuthTokens.refreshTokenKey) === expectedRefreshToken) {
                    return true;
                }
            }

            if (lock?.owner === AuthTokens.tabId) {
                return true;
            }

            await new Promise(resolve => setTimeout(
                resolve,
                AuthTokens.refreshLockRetryDelay + Math.random() * 100
            ));
        }
    }

    static releaseRefreshLock() {
        const currentLock = AuthTokens.getToken(AuthTokens.refreshLockKey);
        if (!currentLock) {
            return;
        }

        try {
            const lock = JSON.parse(currentLock);
            if (lock.owner === AuthTokens.tabId) {
                localStorage.removeItem(AuthTokens.refreshLockKey);
            }
        } catch (error) {
            localStorage.removeItem(AuthTokens.refreshLockKey);
        }
    }

    static async executeRefresh(refreshToken, rememberMe) {
        const result = await Response.getElementsFromBackend(
            'POST',
            '/refresh',
            null,
            {refreshToken, rememberMe}
        );

        if (result?.networkError || result?.status >= 500) {
            return null;
        }

        if (!result || result.error || !result.tokens?.accessToken || !result.tokens?.refreshToken) {
            await AuthTokens.handleSessionExpired();
            return null;
        }

        AuthTokens.setToken(AuthTokens.accessTokenKey, result.tokens.accessToken);
        AuthTokens.setToken(AuthTokens.refreshTokenKey, result.tokens.refreshToken);
        return result.tokens.accessToken;
    }

    static async getTokensAfterRegistration(email, password, rememberMe = false) {
        const result = await Response.getElementsFromBackend('POST', '/login', null, {
            email,
            password,
            rememberMe,
        });

        if (!result) {
            return {error: true, message: 'Пустой ответ сервера'};
        }

        if (result.error || !result.tokens?.accessToken || !result.tokens?.refreshToken || !result.user) {
            return result;
        }

        AuthTokens.setToken(AuthTokens.accessTokenKey, result.tokens.accessToken);
        AuthTokens.setToken(AuthTokens.refreshTokenKey, result.tokens.refreshToken);
        AuthTokens.setToken(AuthTokens.userInfoTokenKey, JSON.stringify(result.user));
        AuthTokens.setToken(AuthTokens.rememberMeKey, rememberMe);

        return result;
    }

    static async refreshToken() {
        if (AuthTokens.refreshPromise) {
            return AuthTokens.refreshPromise;
        }

        const refreshToken = AuthTokens.getToken(AuthTokens.refreshTokenKey);
        if (!refreshToken) {
            return null;
        }

        const rememberMe = AuthTokens.getToken(AuthTokens.rememberMeKey) === 'true';

        const performRefresh = async () => {
            if (navigator.locks?.request) {
                return navigator.locks.request(
                    'lumincoin-auth-refresh',
                    {mode: 'exclusive'},
                    async () => {
                        const currentRefreshToken = AuthTokens.getToken(AuthTokens.refreshTokenKey);
                        if (!currentRefreshToken) {
                            return null;
                        }
                        if (currentRefreshToken !== refreshToken) {
                            return AuthTokens.getToken(AuthTokens.accessTokenKey);
                        }
                        return AuthTokens.executeRefresh(currentRefreshToken, rememberMe);
                    }
                );
            }

            let lockAcquired = false;
            try {
                lockAcquired = await AuthTokens.acquireRefreshLock(refreshToken);
                if (!lockAcquired) {
                    return AuthTokens.getToken(AuthTokens.accessTokenKey);
                }

                const currentRefreshToken = AuthTokens.getToken(AuthTokens.refreshTokenKey);
                if (!currentRefreshToken) {
                    return null;
                }
                if (currentRefreshToken !== refreshToken) {
                    return AuthTokens.getToken(AuthTokens.accessTokenKey);
                }

                return await AuthTokens.executeRefresh(currentRefreshToken, rememberMe);
            } finally {
                if (lockAcquired) {
                    AuthTokens.releaseRefreshLock();
                }
            }
        };

        AuthTokens.refreshPromise = performRefresh().catch(error => {
            console.error('Ошибка обновления токена:', error);
            return null;
        });

        try {
            return await AuthTokens.refreshPromise;
        } finally {
            AuthTokens.refreshPromise = null;
        }
    }
}
