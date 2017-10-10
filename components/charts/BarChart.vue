<template>
  <b-card :header="header">
    <div class="ct-container" ref="chart"></div>
  </b-card>
</template>

<script>
import Chartist from 'chartist'
import 'chartist-plugin-tooltips'
import pluralize from 'pluralize'

export default {
  data: function () {
    return {
      opts: {
        height: '300px',
        plugins: [
          Chartist.plugins.tooltip({
            transformTooltipTextFnc: (val) => {
              let text = pluralize(this.unit, Number(val))
              return `${val} ${text}`
            }
          })
        ]
      }
    }
  },

  props: {
    data: {
      type: Object,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    header: {
      type: String,
      required: true
    }
  },

  mounted () {
    const chart = this.$refs.chart
    Chartist.Bar(chart, this.data, this.opts)
  }
}
</script>
