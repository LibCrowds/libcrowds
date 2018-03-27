import BootstrapVue from 'bootstrap-vue'

import { mount, createLocalVue } from '@vue/test-utils'
import TosHelp from '@/pages/help/tos'

describe('API help page', () => {
  let localVue = null
  let wrapper = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    wrapper = mount(TosHelp, {
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
