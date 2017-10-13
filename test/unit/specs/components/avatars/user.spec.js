import BootstrapVue from 'bootstrap-vue'
import VueGravatar from 'vue-gravatar'

import pbTestResponses from '~/test/fixtures/pybossaTestResponses.json'
import testLocalConfig from '~/test/test.local.config'
import { mount, createLocalVue } from 'vue-test-utils'
import UserAvatar from '~/components/avatars/User'

describe('User avatar', () => {
  const localVue = createLocalVue()
  localVue.use(BootstrapVue)
  localVue.component('v-gravatar', VueGravatar)
  let user = pbTestResponses.getAccount.data.user
  const wrapper = mount(UserAvatar, {
    localVue,
    propsData: {
      user: user
    }
  })

  it('renders Gravatar when no custom avatar', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    const src = wrapper.find('img').element.src
    expect(user.info.hasOwnProperty('avatar_url')).toBe(false)
    expect(src.startsWith('//www.gravatar.com')).toBe(true)
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('loads custom avatar', () => {
    const avatarUrl = 'http://example.com/avatar.jpg'
    wrapper.vm.loadAvatar(avatarUrl)
    expect(wrapper.vm.avatar).toBe(avatarUrl)
  })

  it('loads uploaded avatar', () => {
    const avatarUrl = '/uploads/user_1/img.jpg'
    const expectedUrl = testLocalConfig.pybossa.host + avatarUrl
    wrapper.vm.loadAvatar(avatarUrl)
    expect(wrapper.vm.avatar).toBe(expectedUrl)
  })
})
