import BootstrapVue from 'bootstrap-vue'

import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/github'
import 'vue-awesome/icons/envelope'

import { mount, createLocalVue } from '@vue/test-utils'
import DashboardFooter from '@/components/footers/Dashboard'

describe('Dashboard footer', () => {
  let localVue = null
  let wrapper = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.component('icon', Icon)
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
