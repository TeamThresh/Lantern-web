require('./style.scss');

var menu = require('../vues/menu.vue');
var submenu = require('../vues/submenu.vue');
var filtermenu = require('../vues/filtermenu.vue');

new Vue({
    el: 'menu',
    render: function(h) {
        return h(menu);
    },
    template: '<menu/>',
    components: {menu}
});

new Vue({
    el: 'submenu',
    render: function(h) {
        return h(submenu);
    },
    template: '<submenu/>',
    components: {submenu}
});

new Vue({
    el: 'filtermenu',
    render: function(h) {
        return h(filtermenu);
    },
    template: '<filtermenu/>',
    components: {filtermenu}
});