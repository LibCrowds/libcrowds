<template>
  <div ref="chart"></div>
</template>

<script>
import Chartist from 'chartist'
import 'chartist-plugin-tooltips'

export default {
  data: function () {
    return {
      opts: {
        plugins: [
          Chartist.plugins.tooltip()
        ]
      }
    }
  },

  props: {
    data: {
      type: Object,
      required: true
    }
  },

  mounted () {
    const chart = this.$refs.chart
    Chartist.Bar(chart, this.data, this.opts)
  }
}
</script>
