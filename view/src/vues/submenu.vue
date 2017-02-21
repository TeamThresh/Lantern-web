<template lang='pug'>
    div#submenu-wrapper
        i.fa.fa-bars#menu-toggle-btn(@click='click')
        span#title Lantern
        .space
        i.fa.fa-bell-o
        i.fa.fa-user-circle-o
        span.user-name ckcks12
        i.fa.fa-sign-out
</template>

<script>
    module.exports = {
        methods: {
            click: function() { 
                var container = $(this.$el).parent();
                
                // find mainmenu component dom
                $.map(this.$root.$children, function(obj) {
                    if( obj.$options._componentTag == 'mainmenu' ) {
                        var maxWidth = 250;
                        var mainmenu = obj.$el;
                        var width = $(mainmenu).width() < maxWidth ? maxWidth : 0;

                        // animate mainmenu opacity & width
                        $(mainmenu).animate({
                            opacity: width == 0 ? 0 : 100,
                            width: width
                        }, 500);

                        // animate submenu padding-left
                        $(container).animate({
                            'padding-left': width
                        }, 500);
                    }
                });
            }
        }
    }
</script>

<style lang='sass' scoped>
$submenuBackgroundColor: rgb(255, 255, 255);
$iconHoverBackgroundColor: rgb(222, 222, 222);

#submenu-wrapper {
    display: table;
    width: 100%; height: 45px;
    background-color: $submenuBackgroundColor;
    vertical-align: middle;

    > * { /* amazing css selector XD */
        display: table-cell;
        vertical-align: middle;
        width: 1px;
        padding: 0px 15px 0px 15px;
    }

    i:hover {
        background-color: $iconHoverBackgroundColor;
    }

    .space {
        display: table-cell;
        width: auto;
    }
}
</style>