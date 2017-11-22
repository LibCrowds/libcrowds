<template>
  <chartist
    type="Bar"
    :data="chartData"
    :options="mergedOptions">
  </chartist>
</template>

<script>
import pluralize from 'pluralize'

export default {
  data () {
    return {
      defaultOptions: {
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
