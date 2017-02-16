require('./style.scss');
window.Vue = require('vue');
require('vue-resource');

var mainmenu = require('../vues/mainmenu.vue');
var submenu = require('../vues/submenu.vue');
var filtermenu = require('../vues/filtermenu.vue');

window.mainmenu = mainmenu;

new Vue({
    el: 'mainmenu',
    render: function(h) {
        return h(mainmenu);
    }
});

new Vue({
    el: 'submenu',
    render: function(h) {
        return h(submenu);
    }
});

new Vue({
    el: 'filtermenu',
    render: function(h) {
        return h(filtermenu);
    }
});