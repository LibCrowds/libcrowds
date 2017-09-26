<template>
  <b-card :header="header">
    <div class="ct-container" ref="chart"></div>
  </b-card>
</template>

<script>
import Chartist from 'chartist'
import 'chartist-plugin-tooltips'
import pluralize from 'pluralize'
import capitalize from '@/utils/capitalize'

export default {
  data: function () {
    return {
      header: capitalize(`${pluralize(this.label)} per day`),
      opts: {
        height: '300px',
        plugins: [
          Chartist.plugins.tooltip({
            transformTooltipTextFnc: (val) => {
              let text = pluralize(this.label, Number(val))
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
    data: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },

  mounted () {
    const chart = this.$refs.chart
    Chartist.Line(chart, this.data, this.opts)
  }
}
</script>
