import BootstrapVue from 'bootstrap-vue'

import { mount, createLocalVue } from '@vue/test-utils'
import DashboardFooter from '@/components/footers/Dashboard'

describe('Dashboard footer', () => {
  let localVue = null
  let wrapper = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    wrapper = mount(DashboardFooter, {
      localVue
    })
  })

  it('renders correctly', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
