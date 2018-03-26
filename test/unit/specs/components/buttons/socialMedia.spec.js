import BootstrapVue from 'bootstrap-vue'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'
import 'vue-awesome/icons/facebook'
import 'vue-awesome/icons/google-plus'
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/linkedin'

import testLocalConfig from '@/test/test.local.config'
import { mount, createLocalVue } from '@vue/test-utils'
import SocialMediaButtons from '@/components/buttons/SocialMedia'

describe('SocialMedia buttons', () => {
  let localVue = null
  let wrapper = null
  let shareUrl = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.component('icon', Icon)
    shareUrl = 'http://example.com'
    wrapper = mount(SocialMediaButtons, {
      localVue,
      propsData: {
        shareUrl: shareUrl
      }
    })
  })

  it('renders correctly', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('sets the correct Facebook URL', () => {
    const url = `http://www.facebook.com/sharer.php?u=${shareUrl}`
    expect(wrapper.vm.facebookUrl).toEqual(url)
  })

  it('sets the correct Twitter URL', () => {
    const url = `https://twitter.com/intent/tweet` +
      `?original_referer=${shareUrl}` +
      `&text=${testLocalConfig.tagline}&tw_p=tweetbutton&url=${shareUrl}`
    expect(wrapper.vm.twitterUrl).toEqual(url)
  })

  it('sets the correct Google Plus URL', () => {
    const url = `https://plus.google.com/share?url=${shareUrl}`
    expect(wrapper.vm.googleplusUrl).toEqual(url)
  })

  it('sets the correct LinkedIn URL', () => {
    const url = `https://www.linkedin.com/cws/share?url=${shareUrl}`
    expect(wrapper.vm.linkedinUrl).toEqual(url)
  })

  it('opens a popup window with the correct share URL', () => {
    const url = `http://www.facebook.com/sharer.php?u=${shareUrl}`
    const width = 100
    const height = 200
    const specs = `scrollbars=yes,width=${width},height=${height}`
    const mockFocus = jest.fn()
    const mockOpen = jest.fn(() => {
      return {
        focus: mockFocus
      }
    })
    window.open = mockOpen
    wrapper.vm.share('Facebook', url, width, height)
    expect(mockOpen).toHaveBeenCalledWith(url, 'Share', specs)
    expect(mockFocus).toHaveBeenCalled()
  })
})
