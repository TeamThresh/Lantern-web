<template lang='pug'>
    div#screenModeViewer
        div.ui.grid
            div.widescreen.only.row widescreen
            div.large.screen.only.row largescreen
            div.computer.only.row computer
            div.tablet.only.row tablet
            div.mobile.only.row mobile
</template>

<script>

</script>

<style lang='sass' scoped>
    #screenModeViewer {
        border: 1px solid red;
        padding: 5px 5px 5px 5px;
        position: absolute;
        top: 0;
        left: 0;
        color: white;
        background-color: black;

        .ui.grid {
            padding: 10px 10px 10px 10px;
        }
    }
</style>