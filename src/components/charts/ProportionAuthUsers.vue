<template>
  <b-card header="Proportion of authenticated volunteers">
    <div class="ct-container" ref="chart"></div>
  </b-card>
</template>

<script>
import Chartist from 'chartist'
import 'chartist-plugin-tooltips'
import 'chartist-plugin-legend'

export default {
  data: function () {
    return {
      opts: {
        height: '200px',
        plugins: [
          Chartist.plugins.tooltip(),
          Chartist.plugins.legend({
            position: 'bottom'
          })
        ],
        labelInterpolationFnc: (value, idx) => {
          let sum = this.data.series.reduce((a, b) => a.value + b.value)
          return Math.round(this.data.series[idx].value / sum * 100) + '%'
        }
      }
    }
  },

  props: {
    nAuth: {
      type: Number,
      required: true
    },
    nAnon: {
      type: Number,
      required: true
    }
  },

  computed: {
    data: function () {
      return {
        labels: ['Authenticated Volunteers', 'Anonymous Volunteers'],
        series: [
          {meta: 'Authenticated Volunteers:', value: this.nAuth},
          {meta: 'Anonymous Volunteers:', value: this.nAnon}
        ]
      }
    }
  },

  mounted () {
    const chart = this.$refs.chart
    Chartist.Pie(chart, this.data, this.opts)
  }
}
</script>
