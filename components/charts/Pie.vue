<template>
  <chartist
    type="Pie"
    :data="chartData"
    :options="mergedOptions"
    class="ct-container">
  </chartist>
</template>

<script>
export default {
  data () {
    return {
      defaultOptions: {
        height: this.height,
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
    options: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: String,
      default: '200px'
    }
  },

  computed: {
    mergedOptions () {
      const copiedOpts = Object.assign({}, this.defaultOptions)
      return Object.assign(copiedOpts, this.options)
    }
  }
}
</script>
