import BootstrapVue from 'bootstrap-vue'
import VueChartist from 'vue-chartist'
import 'chartist-plugin-tooltips'

import { mount, createLocalVue } from 'vue-test-utils'
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
    max = 100
    random = Math.floor(Math.random() * (max - 1 + 1)) + 1
    propsData = {
      header: 'My Pie Chart',
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
    let modifiedLabel = wrapper.vm.options.labelInterpolationFnc(label, idx)
    expect(modifiedLabel).toBe(expected)
  })
})
