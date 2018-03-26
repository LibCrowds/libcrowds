import Vuex from 'vuex'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import NuxtLink from '@/.nuxt/components/nuxt-link'

import collection from '@/test/fixtures/collection.json'
import { mount, createLocalVue } from '@vue/test-utils'
import ErrorLayout from '@/layouts/error'
import { routes } from '@/test/fixtures/routes'

describe('Error layout', () => {
  let localVue = null
  let wrapper = null
  let router = null
  let store = null
  let error = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.component(NuxtLink.name, NuxtLink)
    localVue.use(VueRouter)
    router = new VueRouter({
      routes
    })
    localVue.use(Vuex)
    store = new Vuex.Store({
      state: {
        publishedCollections: [ collection ],
        currentUser: {
          name: 'joebloggs'
        }
      }
    })
    error = new Error()
    error.statusCode = 404
    wrapper = mount(ErrorLayout, {
      localVue,
      store,
      router,
      propsData: {
        error: error
      }
    })
  })

  it('renders correctly', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
