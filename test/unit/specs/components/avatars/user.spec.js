import BootstrapVue from 'bootstrap-vue'
import VueGravatar from 'vue-gravatar'

import pbTestResponses from '~/test/fixtures/pybossaTestResponses.json'
import testLocalConfig from '~/test/test.local.config'
import { mount, createLocalVue } from 'vue-test-utils'
import UserAvatar from '~/components/avatars/User'

describe('User avatar', () => {
  const localVue = createLocalVue()
  localVue.use(BootstrapVue)
  localVue.use(VueGravatar)
  const user = pbTestResponses.getAccount.data.user
  const wrapper = mount(UserAvatar, {
    localVue,
    propsData: {
      user: user
    }
  })

  it('renders correctly', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
