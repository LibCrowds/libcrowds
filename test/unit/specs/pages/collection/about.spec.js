import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'

import About from '@/pages/collection/_short_name/about'

describe('Collection about page', () => {
  let localVue = null
  let store = null
  let wrapper = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.use(Vuex)
    store = new Vuex.Store({
      state: {
        currentCollection: {
          info: {
            content: {
              about: '# About\n\nFoo'
            }
          }
        }
      },
      actions: {
        UPDATE_COLLECTION_NAV_ITEMS: () => ({})
      }
    })
  })

  it('renders correctly', () => {
    wrapper = mount(About, {
      localVue,
      store
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
