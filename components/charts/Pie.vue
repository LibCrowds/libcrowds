<template>
  <b-card :header="header">
    <vue-chartist
      type="Pie"
      :data="chartData"
      :options="opts" >
    </vue-chartist>
  </b-card>
</template>

<script>
export default {
  data () {
    return {
      opts: {
        height: '200px',
        plugins: [
          this.$chartist.plugins.tooltip(),
          this.$chartist.plugins.legend({
            position: 'bottom'
          })
        ],
        labelInterpolationFnc: (value, idx) => {
          let sum = this.data.series.reduce((a, b) => a.value + b.value)
          return Math.round(this.data.series[idx].value / sum * 100) + '%'
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
