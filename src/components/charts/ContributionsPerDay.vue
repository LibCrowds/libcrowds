<template>
  <b-card header="Contributions per day">
    <div class="ct-container" ref="chart"></div>
  </b-card>
</template>

<script>
import Chartist from 'chartist'
import 'chartist-plugin-tooltips'
import formatDate from '@/utils/formatDate'
import pluralize from 'pluralize'

export default {
  data: function () {
    return {
      opts: {
        height: '300px',
        plugins: [
          Chartist.plugins.tooltip({
            transformTooltipTextFnc: (val) => {
              let text = pluralize('contribution', Number(val))
              return `${val} ${text}`
            }
          })
        ],
        lineSmooth: Chartist.Interpolation.cardinal({
          fillHoles: true
        }),
        axisX: {
          labelInterpolationFnc: value => {
            return value
          }
        }
      }
    }
  },

  props: {
    dayStats: {
      type: Array,
      required: true
    }
  },

  computed: {
    data: function () {
      let d = {
        labels: this.dayStats[0].values.map(value => {
          return formatDate(new Date(value[0]), 'DD MMM')
        }),
        series: [ this.dayStats[0].values.map(value => value[1]) ]
      }
      console.log(d)
      return d
    }
  },

  mounted () {
    const chart = this.$refs.chart
    Chartist.Line(chart, this.data, this.opts)
  }
}
</script>
