import BootstrapVue from 'bootstrap-vue'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/picture-o'

import pbTestResponses from '@/test/fixtures/pybossaTestResponses.json'
import testLocalConfig from '@/test/test.local.config'
import { mount, createLocalVue } from 'vue-test-utils'
import ProjectAvatar from '@/components/avatars/Project'

describe('Project avatar', () => {
  let localVue = null
  let wrapper = null
  let project = null
  let loadAvatarSpy = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.component('icon', Icon)
    project = pbTestResponses.getProject.data.project
    loadAvatarSpy = jest.spyOn(ProjectAvatar.methods, 'loadAvatar')
    wrapper = mount(ProjectAvatar, {
      localVue,
      propsData: {
        project: project
      }
    })
  })

  it('renders placeholder by default', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    expect(loadAvatarSpy).toHaveBeenCalled()
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
    const expectedUrl = testLocalConfig.pybossaHost + avatarUrl
    wrapper.vm.loadAvatar(avatarUrl)
    expect(wrapper.vm.avatar).toBe(expectedUrl)
  })
})
