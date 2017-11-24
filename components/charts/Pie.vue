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
  asyncData ({ isServer }) {
    if (isServer) {
      return {}
    }
    return {
      defaultOptions: {
        height: '200px',
        plugins: [ this.$chartist.plugins.tooltip() ]
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
    }
  },

  methods: {
    labelInterpolationFnc (value, idx) {
      let sum = this.chartData.series.reduce((a, b) => a.value + b.value)
      return Math.round(this.chartData.series[idx].value / sum * 100) + '%'
    }
  },

  computed: {
    mergedOptions () {
      const copiedOpts = Object.assign({}, this.defaultOptions)
      copiedOpts.labelInterpolationFnc = this.labelInterpolationFnc
      return Object.assign(copiedOpts, this.options)
    }
  }
}
</script>
