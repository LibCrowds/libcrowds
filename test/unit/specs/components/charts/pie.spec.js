import BootstrapVue from 'bootstrap-vue'
import VueChartist from 'vue-chartist'
import 'chartist-plugin-tooltips'
import noSSR from '@/.nuxt/components/no-ssr'

import { mount, createLocalVue } from '@vue/test-utils'
import PieChart from '@/components/charts/Pie'

describe('Pie chart', () => {
  let localVue = null
  let wrapper = null
  let propsData = null
  let max = null
  let random = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.use(VueChartist)
    localVue.component(noSSR.name, noSSR)
    max = 100
    random = Math.floor(Math.random() * (max - 1 + 1)) + 1
    propsData = {
      chartData: {
        labels: ['Auth', 'Anon'],
        series: [
          { meta: 'Auth:', value: random },
          { meta: 'Anon', value: max - random }
        ]
      },
      unit: 'task'
    }
    wrapper = mount(PieChart, {
      localVue,
      propsData: propsData
    })
  })

  it('renders correctly', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('calculates the correct percentage for labels', () => {
    const idx = 0
    const label = propsData.chartData.labels[idx]
    const value = propsData.chartData.series[idx].value
    const expected = Math.round(value / max * 100) + '%'
    const result = wrapper.vm.labelInterpolationFnc(label, idx)
    expect(result).toBe(expected)
  })
})
