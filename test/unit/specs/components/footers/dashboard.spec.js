import BootstrapVue from 'bootstrap-vue'

import MockDate from 'mockdate'
import { mount, createLocalVue } from 'vue-test-utils'
import DashboardFooter from '@/components/footers/Dashboard'

describe('Dashboard footer', () => {
  const RealDate = Date
  let localVue = null
  let wrapper = null

  beforeEach(() => {
    MockDate.set('1/1/2000')
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

  afterEach(() => {
    MockDate.reset()
  })
})
