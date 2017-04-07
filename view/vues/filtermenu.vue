<template lang='pug'>
    div#filtermenu-wrapper
        div#right-floated
            div#period
                span#period-start 2017.01.09
                span#period-delimiter ~
                span#period-end 2017.01.16
            div#filter-btn 필터
</template>

<script>
</script>

<style lang='sass' scoped>
$filtermenuBackgroundColor: rgb(235, 235, 235);
$filterBtnBackgroundColor: rgb(194, 194, 193);
$periodTextColor: rgb(127, 129, 131);

#filtermenu-wrapper {
    padding: 5px 0px 5px 0px;
    width: 100%; height: 50px;
    background-color: $filtermenuBackgroundColor;
    
    #right-floated {
        float: right;
    }

    #period {
        display: inline-block;
        margin: 0px 10px 0px 0px;
        height: 100%;
        letter-spacing: 2px;
    }

    #filter-btn {
        display: inline-block; 
        padding: 0px 30px 0px 30px;
        height: 100%;
        background-color: $filterBtnBackgroundColor;
    }
}
</style>