<template>
  <b-card :header="header">
    <chartist
      type="Line"
      :data="chartData"
      :options="options" >
    </chartist>
  </b-card>
</template>

<script>
import pluralize from 'pluralize'

export default {
  data () {
    return {
      options: {
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
        })
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
    header: {
      type: String,
      required: true
    }
  }
}
</script>
