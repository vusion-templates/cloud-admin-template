import Vue from 'vue';
import auth from './index';
export const loginAuth = function (to, from, next, currentPath, authOptions) {
    return auth.getUserInfo().then(() => auth.getUserResources(authOptions.domainName).then(() => {
        if (auth.has(currentPath))
            next();
        else
            throw new Error('Unauthorized');
    }).catch((e) => {
        authOptions.tipMessage && Vue.prototype.$toast.show(authOptions.tipMessage);
        const redirect = typeof authOptions.redirect === 'function' ? authOptions.redirect(to) : authOptions.redirect;
        next(redirect);
    }), () => {
        authOptions.noLogin();
    });
};

