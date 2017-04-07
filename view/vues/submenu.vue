<template lang='pug'>
    div.submenu
        div.logo Lantern
        div.content
            a.item(link="#")
                i.fa.fa-bell-o
                div.notification-count 14
            a.item(link="#")
                i.fa.fa-envelope-o
                div.mail-count 22
            a.item(link="#")
                i.fa.fa-user-o
                | &nbsp; Guest
            a.item(link="#")
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
    $gutter: 28px;
    $bgColor: #3B3F51;
    div.submenu {
        padding: 0px $gutter 0px $gutter;
        height: 75px;
        background-color: $bgColor;
        background-color: $bgColor;

        .logo {
            margin: 20px 0px 0px 0px;
            display: inline-block;
            $color: rgb(91, 155, 209);
            font-size: 18pt;
            color: $color;
            letter-spacing: -1.5px;
            font-weight: normal;
        }

        .content {
            margin: 25px 0px 0px 0px;
            display: inline-block;
            float: right;

            a {
                margin: 0px 0px 0px 30px;
                display: inline-block;
                color: #aeb2c4;

                div {
                    border-radius: 25px;
                    margin: 0px 0px 0px 10px;
                    padding: 4px 0px 0px 0px;
                    width: 25px;
                    height: 25px;
                    display: inline-block;
                    font-size: 10pt;
                    text-align: center;
                    color: white;

                    &.notification-count {
                        background-color: #36c6d3;
                    }

                    &.mail-count {
                        background-color: #ed6b75;
                    }
                }
            }
        }
    }
</style>