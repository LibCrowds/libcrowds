import BootstrapVue from 'bootstrap-vue'

import testLocalConfig from '@/test/test.local.config'
import { mount, createLocalVue } from 'vue-test-utils'
import SmallAvatar from '@/components/avatars/Small'

describe('User avatar', () => {
  let localVue = null
  let wrapper = null
  let domainObject = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    domainObject = {}
    wrapper = mount(SmallAvatar, {
      localVue,
      propsData: {
        domainObject: domainObject
      }
    })
  })

  it('renders placeholder by default', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('returns image source from avatar_url', () => {
    const imgUrl = '/uploads/img.png'
    wrapper.setProps({
      domainObject: {
        info: {
          avatar_url: imgUrl
        }
      }
    })
    expect(wrapper.vm.src).toBe(testLocalConfig.pybossaHost + imgUrl)
  })

  it('returns image source from thumbnail_url', () => {
    const imgUrl = '/uploads/img.png'
    wrapper.setProps({
      domainObject: {
        info: {
          thumbnail_url: imgUrl
        }
      }
    })
    expect(wrapper.vm.src).toBe(testLocalConfig.pybossaHost + imgUrl)
  })

  it('returns image source from media_url', () => {
    const imgUrl = '/uploads/img.png'
    wrapper.setProps({
      domainObject: {
        info: {
          media_url: imgUrl
        }
      }
    })
    expect(wrapper.vm.src).toBe(testLocalConfig.pybossaHost + imgUrl)
  })
})
