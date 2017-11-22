<template>
  <chartist
    type="Bar"
    :data="chartData"
    :options="mergedOptions"
    class="ct-container">
  </chartist>
</template>

<script>
import pluralize from 'pluralize'

export default {
  data () {
    return {
      defaultOptions: {
        height: this.height,
        plugins: [
          this.$chartist.plugins.tooltip({
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
    },
    height: {
      type: String,
      default: '300px'
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
