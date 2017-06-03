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
        'app.insight.type'() {
            if( ! this.app.isInitDone ) {
                return
            }
            this.fetch()
        }
    },
    methods: {
        fetch() {
            this.$http.get(`/api/histogram/${this.app.packageName}/${this.app.insight.type}`).then(res => {
                this.data = res.body
                this.app.insight.p95 = this.data.p95.rate
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
            let xScaleMax = 101
            let rectCount = 49
            if( this.app.insight.type == 'network' ) {
                xScaleMax = Math.max.apply(Math, this.data.histogram.map(d => d.rate)) + 100
            } else if( this.app.insight.type == 'memory'
                || this.app.insight.type == 'ui' ) {
                xScaleMax = Math.max.apply(Math, this.data.histogram.map(d => d.rate)) + 10
            }
            let preXScale = d3.scaleLinear().domain([0, xScaleMax]).range([0, rectCount])
            let xScale = this.xScale.domain([0, xScaleMax]).range([margin.left, width - margin.right])
            let xScale2 = d3.scaleLinear().domain([0, rectCount]).range([margin.left, width - margin.right])
            let xAxis = d3.axisBottom(xScale).tickSize(0)
            let rectWidth = xScale2(1) - xScale(0)

            // sampling
            this.data.histogram.forEach(h => {
                h.preRate = Math.floor(preXScale(h.rate))
            })
            for( let i=0; i<this.data.histogram.length - 1; i++ ) {
                if( this.data.histogram[i].preRate == this.data.histogram[i + 1].preRate ) {
                    this.data.histogram[i].user_count += this.data.histogram[i + 1].user_count
                    this.data.histogram.splice(i + 1, 1)
                    i--;
                }
            }

            let yScale = this.yScale.domain([0, Math.max.apply(Math, this.data.histogram.map(d => d.user_count))]).range([height - margin.bottom, margin.top])
            let yScale2 = d3.scaleLinear().domain(yScale.domain()).range([0, height - margin.top - margin.bottom])
            let yAxis = d3.axisLeft(yScale).tickSize(0).tickValues([0, yScale.domain()[1] / 2, yScale.domain()[1]])

            // draw axis
            this.app.drawAxis(svg, xAxis, yAxis, margin)

            svg.selectAll('rect')
                .data(this.data.histogram)
                .enter()
                .append('rect')
                .attr('x', d => xScale2(d.preRate))
                .attr('y', d => margin.top + yScale2.range()[1] - yScale2(d.user_count))
                .attr('width', rectWidth)
                .attr('height', d => yScale2(d.user_count))
                .attr('fill', 'grey')

            svg.append('line')
                .attr('x1', xScale(this.data.p50.rate))
                .attr('x2', xScale(this.data.p50.rate))
                .attr('y1', margin.top)
                .attr('y2', height - margin.bottom)
                .attr('stroke', '#e49f00')
                .attr('stroke-width', '2px')

            svg.append('line')
                .attr('x1', xScale(this.data.p95.rate))
                .attr('x2', xScale(this.data.p95.rate))
                .attr('y1', margin.top)
                .attr('y2', height - margin.bottom)
                .attr('stroke', '#ef4000')
                .attr('stroke-width', '2px')
        },
        changeType(p) {
            switch( p ) {
                case 0:
                    this.app.insight.type = 'cpu'
                    break
                case 1:
                    this.app.insight.type = 'memory'
                    break
                case 2:
                    this.app.insight.type = 'network'
                    break
                case 3:
                    this.app.insight.type = 'ui'
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