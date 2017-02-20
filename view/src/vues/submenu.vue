<template lang='pug'>
    div#submenu-wrapper(@click='click')
        i.fa.fa-bars#menu-toggle-btn
        span#title Lantern
        div#right-floated
            i.fa.fa-bell-o
            div#user
                i.fa.fa-user-circle-o
                span#user-name ckcks12
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
    padding: 10px 0px 0px 0px;
    width: 100%; height: 45px;
    background-color: $submenuBackgroundColor;
    vertical-align: middle;

    i{
        padding: 5px 10px 5px 10px;

        &:first-child {
            margin: 0px 0px 0px 10px;
        }

        &:last-child {
            margin: 0px 10px 0px 0px;
        }

        &:hover {
            background-color: $iconHoverBackgroundColor;
        }
    }

    span#title {
        margin: 0px 0px 0px 10px;
    }

    #right-floated {
        float: right;

        #user {
            display: inline-block;
            margin: 0px 10px 0px 0px;
        }
    }
}
</style>