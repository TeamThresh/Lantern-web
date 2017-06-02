<template lang='pug'>
portlet(simple='true')
    span(slot='title')
        button.btn.btn-default(@click='changeType(0)') cpu
        span &nbsp;
        button.btn.btn-default(@click='changeType(1)') memory
        span &nbsp;
        button.btn.btn-default(@click='changeType(2)') ui rendering
</template>

<script>
export default {
    props: [],
    data() {
        return {
            app: this.$root.app,
            data: {},
            type: 'cpu'
        }
    },
    watch: {
        'app.isInitDone'() {
            if( ! this.app.isInitDone ) {
                return
            }
            this.fetch()
        }
    },
    methods: {
        fetch() {
            this.$http.get(`/api/histogram/${this.app.packageName}/`)
        },
        clear() {
            $(this.$el).find('*').remove()
        },
        draw() {

        },
        changeType(p) {
            switch( p ) {
                case 0:
                    this.type = 'cpu'
                    break
                case 1:
                    this.type = 'memory'
                    break
                case 2:
                    this.type = 'ui'
                    break
            }
        }
    },
    mounted() {

    }
}
</script>

<style lang='scss' scoped>

histogram {

}

</style>