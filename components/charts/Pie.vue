<template>
  <no-ssr>
    <chartist
      type="Pie"
      :data="chartData"
      :options="mergedOptions"
      class="ct-container">
    </chartist>
  </no-ssr>
</template>

<script>
export default {
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
      const defaults = {
        height: '200px',
        plugins: [ this.$chartist.plugins.tooltip() ],
        labelInterpolationFnc: this.labelInterpolationFnc
      }
      return Object.assign(defaults, this.options)
    }
  }
}
</script>
