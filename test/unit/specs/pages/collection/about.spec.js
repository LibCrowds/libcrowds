import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

import { shallow } from 'vue-test-utils'

import About from '@/pages/collection/About'
import testSiteConfig from 'test/testSiteConfig'
import testMicrositeConfig from 'test/testMicrositeConfig'

Vue.use(BootstrapVue)

describe('Microsite about page', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(About, {
      propsData: {
        collectionConfig: testMicrositeConfig
      }
    })
  })

  it('sets the correct data', () => {
    expect(typeof About.data).toBe('function')
    const data = About.data()
    expect(data).toEqual({
      siteConfig: testSiteConfig
    })
  })

  it('sets the correct metaInfo', () => {
    const metaInfo = About.metaInfo()
    expect(metaInfo).toEqual({
      title: 'About',
      meta: [
        {
          name: 'description',
          content: `Learn more about the ${testSiteConfig.brand} platform`
        }
      ]
    })
  })

  it('computes the correct navItems when none', () => {
    wrapper.vm.collectionConfig.about = {}
    const navItems = wrapper.vm.navItems
    expect(navItems).toEqual([])
  })

  it('computes the correct navItems when not none', () => {
    wrapper.setProps({collectionConfig: testMicrositeConfig})
    const navItems = wrapper.vm.navItems
    expect(navItems).toEqual([])
  })
})
