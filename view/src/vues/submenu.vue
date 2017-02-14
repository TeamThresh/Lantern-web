<template lang='pug'>
    div#submenu-wrapper
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
        padding: 10px 10px 10px 10px;

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