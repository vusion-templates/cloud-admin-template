<template>
    <div :class="$style.container">
        <div v-show="loading">
            <u-loading size="large"></u-loading>
        </div>
        <div :class="$style.wrap"
            v-html="renderDom || defaultDom" v-show="!loading">
        </div>
    </div>
</template>
<script>
import micro from 'vusion-micro';
import { v4 as uuidv4 } from 'uuid';
import merge from 'lodash/merge';
export default {
    name: 'u-micro',
    props: {
        done: {
            type: Boolean,
            default: true,
        },
        renderDom: {
            type: String,
        },
        config: Object,
        activeFn: Function,
        entries: [Object, String],
        masterName: String,
        slaveName: {
            type: String,
            required: true,
        },
    },
    data() {
        const nodeId = 'micro-' + uuidv4().replace(/-/g, '');
        const last = this.$route.matched[this.$route.matched.length - 1];
        const prefix = (this.$router.options.base + last.path.replace('**', '')).replace(/\/$/, '');
        return {
            prefix,
            nodeId,
            domReady: false,
            defaultDom: `<div id="${nodeId}"></div>`,
            loading: true,
            configSingle: {
                customProps: {
                    appInfo: {
                        alive: true,
                    },
                },
            },
        };
    },
    watch: {
        done: {
            handler(done) {
                this.start();
            },
            immediate: true,
        },
        entries: {
            handler(entries) {
                this.loadEntries(entries);
            },
            immediate: true,
        },
        config(config) {
            merge(this.configSingle, config);
        },
    },
    mounted() {
        this.domReady = true;
        this.start();
    },
    beforeDestroy() {
        this.configSingle.customProps.appInfo.alive = false;
        if (this.slaveName) {
            micro.unloadApp(this.slaveName).catch((e) => {
                console.log(e);
                return Promise.reject(e);
            });
        }
    },
    methods: {
        loadEntries(entries) {
            micro.loadEntries(entries, this.masterName, this.slaveName).then((entries) => {
                this.registerApp(entries);
            });
        },
        getConfig() {
            const location = window.location;
            const pathname = location.pathname;
            const activePath = pathname;
            return merge(this.configSingle, {
                urlRule: [this.activeFn || function (target) {
                    return target.pathname.startsWith(activePath);
                }],
                customProps: {
                    node: '#' + this.nodeId,
                    prefix: this.prefix,
                },
            }, this.config);
        },
        registerApp(entries) {
            micro.registerApp({
                name: this.slaveName,
                entries,
                ...this.getConfig(),
            });
            this.loading = false;
            this.start();
        },
        start() {
            if (!this.inited && this.done && this.domReady && !this.loading) {
                this.inited = true;
                this.$nextTick(() => {
                    if (this.$route.query._m) {
                        this.$router.push(this.$route.query._m);
                    }
                    if (this.configSingle.customProps.appInfo.alive) {
                        micro.start();
                    }
                });
            }
        },
    },
};
</script>
<style module>
    .container {
        position: absolute;
        top: 80px;
        bottom: 0;
        left: 40px;
        right: 40px;
    }
    .wrap {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
