<template lang='pug'>
    div.mainmenu
        div.group
            a.header.selected
                i.fa.fa-home
                | Dashboard
            a.menu.selected Dashboard
        div.group
            a.header
                i.fa.fa-tasks
                | Performance
            a.menu CPU Memory
            a.menu Network
        div.group
            a.header
                i.fa.fa-exclamation-triangle
                | Crash
            a.menu Crash List
            a.menu Crash Statistic
        div.group
            a.header
                i.fa.fa-users
                | User
            a.menu User Flow
            a.menu Device Usage
        div.group
            a.header
                i.fa.fa-bar-chart
                | Report
            a.menu One Page Report
            a.menu Statistics
</template>

<script>
    module.exports = {
        mounted: function() {
        }
    }
</script>

<style lang='sass' scoped>
    $gutter: 28px;
    div.mainmenu {
        margin: $gutter $gutter 0 $gutter;
        width: 235px;
        display: inline-block;
        float: left;
        background-color: white;
    
        div.group {
            padding: 15px 0 5px 0;
            width: 100%;

            a.header {
                padding: 10px 0 10px 15px;
                display: block;
                color: #678098;

                &.selected {
                    border-left: 2px solid #5C9ACF;
                    background-color: #f2f6f9;
                    color: #5b9bd1;
                }

                i {
                    margin: 0 10px 0 0;
                }
            }

            a.menu {
                padding: 10px 0 10px 50px;
                display: block;
                color: #678098;
                font-size: 11pt;

                &.selected {
                    border-left: 2px solid #5C9ACF;
                    background-color: #f2f6f9;
                    color: #5b9bd1;
                }

                &::before {
                    content: '- ';
                }

                &:hover {
                    background-color: #f2f6f9;
                    cursor: pointer;
                }
            }
        }
    }
</style>