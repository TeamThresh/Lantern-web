<template lang='pug'>
portlet
    template(slot='title')
        div.btn-group(data-toggle='buttons')
            label.btn.btn-default.active(@click='changeType(0)')
                input.toggle(type='radio')
                | cpu
            label.btn.btn-default(@click='changeType(1)')
                input.toggle(type='radio')
                | memory
            label.btn.btn-default(@click='changeType(2)')
                input.toggle(type='radio')
                | network
            label.btn.btn-default(@click='changeType(3)')
                input.toggle(type='radio')
                | ui rendering
    svg.histogram
</template>

<script>
export default {
    props: [],
    data() {
        return {
            app: this.$root.app,
            data: {},
            type: 'cpu',
            margin: {top: 10, right: 0, bottom: 20, left: 30},
            xScale: d3.scaleLinear(),
            yScale: d3.scaleLinear()
        }
    },
    watch: {
        'app.isInitDone'() {
            if( ! this.app.isInitDone ) {
                return
            }
            this.fetch()
        },
        type() {
            if( ! this.app.isInitDone ) {
                return
            }
            this.fetch()
        }
    },
    methods: {
        fetch() {
            this.$http.get(`/api/histogram/${this.app.packageName}/${this.type}`).then(res => {
                this.data = res.body
                this.draw()
            })
        },
        clear() {
            $(this.$el).find('svg.histogram *').remove()
        },
        draw() {
            this.clear()

            let svg = d3.select(this.$el).select('svg.histogram')
            let margin = this.margin
            let width = $(svg.nodes()).width()
            let height = $(svg.nodes()).height()
            let xScaleMax = 110
            if( this.type == 'network' ) {
                xScaleMax = Math.max.apply(Math, this.data.histogram.map(d => d.rate)) + 100
            } else if( this.type == 'ui' ){
                xScaleMax = Math.max.apply(Math, this.data.histogram.map(d => d.rate)) + 10
            }
            let xScale = this.xScale.domain([0, xScaleMax]).range([margin.left, width - margin.right])
            let yScale = this.yScale.domain([0, Math.max.apply(Math, this.data.histogram.map(d => d.user_count))]).range([height - margin.bottom, margin.top])
            let yScale2 = d3.scaleLinear().domain(yScale.domain()).range([0, height - margin.top - margin.bottom])
            let xAxis = d3.axisBottom(xScale).tickSize(0)
			let yAxis = d3.axisLeft(yScale).tickSize(0).tickValues([0, yScale.domain()[1] / 2, yScale.domain()[1]])

            // draw axis
            this.app.drawAxis(svg, xAxis, yAxis, margin)

            let rectWidth = xScale(10) - xScale(0)
            if( this.type == 'network' ) {
                rectWidth = xScale(100) - xScale(0)
            }

            svg.selectAll('rect')
                .data(this.data.histogram)
                .enter()
                .append('rect')
                .attr('x', d => xScale(d.rate))
                .attr('y', d => margin.top + yScale2.range()[1] - yScale2(d.user_count))
                .attr('width', rectWidth)
                .attr('height', d => yScale2(d.user_count))
                .attr('fill', d => {
                    if( d.rate >= this.data.p95.rate ) {
                        return '#d9480f'
                    } else if( d.rate >= this.data.p50.rate ) {
                        return '#f59f00'
                    } else {
                        return '#228ae6'
                    }
                })

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
                    this.type = 'network'
                    break
                case 3:
                    this.type = 'ui'
                    break
            }
        }
    },
    mounted() {

    }
}
</script>

<style lang='scss'>

svg.histogram {
    width: 100%;
    height: 380px;

    line.guide {
        display: none;
    }
}

</style>