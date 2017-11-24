<template>
  <no-ssr>
    <chartist
      type="Line"
      :data="chartData"
      :options="mergedOptions"
      class="ct-container">
    </chartist>
  </no-ssr>
</template>

<script>
import pluralize from 'pluralize'

export default {
  props: {
    chartData: {
      type: Object,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    defaultOptions () {
      return {
        height: '300px',
        plugins: [
          this.$chartist.plugins.tooltip({
            transformTooltipTextFnc: (val) => {
              let text = pluralize(this.unit, Number(val))
              return `${val} ${text}`
            }
          })
        ],
        lineSmooth: this.$chartist.Interpolation.cardinal({
          fillHoles: true
        }),
        low: 0,
        showArea: true
      }
    },

    mergedOptions () {
      const copiedOpts = Object.assign({}, this.defaultOptions)
      return Object.assign(copiedOpts, this.options)
    }
  }
}
</script>
