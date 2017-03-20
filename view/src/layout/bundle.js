/**
 * custom style
 */
require('./style.scss');

// window.Vue = require('vue');
window.Vue = require('vue/dist/vue.common.js');
require('vue-resource');

// window.TWEEN = require('tween.js');
// window._ = require('underscore');
window.$ = require('jquery');
window.jQuery = window.$;

Vue.component('mainmenu', require('../vues/mainmenu.vue'));
Vue.component('submenu', require('../vues/submenu.vue'));
Vue.component('filtermenu', require('../vues/filtermenu.vue'));
Vue.component('flameGraph', require('../vues/flameGraph.vue'));
Vue.component('bucketGraph', require('../vues/bucketGraph.vue')); 
Vue.component('histogram', require('../vues/histogram.vue'));
Vue.component('screenModeViewer', require('../vues/screenModeViewer.vue'));

window.app = new Vue({el: '#app'});

/* tween animate */
// requestAnimationFrame(animate);
// function animate(time) {
//     requestAnimationFrame(animate);
//     TWEEN.update(time);
// }