require('./style.scss');
// window.Vue = require('vue');
window.Vue = require('vue/dist/vue.common.js');
require('vue-resource');

var mainmenu = require('../vues/mainmenu.vue');
var submenu = require('../vues/submenu.vue');
var filtermenu = require('../vues/filtermenu.vue');
var flameGraph = require('../vues/flameGraph.vue');

Vue.component('mainmenu', mainmenu);
Vue.component('submenu', submenu);
Vue.component('flame-graph', flameGraph);

window.app = new Vue({el: '#app'});