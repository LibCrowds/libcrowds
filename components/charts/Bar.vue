<template>
  <no-ssr>
    <chartist
      type="Bar"
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
        plugins: [
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
