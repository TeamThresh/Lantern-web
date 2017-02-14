<template lang='pug'>
    div#menu-wrapper
        div.logo
            i.fa.fa-bolt
        div.menu
            i.fa.fa-home
            |대시보드
        div.menu
            i.fa.fa-user-circle-o
            |사용자
        div.menu
            i.fa.fa-exclamation-triangle
            |오류
        div.menu
            i.fa.fa-tachometer
            |성능
        div.menu
            i.fa.fa-bar-chart
            |리포트
</template>

<script>
</script>

<style lang='sass' scoped>
@import "../layout/style.scss";

$menuBackgroundColor: rgb(28, 33, 50);
$selectedMenuBackgroundColor: rgb(16, 20, 31);
$greenColor: rgb(186, 209, 83);

#menu-wrapper {
    float: left;
    width: 250px; height: 100%; 
    background-color: $menuBackgroundColor;
    color: white;
    font-weight: lighter;

    .logo {
        margin: 0px 0px 50px 0px;
        padding: 15px 0px 15px 0px;
        width: 100%;
        color: $greenColor;
        text-align: center;
        font-size: 30px;
    }

    .menu {
        padding: 20px 0px 20px 0px;
        @include vendor(transition, background-color 200ms ease-out);

        &.selected, &:hover {
            background-color: $selectedMenuBackgroundColor;
        }

        i {
            padding: 0px 10px 0px 10px;
            width: 20px;
            color: $greenColor;
            font-size: 18px;
            font-weight: lighter;
        }
    }
}
</style>