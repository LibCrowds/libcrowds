<template>
  <b-card :header="header">
    <chartist
      type="Pie"
      :data="chartData"
      :options="options" >
    </chartist>
  </b-card>
</template>

<script>
export default {
  data () {
    return {
      options: {
        height: '200px',
        plugins: [
          this.$chartist.plugins.tooltip(),
          this.$chartist.plugins.legend({
            position: 'bottom'
          })
        ],
        labelInterpolationFnc: (value, idx) => {
          let sum = this.chartData.series.reduce((a, b) => a.value + b.value)
          return Math.round(this.chartData.series[idx].value / sum * 100) + '%'
        }
      }
    }
  },

  props: {
    chartData: {
      type: Object,
      required: true
    },
    header: {
      type: String,
      required: true
    }
  }
}
</script>
