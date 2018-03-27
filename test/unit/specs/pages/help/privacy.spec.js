import BootstrapVue from 'bootstrap-vue'

import { mount, createLocalVue } from '@vue/test-utils'
import PrivacyHelp from '@/pages/help/privacy'

describe('API help page', () => {
  let localVue = null
  let wrapper = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    wrapper = mount(PrivacyHelp, {
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
