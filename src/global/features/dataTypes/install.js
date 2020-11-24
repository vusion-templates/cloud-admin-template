import enums from '../../enums';
import auth from '../router/auth';

export default {
    install(Vue, options = {}) {
        Vue.prototype.$global = {
            userInfo: {},
            requestFullscreen() {
                document.body.requestFullscreen();
            },
            exitFullscreen() {
                document.exitFullscreen();
            },
            hasAuth(authPath) {
                return auth.has(authPath);
            },
        };

        Vue.prototype.$enums = (key, value) => {
            if (!key || !value)
                return '';
            if (enums[key]) {
                return enums[key](value);
            } else {
                return '';
            }
        };
    },
};
