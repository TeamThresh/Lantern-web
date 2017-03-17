<template lang='pug'>
    div.submenu.ui.middle.aligned.grid
        div.two.wide.column
            span.logo Lantern
        div.ten.wide.column
        div.one.wide.column.right.floated.right.aligned
            a(link="#")
                i.alarm.icon.inverted.large
                div.ui.red.label.circular.small 14
        div.one.wide.column.right.floated.right.aligned
            a(link="#")
                i.envelope.icon.inverted.large
                div.ui.teal.label.circular.small 22
        div.one.wide.column.right.floated.right.aligned.user
            a(link="#")
                i.user.icon.inverted.large
                | Guest
        div.one.wide.column.right.floated.right.aligned
            a(link="#")
                i.sign.out.icon.inverted.large
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
    @import '../layout/style.scss';
    $bgColor: #3B3F51;
    div.submenu {
        margin: 0;
        padding: 0px $containerPadding 0px $containerPadding;
        height: 75px;
        background-color: $bgColor;

        div.user a {
            color: white;
        }
    }

/*$submenuBackgroundColor: rgb(255, 255, 255);
$iconHoverBackgroundColor: rgb(222, 222, 222);

#submenu-wrapper {
    display: table;
    width: 100%; height: 45px;
    background-color: $submenuBackgroundColor;
    vertical-align: middle;

    > * {  amazing css selector XD 
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
}*/
</style>