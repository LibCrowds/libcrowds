import BootstrapVue from 'bootstrap-vue'
import VueChartist from 'vue-chartist'
import 'chartist-plugin-tooltips'

import { mount, createLocalVue } from 'vue-test-utils'
import BarChart from '~/components/charts/Bar'

describe('Bar chart', () => {
  let localVue = null
  let wrapper = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.use(VueChartist)
    wrapper = mount(BarChart, {
      localVue,
      propsData: {
        header: 'My Bar Chart',
        chartData: {
          labels: ['A', 'B', 'C'],
          series: [[1, 3, 2], [4, 6, 5]]
        },
        unit: 'task'
      }
    })
  })

  it('renders correctly', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
