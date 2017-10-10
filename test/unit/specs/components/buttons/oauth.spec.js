import BootstrapVue from 'bootstrap-vue'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'
import 'vue-awesome/icons/facebook'
import 'vue-awesome/icons/google-plus'
import 'vue-awesome/icons/twitter'

import testLocalConfig from '~/test/test.local.config'
import { mount, createLocalVue } from 'vue-test-utils'
import Oauth from '~/components/buttons/Oauth'

describe('Oauth buttons', () => {
  const localVue = createLocalVue()
  localVue.use(BootstrapVue)
  localVue.component('icon', Icon)
  const next = '/'
  const wrapper = mount(Oauth, {
    localVue,
    propsData: {
      facebook: true,
      google: true,
      twitter: true,
      next: next
    }
  })

  it('render correctly', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('redirect to the correct oauth endpoint', () => {
    const endpoint = 'twitter'
    const host = testLocalConfig.pybossa.host
    const expectedUrl = `${host}/${endpoint}?next=${next}`
    const mockAssign = jest.fn()
    window.location.assign = mockAssign
    wrapper.vm.redirect(endpoint)
    expect(mockAssign).toHaveBeenCalledWith(expectedUrl)
  })
})
