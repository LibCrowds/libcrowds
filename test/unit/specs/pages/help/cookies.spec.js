import BootstrapVue from 'bootstrap-vue'

import { mount, createLocalVue } from '@vue/test-utils'
import CookiesHelp from '@/pages/help/cookies'

describe('API help page', () => {
  let localVue = null
  let wrapper = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    wrapper = mount(CookiesHelp, {
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
