<template lang='pug'>
    div.ui.fluid.vertical.menu
        div.item
            i.icon.home.large
            div.header 대시보드
            div.menu
                a.item.active 대시보드
                a.item 대시보드
        div.item
            i.tasks.icon.large
            div.header 성능
            div.menu
                a.item 세부메뉴
                a.item 를 정합시다
        div.item
            i.exclamation.triangle.icon.large
            div.header 오류
            div.menu
                a.item 세부메뉴
                a.item 를 정합시다22
        div.item
            i.user.circle.o.icon.large
            div.header 사용자
            div.menu
                a.item 유저플로우
                a.item 아님 뭐시기라도
        div.item
            i.bar.chart.icon.large
            div.header 리포트
            div.menu
                a.item 회사제출
                a.item 용으로
                a.item 귀한것.
</template>

<script>
    module.exports = {
        methods: {
            toggle: function() {
                var width = $(this.$el).width() < 250 ? 250 : 0;
                $(this.$el).animate({
                    opacity: width == 0 ? width : 100,
                    width: width
                }, 500);
            }
        }
    }
</script>

<style lang='sass' scoped>

</style>