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
    mergedOptions () {
      const defaults = {
        height: '300px',
        low: 0,
        showArea: true
      }

      // $chartist will only be available on the client
      if (this.$chartist) {
        defaults.lineSmooth = this.$chartist.Interpolation.cardinal({
          fillHoles: true
        })
        defaults.plugins = [
          this.$chartist.plugins.tooltip({
            transformTooltipTextFnc: (val) => {
              let text = pluralize(this.unit, Number(val))
              return `${val} ${text}`
            }
          })
        ]
      }
      return Object.assign(defaults, this.options)
    }
  }
}
</script>
